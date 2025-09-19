require('dotenv').config();
const express = require('express');
const cors = require('cors');
const amqp = require('amqplib');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configurações do RabbitMQ
const RABBIT_URL = process.env.RABBIT_URL || 'amqp://localhost';
const QUEUE = process.env.QUEUE || 'notificacoes';

let channel;

// Inicializar conexão com RabbitMQ
async function initRabbitMQ() {
    try {
        console.log('Tentando conectar ao RabbitMQ...');
        const connection = await amqp.connect(RABBIT_URL);
        channel = await connection.createChannel();
        await channel.assertQueue(QUEUE, { durable: true });
        console.log('✅ Conectado ao RabbitMQ com sucesso!');
        return true;
    } catch (error) {
        console.error('❌ Erro ao conectar com RabbitMQ:', error.message);
        console.log('⚠️  O servidor continuará funcionando sem RabbitMQ');
        console.log('   Para instalar RabbitMQ via Docker:');
        console.log('   docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management');
        return false;
    }
}

// Função para publicar mensagem
async function publicarNotificacao(payload) {
    if (!channel) {
        throw new Error('RabbitMQ não inicializado');
    }
    
    const message = {
        ...payload,
        timestamp: new Date().toISOString(),
        id: Date.now().toString()
    };

    channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(message)), { 
        persistent: true 
    });

    return message;
}

// Função para consumir mensagens
async function iniciarConsumidor() {
    if (!channel) {
        console.log('⚠️  RabbitMQ não conectado - consumidor não iniciado');
        return;
    }

    try {
        channel.prefetch(1);
        
        channel.consume(QUEUE, async (msg) => {
            if (!msg) return;
            
            try {
                const payload = JSON.parse(msg.content.toString());
                console.log('📨 Mensagem recebida:', payload);
                
                // Aqui você pode processar a mensagem
                // Por exemplo, enviar para websockets, salvar no banco, etc.
                
                channel.ack(msg);
            } catch (error) {
                console.error('Erro ao processar mensagem:', error);
                channel.nack(msg, false, false);
            }
        }, { noAck: false });

        console.log('✅ Consumidor RabbitMQ iniciado');
    } catch (error) {
        console.error('❌ Erro ao iniciar consumidor:', error.message);
    }
}

// Rotas da API
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'Mensageria Server'
    });
});

// Rota para enviar mensagem
app.post('/api/enviar-mensagem', async (req, res) => {
    try {
        const { numPedido, mensagem, tipo = 'NOTIFICACAO' } = req.body;
        
        if (!numPedido || !mensagem) {
            return res.status(400).json({ 
                error: 'numPedido e mensagem são obrigatórios' 
            });
        }

        const payload = {
            numPedido,
            mensagem,
            tipo,
            status: 'ENVIADO'
        };

        if (!channel) {
            // Se RabbitMQ não estiver disponível, simula o envio
            console.log('⚠️  RabbitMQ não conectado - simulando envio da mensagem:', payload);
            const message = {
                ...payload,
                timestamp: new Date().toISOString(),
                id: Date.now().toString(),
                simulado: true
            };
            
            return res.json({ 
                success: true, 
                message: 'Mensagem simulada (RabbitMQ não conectado)',
                data: message
            });
        }

        const message = await publicarNotificacao(payload);
        
        res.json({ 
            success: true, 
            message: 'Mensagem enviada com sucesso',
            data: message
        });
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        res.status(500).json({ 
            error: 'Erro interno do servidor',
            details: error.message
        });
    }
});

// Rota para obter status da fila
app.get('/api/status-fila', async (req, res) => {
    try {
        if (!channel) {
            return res.json({
                queue: QUEUE,
                messageCount: 0,
                consumerCount: 0,
                status: 'RabbitMQ não conectado',
                connected: false
            });
        }

        const queueInfo = await channel.checkQueue(QUEUE);
        
        res.json({
            queue: QUEUE,
            messageCount: queueInfo.messageCount,
            consumerCount: queueInfo.consumerCount,
            status: 'Conectado',
            connected: true
        });
    } catch (error) {
        console.error('Erro ao obter status da fila:', error);
        res.status(500).json({ 
            error: 'Erro ao obter status da fila',
            details: error.message,
            connected: false
        });
    }
});

// Rota para tentar reconectar ao RabbitMQ
app.post('/api/reconectar-rabbitmq', async (req, res) => {
    try {
        const connected = await initRabbitMQ();
        
        if (connected) {
            await iniciarConsumidor();
            res.json({ 
                success: true, 
                message: 'Reconectado ao RabbitMQ com sucesso',
                connected: true 
            });
        } else {
            res.json({ 
                success: false, 
                message: 'Falha ao reconectar ao RabbitMQ',
                connected: false 
            });
        }
    } catch (error) {
        console.error('Erro ao reconectar:', error);
        res.status(500).json({ 
            success: false,
            error: 'Erro ao tentar reconectar',
            details: error.message,
            connected: false
        });
    }
});

// Inicializar servidor
async function startServer() {
    try {
        const rabbitConnected = await initRabbitMQ();
        
        if (rabbitConnected) {
            await iniciarConsumidor();
        }
        
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
            console.log(`🏥 Health check: http://localhost:${PORT}/health`);
            console.log(`📡 API Base: http://localhost:${PORT}/api`);
            
            if (!rabbitConnected) {
                console.log('\n⚠️  ATENÇÃO: RabbitMQ não está conectado!');
                console.log('   O sistema funcionará em modo simulação');
                console.log('   Para conectar o RabbitMQ:');
                console.log('   docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management');
            }
        });
    } catch (error) {
        console.error('❌ Erro ao iniciar servidor:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Desligando servidor...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('Desligando servidor...');
    process.exit(0);
});

startServer();