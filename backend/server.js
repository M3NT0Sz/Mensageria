const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const RideSystem = require('./ride-system');
const RabbitMQManager = require('./utils/rabbitmq');

class WebServer {
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = socketIO(this.server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });
        
        this.rideSystem = new RideSystem();
        this.rabbitmq = new RabbitMQManager();
        this.connectedUsers = new Map(); // Armazena conexões ativas
        this.activeDrivers = new Map(); // Motoristas online
        this.activePassengers = new Map(); // Passageiros online
        
        this.setupMiddleware();
        this.setupRoutes();
        this.setupSocketIO();
        this.startNotificationListeners();
    }

    setupMiddleware() {
        this.app.use(cors());
        this.app.use(express.json());
        
        // Servir arquivos estáticos do build do React
        this.app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));
        
        this.app.set('view engine', 'html');
    }

    setupRoutes() {
        // Página principal - Servir React App
        this.app.get('/', (req, res) => {
            const indexPath = path.join(__dirname, '..', 'frontend', 'dist', 'index.html');
            if (require('fs').existsSync(indexPath)) {
                res.sendFile(indexPath);
            } else {
                res.send(`
                    <h1>🚗 Sistema de Corridas</h1>
                    <p>Frontend React não encontrado. Execute:</p>
                    <code>npm run frontend:build</code>
                    <br><br>
                    <p>Ou inicie o desenvolvimento com:</p>
                    <code>npm run dev</code>
                `);
            }
        });

        // Rotas para React App (SPA)
        this.app.get(['/passenger', '/driver', '/admin'], (req, res) => {
            const indexPath = path.join(__dirname, '..', 'frontend', 'dist', 'index.html');
            if (require('fs').existsSync(indexPath)) {
                res.sendFile(indexPath);
            } else {
                res.redirect('/');
            }
        });

        // API Endpoints
        this.setupAPIRoutes();
    }

    setupAPIRoutes() {
        // Solicitar corrida
        this.app.post('/api/rides/request', async (req, res) => {
            try {
                const { passengerId, pickup, destination } = req.body;
                
                if (!passengerId || !pickup || !destination) {
                    return res.status(400).json({ error: 'Dados obrigatórios: passengerId, pickup, destination' });
                }

                const ride = await this.rideSystem.requestRide(passengerId, pickup, destination);
                
                // Notifica motoristas via WebSocket
                this.io.to('drivers').emit('ride_request', ride);
                
                res.json({ success: true, ride });
            } catch (error) {
                console.error('Erro ao solicitar corrida:', error);
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });

        // Aceitar corrida
        this.app.post('/api/rides/accept', async (req, res) => {
            try {
                const { driverId, rideId } = req.body;
                
                if (!driverId || !rideId) {
                    return res.status(400).json({ error: 'Dados obrigatórios: driverId, rideId' });
                }

                const ride = await this.rideSystem.acceptRide(driverId, rideId);
                
                if (ride) {
                    // Notifica passageiro via WebSocket
                    this.io.to(`passenger_${ride.passengerId}`).emit('ride_accepted', {
                        rideId,
                        driverId,
                        driver: this.activeDrivers.get(driverId)
                    });

                    // Notifica outros motoristas que a corrida foi aceita
                    this.io.to('drivers').emit('ride_taken', { rideId });
                    
                    res.json({ success: true, ride });
                } else {
                    res.status(404).json({ error: 'Corrida não encontrada ou já aceita' });
                }
            } catch (error) {
                console.error('Erro ao aceitar corrida:', error);
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });

        // Atualizar status da corrida
        this.app.post('/api/rides/update-status', async (req, res) => {
            try {
                const { rideId, status, message } = req.body;
                
                if (!rideId || !status) {
                    return res.status(400).json({ error: 'Dados obrigatórios: rideId, status' });
                }

                const ride = await this.rideSystem.updateRideStatus(rideId, status, message);
                
                if (ride) {
                    // Notifica passageiro e motorista via WebSocket
                    this.io.to(`passenger_${ride.passengerId}`).emit('status_update', {
                        rideId,
                        status,
                        message,
                        ride
                    });

                    if (ride.driverId) {
                        this.io.to(`driver_${ride.driverId}`).emit('status_update', {
                            rideId,
                            status,
                            message,
                            ride
                        });
                    }
                    
                    res.json({ success: true, ride });
                } else {
                    res.status(404).json({ error: 'Corrida não encontrada' });
                }
            } catch (error) {
                console.error('Erro ao atualizar status:', error);
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });

        // Listar corridas
        this.app.get('/api/rides', (req, res) => {
            try {
                const { status, passengerId, driverId } = req.query;
                let rides = this.rideSystem.getAllRides();

                if (status) {
                    rides = rides.filter(ride => ride.status === status);
                }
                if (passengerId) {
                    rides = rides.filter(ride => ride.passengerId === passengerId);
                }
                if (driverId) {
                    rides = rides.filter(ride => ride.driverId === driverId);
                }

                // Ordenar por timestamp decrescente (mais recentes primeiro)
                rides = rides.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

                res.json({ success: true, rides });
            } catch (error) {
                console.error('Erro ao listar corridas:', error);
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });

        // Estatísticas
        this.app.get('/api/stats', (req, res) => {
            try {
                const rides = this.rideSystem.getAllRides();
                const stats = {
                    total: rides.length,
                    pending: rides.filter(r => r.status === 'PENDING').length,
                    accepted: rides.filter(r => r.status === 'ACCEPTED').length,
                    inProgress: rides.filter(r => r.status === 'IN_PROGRESS').length,
                    completed: rides.filter(r => r.status === 'COMPLETED').length,
                    cancelled: rides.filter(r => r.status === 'CANCELLED').length,
                    totalRevenue: rides
                        .filter(r => r.status === 'COMPLETED')
                        .reduce((sum, ride) => sum + ride.estimatedPrice, 0),
                    activeDrivers: this.activeDrivers.size,
                    activePassengers: this.activePassengers.size
                };

                res.json({ success: true, stats });
            } catch (error) {
                console.error('Erro ao obter estatísticas:', error);
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }

    setupSocketIO() {
        this.io.on('connection', (socket) => {
            console.log(`🔌 Nova conexão WebSocket: ${socket.id}`);

            // Registrar usuário (passageiro ou motorista)
            socket.on('register', (data) => {
                const { type, userId, userInfo } = data;
                
                this.connectedUsers.set(socket.id, { type, userId, userInfo });
                
                if (type === 'driver') {
                    this.activeDrivers.set(userId, { ...userInfo, socketId: socket.id, status: 'AVAILABLE' });
                    socket.join('drivers');
                    socket.join(`driver_${userId}`);
                    console.log(`🚗 Motorista ${userId} conectado`);
                    
                    // Enviar lista de corridas pendentes para o motorista
                    const pendingRides = this.rideSystem.getPendingRides();
                    socket.emit('ride_updates', pendingRides);
                } else if (type === 'passenger') {
                    this.activePassengers.set(userId, { ...userInfo, socketId: socket.id });
                    socket.join(`passenger_${userId}`);
                    console.log(`👤 Passageiro ${userId} conectado`);
                }
            });

            // Motorista solicita corridas disponíveis
            socket.on('get_available_rides', () => {
                const user = this.connectedUsers.get(socket.id);
                if (user && user.type === 'driver') {
                    const pendingRides = this.rideSystem.getPendingRides();
                    socket.emit('ride_updates', pendingRides);
                }
            });

            // Desconexão
            socket.on('disconnect', () => {
                const user = this.connectedUsers.get(socket.id);
                if (user) {
                    if (user.type === 'driver') {
                        this.activeDrivers.delete(user.userId);
                        console.log(`🚗 Motorista ${user.userId} desconectado`);
                    } else if (user.type === 'passenger') {
                        this.activePassengers.delete(user.userId);
                        console.log(`👤 Passageiro ${user.userId} desconectado`);
                    }
                }
                this.connectedUsers.delete(socket.id);
            });
        });
    }

    // Escutar notificações do RabbitMQ e repassar via WebSocket
    async startNotificationListeners() {
        // Escutar corridas pendentes
        await this.rabbitmq.consumeMessages('corridas_pendentes', (rideRequest) => {
            console.log('🚗 Nova corrida solicitada por ' + rideRequest.passengerId + ':', rideRequest);
            // Enviar para todos os motoristas online
            this.io.to('drivers').emit('ride_request', rideRequest);
        });

        console.log('📡 Listeners de notificação iniciados');
    }

    start(port = 3000) {
        this.server.listen(port, () => {
            console.log(`\n🌐 Servidor web iniciado em http://localhost:${port}`);
            console.log(`👤 Passageiros: http://localhost:${port}/passenger`);
            console.log(`🚗 Motoristas: http://localhost:${port}/driver`);
            console.log(`📊 Admin: http://localhost:${port}/admin`);
            console.log('\n📡 WebSocket ativo para atualizações em tempo real');
        });
    }

    async stop() {
        await this.rideSystem.close();
        await this.rabbitmq.close();
        this.server.close();
    }
}

// Executar servidor se chamado diretamente
if (require.main === module) {
    const server = new WebServer();
    server.start(process.env.PORT || 3000);

    // Graceful shutdown
    process.on('SIGINT', async () => {
        console.log('\n👋 Encerrando servidor web...');
        await server.stop();
        process.exit(0);
    });
}

module.exports = WebServer;