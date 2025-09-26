const RabbitMQManager = require('./utils/rabbitmq');
const RideSystem = require('./ride-system');

class PassengerSimulator {
    constructor(passengerId) {
        this.passengerId = passengerId;
        this.rabbitmq = new RabbitMQManager();
        this.rideSystem = new RideSystem();
        this.notificationQueue = `notificacoes_passageiro_${passengerId}`;
    }

    async initialize() {
        // Registra o passageiro no sistema
        this.rideSystem.registerPassenger(this.passengerId, {
            name: `Passageiro ${this.passengerId}`,
            phone: this.generatePhone()
        });

        // Inicia escuta de notificações
        await this.startListening();
    }

    // Solicitar uma corrida
    async requestRide(pickup, destination) {
        console.log(`\n👤 ${this.passengerId} solicitando corrida:`);
        console.log(`📍 De: ${pickup}`);
        console.log(`📍 Para: ${destination}`);
        
        const ride = await this.rideSystem.requestRide(this.passengerId, pickup, destination);
        console.log(`💰 Preço estimado: R$ ${ride.estimatedPrice}`);
        
        return ride;
    }

    // Escutar notificações
    async startListening() {
        await this.rabbitmq.consumeMessages(this.notificationQueue, (notification) => {
            this.handleNotification(notification);
        });
    }

    // Processar notificações recebidas
    handleNotification(notification) {
        const timestamp = new Date(notification.timestamp).toLocaleTimeString();
        
        console.log(`\n📱 [${timestamp}] Notificação para ${this.passengerId}:`);
        
        switch (notification.type) {
            case 'RIDE_ACCEPTED':
                console.log(`✅ ${notification.message}`);
                console.log(`🚗 Motorista: ${notification.driverId}`);
                console.log(`⏰ Tempo estimado: ${notification.estimatedArrival}`);
                break;
                
            case 'STATUS_UPDATE':
                console.log(`📊 Status: ${notification.oldStatus} → ${notification.newStatus}`);
                console.log(`💬 ${notification.message}`);
                
                if (notification.newStatus === 'DRIVER_ARRIVED') {
                    console.log(`🚗 Seu motorista chegou! Dirija-se ao veículo.`);
                } else if (notification.newStatus === 'IN_PROGRESS') {
                    console.log(`🛣️  Corrida iniciada! Boa viagem!`);
                } else if (notification.newStatus === 'COMPLETED') {
                    console.log(`🏁 Corrida finalizada! Obrigado por usar nosso serviço.`);
                    console.log(`⭐ Não se esqueça de avaliar seu motorista!`);
                }
                break;
                
            default:
                console.log(`ℹ️  ${notification.message || 'Notificação recebida'}`);
        }
    }

    // Cancelar corrida
    async cancelRide(rideId, reason = 'Cancelado pelo passageiro') {
        console.log(`\n❌ ${this.passengerId} cancelando corrida ${rideId}`);
        await this.rideSystem.updateRideStatus(rideId, 'CANCELLED', reason);
    }

    // Gerar número de telefone fictício
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
    const passengerId = process.argv[2] || 'passenger_001';
    const pickup = process.argv[3] || 'Shopping Center Norte';
    const destination = process.argv[4] || 'Aeroporto de Congonhas';

    const passenger = new PassengerSimulator(passengerId);

    async function runSimulation() {
        try {
            await passenger.initialize();
            
            // Espera um pouco antes de solicitar corrida
            setTimeout(async () => {
                await passenger.requestRide(pickup, destination);
            }, 1000);

            // Mantém o processo ativo para receber notificações
            console.log(`\n🎧 ${passengerId} aguardando notificações...`);
            console.log('Pressione Ctrl+C para sair\n');

        } catch (error) {
            console.error('Erro na simulação do passageiro:', error);
        }
    }

    runSimulation();

    // Graceful shutdown
    process.on('SIGINT', async () => {
        console.log('\n👋 Encerrando simulação do passageiro...');
        await passenger.close();
        process.exit(0);
    });
}

module.exports = PassengerSimulator;