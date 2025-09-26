const RabbitMQManager = require('./utils/rabbitmq');
const RideSystem = require('./ride-system');

class DriverSimulator {
    constructor(driverId) {
        this.driverId = driverId;
        this.rabbitmq = new RabbitMQManager();
        this.rideSystem = new RideSystem();
        this.isAvailable = true;
        this.currentRide = null;
        this.notificationQueue = `notificacoes_motorista_${driverId}`;
    }

    async initialize() {
        // Registra o motorista no sistema
        this.rideSystem.registerDriver(this.driverId, {
            name: `Motorista ${this.driverId}`,
            vehicle: this.generateVehicleInfo(),
            rating: (4.0 + Math.random() * 1.0).toFixed(1),
            phone: this.generatePhone()
        });

        // Inicia escuta de corridas pendentes e notificações
        await Promise.all([
            this.listenForRideRequests(),
            this.listenForNotifications()
        ]);
    }

    // Escutar corridas pendentes
    async listenForRideRequests() {
        await this.rabbitmq.consumeMessages('corridas_pendentes', async (rideRequest) => {
            if (this.isAvailable) {
                await this.handleRideRequest(rideRequest);
            }
        });
    }

    // Escutar notificações específicas do motorista
    async listenForNotifications() {
        await this.rabbitmq.consumeMessages(this.notificationQueue, (notification) => {
            this.handleNotification(notification);
        });
    }

    // Processar solicitação de corrida
    async handleRideRequest(rideRequest) {
        const timestamp = new Date().toLocaleTimeString();
        
        console.log(`\n🔔 [${timestamp}] Nova solicitação de corrida para ${this.driverId}:`);
        console.log(`📍 De: ${rideRequest.pickup}`);
        console.log(`📍 Para: ${rideRequest.destination}`);
        console.log(`👤 Passageiro: ${rideRequest.passengerId}`);
        console.log(`💰 Preço estimado: R$ ${rideRequest.estimatedPrice}`);
        
        // Simula decisão do motorista (70% de chance de aceitar)
        const shouldAccept = Math.random() > 0.3;
        
        if (shouldAccept && this.isAvailable) {
            setTimeout(async () => {
                await this.acceptRide(rideRequest.id);
            }, 2000 + Math.random() * 3000); // Delay de 2-5 segundos para simular tempo de decisão
        } else {
            console.log(`❌ ${this.driverId} não aceitou a corrida (${!this.isAvailable ? 'indisponível' : 'recusou'})`);
        }
    }

    // Aceitar corrida
    async acceptRide(rideId) {
        const ride = await this.rideSystem.acceptRide(this.driverId, rideId);
        
        if (ride) {
            this.isAvailable = false;
            this.currentRide = ride;
            
            console.log(`✅ ${this.driverId} aceitou a corrida ${rideId}!`);
            console.log(`🚗 Indo buscar o passageiro...`);
            
            // Simula sequência de status da corrida
            this.simulateRideProgress(rideId);
        }
    }

    // Simular progresso da corrida
    async simulateRideProgress(rideId) {
        try {
            // Motorista a caminho (3-8 segundos)
            setTimeout(async () => {
                await this.rideSystem.updateRideStatus(rideId, 'DRIVER_ARRIVED', 
                    'Motorista chegou no local de coleta');
            }, 3000 + Math.random() * 5000);

            // Corrida iniciada (8-15 segundos após aceitar)
            setTimeout(async () => {
                await this.rideSystem.updateRideStatus(rideId, 'IN_PROGRESS', 
                    'Corrida iniciada! Destino: ' + this.currentRide.destination);
            }, 8000 + Math.random() * 7000);

            // Corrida finalizada (20-30 segundos após aceitar)
            setTimeout(async () => {
                await this.rideSystem.updateRideStatus(rideId, 'COMPLETED', 
                    'Corrida finalizada com sucesso!');
                    
                this.completeRide();
            }, 20000 + Math.random() * 10000);

        } catch (error) {
            console.error('Erro durante simulação da corrida:', error);
        }
    }

    // Finalizar corrida e ficar disponível novamente
    completeRide() {
        console.log(`\n🏁 ${this.driverId} finalizou a corrida!`);
        console.log(`💰 Corrida paga via aplicativo`);
        console.log(`⭐ Aguardando avaliação do passageiro...`);
        
        this.isAvailable = true;
        this.currentRide = null;
        
        console.log(`\n🟢 ${this.driverId} está disponível para novas corridas`);
    }

    // Processar notificações
    handleNotification(notification) {
        const timestamp = new Date(notification.timestamp).toLocaleTimeString();
        console.log(`\n📱 [${timestamp}] Notificação para ${this.driverId}:`);
        console.log(`ℹ️  ${notification.message || 'Notificação recebida'}`);
    }

    // Cancelar corrida atual
    async cancelCurrentRide(reason = 'Cancelado pelo motorista') {
        if (this.currentRide) {
            console.log(`\n❌ ${this.driverId} cancelando corrida ${this.currentRide.id}`);
            await this.rideSystem.updateRideStatus(this.currentRide.id, 'CANCELLED', reason);
            
            this.isAvailable = true;
            this.currentRide = null;
        }
    }

    // Gerar informações do veículo
    generateVehicleInfo() {
        const brands = ['Toyota', 'Honda', 'Hyundai', 'Chevrolet', 'Volkswagen', 'Ford'];
        const models = ['Corolla', 'Civic', 'HB20', 'Onix', 'Polo', 'Ka'];
        const colors = ['Branco', 'Prata', 'Preto', 'Azul', 'Vermelho'];
        
        return {
            brand: brands[Math.floor(Math.random() * brands.length)],
            model: models[Math.floor(Math.random() * models.length)],
            color: colors[Math.floor(Math.random() * colors.length)],
            plate: this.generatePlate(),
            year: 2018 + Math.floor(Math.random() * 6)
        };
    }

    // Gerar placa
    generatePlate() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        return `${letters[Math.floor(Math.random() * 26)]}${letters[Math.floor(Math.random() * 26)]}${letters[Math.floor(Math.random() * 26)]}-${numbers[Math.floor(Math.random() * 10)]}${numbers[Math.floor(Math.random() * 10)]}${numbers[Math.floor(Math.random() * 10)]}${numbers[Math.floor(Math.random() * 10)]}`;
    }

    // Gerar telefone
    generatePhone() {
        return `(11) 9${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    }

    async close() {
        await this.rabbitmq.close();
        await this.rideSystem.close();
    }
}

// Uso via linha de comando
if (require.main === module) {
    const driverId = process.argv[2] || 'driver_001';
    const driver = new DriverSimulator(driverId);

    async function runSimulation() {
        try {
            await driver.initialize();
            
            console.log(`\n🚗 ${driverId} online e aguardando corridas...`);
            console.log('Pressione Ctrl+C para sair\n');

        } catch (error) {
            console.error('Erro na simulação do motorista:', error);
        }
    }

    runSimulation();

    // Graceful shutdown
    process.on('SIGINT', async () => {
        console.log('\n👋 Encerrando simulação do motorista...');
        await driver.close();
        process.exit(0);
    });
}

module.exports = DriverSimulator;