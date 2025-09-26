const RideSystem = require('./ride-system');

class RideStatusManager {
    constructor() {
        this.rideSystem = new RideSystem();
    }

    // Monitorar todas as corridas
    async monitorRides() {
        console.log('\n📊 === MONITOR DE CORRIDAS ===\n');
        
        const allRides = this.rideSystem.getAllRides();
        
        if (allRides.length === 0) {
            console.log('🚫 Nenhuma corrida encontrada no sistema');
            return;
        }

        allRides.forEach(ride => {
            this.displayRideInfo(ride);
        });

        // Exibir estatísticas
        this.displayStatistics(allRides);
    }

    // Exibir informações de uma corrida
    displayRideInfo(ride) {
        const statusEmoji = this.getStatusEmoji(ride.status);
        const timestamp = new Date(ride.timestamp).toLocaleTimeString();
        
        console.log(`${statusEmoji} Corrida ${ride.id}`);
        console.log(`   👤 Passageiro: ${ride.passengerId}`);
        console.log(`   📍 De: ${ride.pickup}`);
        console.log(`   📍 Para: ${ride.destination}`);
        console.log(`   💰 Preço: R$ ${ride.estimatedPrice}`);
        console.log(`   📊 Status: ${ride.status}`);
        console.log(`   🕐 Criada em: ${timestamp}`);
        
        if (ride.driverId) {
            console.log(`   🚗 Motorista: ${ride.driverId}`);
        }
        
        if (ride.acceptedAt) {
            const acceptedTime = new Date(ride.acceptedAt).toLocaleTimeString();
            console.log(`   ✅ Aceita em: ${acceptedTime}`);
        }
        
        if (ride.lastUpdate) {
            const updateTime = new Date(ride.lastUpdate).toLocaleTimeString();
            console.log(`   🔄 Última atualização: ${updateTime}`);
        }
        
        console.log('');
    }

    // Obter emoji para o status
    getStatusEmoji(status) {
        const emojis = {
            'PENDING': '⏳',
            'ACCEPTED': '✅',
            'DRIVER_ARRIVED': '🚗',
            'IN_PROGRESS': '🛣️',
            'COMPLETED': '🏁',
            'CANCELLED': '❌'
        };
        return emojis[status] || '📋';
    }

    // Exibir estatísticas
    displayStatistics(rides) {
        const stats = {
            total: rides.length,
            pending: rides.filter(r => r.status === 'PENDING').length,
            accepted: rides.filter(r => r.status === 'ACCEPTED').length,
            inProgress: rides.filter(r => r.status === 'IN_PROGRESS').length,
            completed: rides.filter(r => r.status === 'COMPLETED').length,
            cancelled: rides.filter(r => r.status === 'CANCELLED').length
        };

        const totalRevenue = rides
            .filter(r => r.status === 'COMPLETED')
            .reduce((sum, ride) => sum + ride.estimatedPrice, 0);

        console.log('📈 === ESTATÍSTICAS ===');
        console.log(`📊 Total de corridas: ${stats.total}`);
        console.log(`⏳ Pendentes: ${stats.pending}`);
        console.log(`✅ Aceitas: ${stats.accepted}`);
        console.log(`🛣️  Em progresso: ${stats.inProgress}`);
        console.log(`🏁 Completadas: ${stats.completed}`);
        console.log(`❌ Canceladas: ${stats.cancelled}`);
        console.log(`💰 Receita total: R$ ${totalRevenue.toFixed(2)}`);
        
        if (stats.total > 0) {
            const completionRate = ((stats.completed / stats.total) * 100).toFixed(1);
            console.log(`📊 Taxa de conclusão: ${completionRate}%`);
        }
        console.log('');
    }

    // Atualizar status manualmente
    async updateRideStatus(rideId, newStatus, message) {
        console.log(`\n🔄 Atualizando corrida ${rideId} para status: ${newStatus}`);
        
        const result = await this.rideSystem.updateRideStatus(rideId, newStatus, message);
        
        if (result) {
            console.log('✅ Status atualizado com sucesso!');
            this.displayRideInfo(result);
        } else {
            console.log('❌ Falha ao atualizar status da corrida');
        }
        
        return result;
    }

    // Listar corridas por status
    async listRidesByStatus(status) {
        const allRides = this.rideSystem.getAllRides();
        const filteredRides = allRides.filter(ride => ride.status === status);

        console.log(`\n📋 Corridas com status: ${status}`);
        console.log(`📊 Total encontradas: ${filteredRides.length}\n`);

        if (filteredRides.length > 0) {
            filteredRides.forEach(ride => this.displayRideInfo(ride));
        } else {
            console.log(`🚫 Nenhuma corrida encontrada com status: ${status}`);
        }
    }

    // Cancelar corrida
    async cancelRide(rideId, reason = 'Cancelamento administrativo') {
        console.log(`\n❌ Cancelando corrida ${rideId}`);
        console.log(`📝 Motivo: ${reason}`);
        
        const result = await this.rideSystem.updateRideStatus(rideId, 'CANCELLED', reason);
        
        if (result) {
            console.log('✅ Corrida cancelada com sucesso!');
        }
        
        return result;
    }

    // Simular múltiplas corridas para teste
    async generateTestRides(count = 3) {
        console.log(`\n🧪 Gerando ${count} corridas de teste...\n`);

        const pickupLocations = [
            'Shopping Ibirapuera',
            'Estação da Sé',
            'Aeroporto de Guarulhos',
            'Shopping Center Norte',
            'Universidade de São Paulo',
            'Teatro Municipal'
        ];

        const destinations = [
            'Aeroporto de Congonhas',
            'Shopping Vila Olímpia',
            'Estação da Luz',
            'Parque do Ibirapuera',
            'Centro Empresarial',
            'Hospital das Clínicas'
        ];

        for (let i = 1; i <= count; i++) {
            const passengerId = `test_passenger_${i.toString().padStart(3, '0')}`;
            const pickup = pickupLocations[Math.floor(Math.random() * pickupLocations.length)];
            const destination = destinations[Math.floor(Math.random() * destinations.length)];

            await this.rideSystem.requestRide(passengerId, pickup, destination);
            
            // Pequeno delay entre criações
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        console.log(`✅ ${count} corridas de teste criadas!`);
    }

    async close() {
        await this.rideSystem.close();
    }
}

// Uso via linha de comando
if (require.main === module) {
    const statusManager = new RideStatusManager();

    async function runStatusManager() {
        try {
            const command = process.argv[2];
            const arg1 = process.argv[3];
            const arg2 = process.argv[4];

            switch (command) {
                case 'monitor':
                    await statusManager.monitorRides();
                    break;

                case 'update':
                    if (!arg1 || !arg2) {
                        console.log('Uso: node ride-status.js update <rideId> <newStatus> [message]');
                        break;
                    }
                    const message = process.argv[5] || '';
                    await statusManager.updateRideStatus(arg1, arg2, message);
                    break;

                case 'list':
                    if (!arg1) {
                        console.log('Uso: node ride-status.js list <status>');
                        console.log('Status válidos: PENDING, ACCEPTED, DRIVER_ARRIVED, IN_PROGRESS, COMPLETED, CANCELLED');
                        break;
                    }
                    await statusManager.listRidesByStatus(arg1);
                    break;

                case 'cancel':
                    if (!arg1) {
                        console.log('Uso: node ride-status.js cancel <rideId> [reason]');
                        break;
                    }
                    const reason = arg2 || 'Cancelamento administrativo';
                    await statusManager.cancelRide(arg1, reason);
                    break;

                case 'test':
                    const count = parseInt(arg1) || 3;
                    await statusManager.generateTestRides(count);
                    break;

                default:
                    console.log('🔧 === GERENCIADOR DE STATUS DE CORRIDAS ===\n');
                    console.log('Comandos disponíveis:');
                    console.log('  monitor                              - Monitorar todas as corridas');
                    console.log('  list <status>                        - Listar corridas por status');
                    console.log('  update <rideId> <status> [message]   - Atualizar status de uma corrida');
                    console.log('  cancel <rideId> [reason]             - Cancelar uma corrida');
                    console.log('  test [count]                         - Gerar corridas de teste');
                    console.log('\nExemplos:');
                    console.log('  node ride-status.js monitor');
                    console.log('  node ride-status.js list PENDING');
                    console.log('  node ride-status.js update ride_123 COMPLETED');
                    console.log('  node ride-status.js test 5');
            }

        } catch (error) {
            console.error('Erro no gerenciador de status:', error);
        } finally {
            await statusManager.close();
        }
    }

    runStatusManager();
}

module.exports = RideStatusManager;