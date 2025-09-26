const RabbitMQManager = require('./utils/rabbitmq');

class RideSystem {
    constructor() {
        this.rabbitmq = new RabbitMQManager();
        this.rides = new Map(); // Armazena corridas ativas
        this.drivers = new Map(); // Motoristas ativos
        this.passengers = new Map(); // Passageiros ativos
    }

    // Gerar ID único para corridas
    generateRideId() {
        return 'ride_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Solicitar corrida (usado pelo passageiro)
    async requestRide(passengerId, pickup, destination) {
        const rideId = this.generateRideId();
        const rideRequest = {
            id: rideId,
            passengerId,
            pickup,
            destination,
            status: 'PENDING',
            timestamp: new Date().toISOString(),
            estimatedPrice: this.calculatePrice(pickup, destination)
        };

        // Armazena a corrida
        this.rides.set(rideId, rideRequest);
        
        // Publica na fila de corridas pendentes
        await this.rabbitmq.publishMessage('corridas_pendentes', rideRequest);
        
        console.log(`🚗 Nova corrida solicitada por ${passengerId}:`, rideRequest);
        return rideRequest;
    }

    // Aceitar corrida (usado pelo motorista)
    async acceptRide(driverId, rideId) {
        const ride = this.rides.get(rideId);
        
        if (!ride || ride.status !== 'PENDING') {
            console.log(`❌ Corrida ${rideId} não disponível para aceite`);
            return null;
        }

        // Atualiza o status da corrida
        ride.status = 'ACCEPTED';
        ride.driverId = driverId;
        ride.acceptedAt = new Date().toISOString();
        
        this.rides.set(rideId, ride);

        // Notifica o passageiro
        const notification = {
            type: 'RIDE_ACCEPTED',
            rideId,
            driverId,
            message: `Corrida aceita pelo motorista ${driverId}!`,
            estimatedArrival: '5-10 minutos',
            timestamp: new Date().toISOString()
        };

        await this.rabbitmq.publishMessage(`notificacoes_passageiro_${ride.passengerId}`, notification);
        
        console.log(`✅ Corrida ${rideId} aceita pelo motorista ${driverId}`);
        return ride;
    }

    // Atualizar status da corrida
    async updateRideStatus(rideId, newStatus, message = '') {
        const ride = this.rides.get(rideId);
        
        if (!ride) {
            console.log(`❌ Corrida ${rideId} não encontrada`);
            return null;
        }

        const oldStatus = ride.status;
        ride.status = newStatus;
        ride.lastUpdate = new Date().toISOString();

        // Notifica o passageiro sobre mudança de status
        const notification = {
            type: 'STATUS_UPDATE',
            rideId,
            oldStatus,
            newStatus,
            message: message || this.getStatusMessage(newStatus),
            timestamp: new Date().toISOString()
        };

        await this.rabbitmq.publishMessage(`notificacoes_passageiro_${ride.passengerId}`, notification);

        // Se houver motorista, também notifica ele
        if (ride.driverId) {
            await this.rabbitmq.publishMessage(`notificacoes_motorista_${ride.driverId}`, notification);
        }

        console.log(`📱 Status da corrida ${rideId} atualizado: ${oldStatus} → ${newStatus}`);
        return ride;
    }

    // Obter mensagem amigável do status
    getStatusMessage(status) {
        const messages = {
            'PENDING': 'Procurando motorista...',
            'ACCEPTED': 'Motorista a caminho!',
            'DRIVER_ARRIVED': 'Motorista chegou no local de coleta',
            'IN_PROGRESS': 'Corrida em andamento',
            'COMPLETED': 'Corrida finalizada com sucesso',
            'CANCELLED': 'Corrida cancelada'
        };
        return messages[status] || 'Status atualizado';
    }

    // Simular cálculo de preço
    calculatePrice(pickup, destination) {
        const basePrice = 5.00;
        const distancePrice = Math.random() * 20; // Simula distância
        return parseFloat((basePrice + distancePrice).toFixed(2));
    }

    // Listar corridas pendentes
    getPendingRides() {
        return Array.from(this.rides.values()).filter(ride => ride.status === 'PENDING');
    }

    // Listar todas as corridas
    getAllRides() {
        return Array.from(this.rides.values());
    }

    // Registrar motorista como ativo
    registerDriver(driverId, driverInfo) {
        this.drivers.set(driverId, {
            ...driverInfo,
            status: 'AVAILABLE',
            registeredAt: new Date().toISOString()
        });
        console.log(`👨‍💼 Motorista ${driverId} registrado e disponível`);
    }

    // Registrar passageiro
    registerPassenger(passengerId, passengerInfo) {
        this.passengers.set(passengerId, {
            ...passengerInfo,
            registeredAt: new Date().toISOString()
        });
        console.log(`👤 Passageiro ${passengerId} registrado`);
    }

    async close() {
        await this.rabbitmq.close();
    }
}

module.exports = RideSystem;