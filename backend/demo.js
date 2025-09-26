const PassengerSimulator = require('./passenger');
const DriverSimulator = require('./driver');
const RideStatusManager = require('./ride-status');

class RideSystemDemo {
    constructor() {
        this.passengers = [];
        this.drivers = [];
        this.statusManager = new RideStatusManager();
        this.isRunning = false;
    }

    async initialize() {
        console.log('🚀 === DEMONSTRAÇÃO DO SISTEMA DE CORRIDAS ===\n');
        console.log('Iniciializando sistema...');
        
        // Criar motoristas
        const driverIds = ['motorista_joao', 'motorista_maria', 'motorista_carlos'];
        for (const driverId of driverIds) {
            const driver = new DriverSimulator(driverId);
            await driver.initialize();
            this.drivers.push(driver);
        }

        console.log(`✅ ${this.drivers.length} motoristas online\n`);

        // Aguardar um pouco antes de criar passageiros
        await this.sleep(2000);
    }

    // Simular múltiplos passageiros solicitando corridas
    async simulatePassengerRequests() {
        console.log('👥 === SIMULANDO SOLICITAÇÕES DE CORRIDAS ===\n');

        const passengerData = [
            {
                id: 'ana_silva',
                pickup: 'Shopping Ibirapuera',
                destination: 'Aeroporto de Congonhas'
            },
            {
                id: 'bruno_costa',
                pickup: 'Estação da Sé',
                destination: 'Shopping Vila Olímpia'
            },
            {
                id: 'carla_santos',
                pickup: 'Universidade de São Paulo',
                destination: 'Teatro Municipal'
            }
        ];

        // Criar e inicializar passageiros
        for (let i = 0; i < passengerData.length; i++) {
            const data = passengerData[i];
            const passenger = new PassengerSimulator(data.id);
            await passenger.initialize();
            this.passengers.push(passenger);

            // Solicitar corrida após um pequeno delay
            setTimeout(async () => {
                console.log(`\n🔔 ${data.id} está solicitando uma corrida...`);
                await passenger.requestRide(data.pickup, data.destination);
            }, 3000 + (i * 2000)); // Escalonar as solicitações
        }
    }

    // Monitorar o sistema periodicamente
    async startMonitoring() {
        console.log('\n📊 === INICIANDO MONITORAMENTO ===\n');
        
        const monitorInterval = setInterval(async () => {
            if (!this.isRunning) {
                clearInterval(monitorInterval);
                return;
            }

            console.log('\n' + '='.repeat(60));
            console.log('📊 STATUS ATUAL DO SISTEMA');
            console.log('='.repeat(60));
            
            await this.statusManager.monitorRides();
            
            console.log('⏰ Próxima atualização em 15 segundos...\n');
            
        }, 15000); // Atualizar a cada 15 segundos

        // Para o monitoramento após 2 minutos
        setTimeout(() => {
            clearInterval(monitorInterval);
            console.log('\n⏹️  Monitoramento finalizado automaticamente após 2 minutos');
        }, 120000);
    }

    // Simular cenário completo
    async runCompleteDemo() {
        try {
            this.isRunning = true;
            
            // 1. Inicializar sistema
            await this.initialize();
            
            // 2. Iniciar monitoramento
            this.startMonitoring();
            
            // 3. Simular solicitações de passageiros
            await this.simulatePassengerRequests();
            
            // 4. Aguardar um tempo para as corridas processarem
            console.log('\n⏳ Aguardando corridas serem processadas...');
            console.log('Pressione Ctrl+C para interromper a demonstração\n');

        } catch (error) {
            console.error('❌ Erro durante demonstração:', error);
        }
    }

    // Simular cenário de alta demanda
    async simulateHighDemand() {
        console.log('🔥 === SIMULANDO ALTA DEMANDA ===\n');
        
        // Criar mais motoristas
        const extraDrivers = ['motorista_pedro', 'motorista_lucia', 'motorista_rafael'];
        for (const driverId of extraDrivers) {
            const driver = new DriverSimulator(driverId);
            await driver.initialize();
            this.drivers.push(driver);
        }

        // Criar muitas solicitações
        const locations = [
            'Shopping Center Norte', 'Aeroporto de Guarulhos', 'Estação da Luz',
            'Parque do Ibirapuera', 'Centro Empresarial', 'Hospital das Clínicas',
            'Shopping Eldorado', 'Universidade Mackenzie', 'Memorial da América Latina'
        ];

        for (let i = 1; i <= 8; i++) {
            const passengerId = `rush_passenger_${i}`;
            const passenger = new PassengerSimulator(passengerId);
            await passenger.initialize();
            
            const pickup = locations[Math.floor(Math.random() * locations.length)];
            const destination = locations[Math.floor(Math.random() * locations.length)];
            
            setTimeout(async () => {
                await passenger.requestRide(pickup, destination);
            }, i * 1000);
            
            this.passengers.push(passenger);
        }

        console.log('📈 8 corridas adicionais solicitadas em sequência rápida!');
    }

    // Utilitário para pausar execução
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Finalizar demonstração
    async cleanup() {
        console.log('\n🧹 Finalizando demonstração...');
        
        this.isRunning = false;

        // Fechar todas as conexões
        const closePromises = [];
        
        this.passengers.forEach(passenger => {
            closePromises.push(passenger.close());
        });
        
        this.drivers.forEach(driver => {
            closePromises.push(driver.close());
        });
        
        closePromises.push(this.statusManager.close());

        await Promise.all(closePromises);
        console.log('✅ Demonstração finalizada com sucesso!');
    }
}

// Executar demonstração
if (require.main === module) {
    const demo = new RideSystemDemo();

    async function runDemo() {
        const scenario = process.argv[2] || 'complete';

        try {
            switch (scenario) {
                case 'complete':
                    await demo.runCompleteDemo();
                    break;
                    
                case 'high-demand':
                    await demo.initialize();
                    await demo.startMonitoring();
                    await demo.simulateHighDemand();
                    break;
                    
                case 'test':
                    await demo.statusManager.generateTestRides(5);
                    await demo.statusManager.monitorRides();
                    break;
                    
                default:
                    console.log('🎮 === DEMONSTRAÇÃO DO SISTEMA DE CORRIDAS ===\n');
                    console.log('Cenários disponíveis:');
                    console.log('  complete     - Demonstração completa (padrão)');
                    console.log('  high-demand  - Simular alta demanda');
                    console.log('  test         - Apenas gerar dados de teste');
                    console.log('\nExemplos:');
                    console.log('  node demo.js complete');
                    console.log('  node demo.js high-demand');
                    console.log('  node demo.js test');
                    return;
            }

        } catch (error) {
            console.error('❌ Erro durante demonstração:', error);
        }
    }

    runDemo();

    // Graceful shutdown
    process.on('SIGINT', async () => {
        console.log('\n\n⏹️  Interrompendo demonstração...');
        await demo.cleanup();
        process.exit(0);
    });

    process.on('SIGTERM', async () => {
        await demo.cleanup();
        process.exit(0);
    });
}

module.exports = RideSystemDemo;