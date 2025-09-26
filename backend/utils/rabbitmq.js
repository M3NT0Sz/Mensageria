require('dotenv').config();
const amqp = require('amqplib');

const RABBIT_URL = process.env.RABBIT_URL;

class RabbitMQManager {
    constructor() {
        this.connection = null;
        this.channel = null;
    }

    async connect() {
        if (!this.connection) {
            this.connection = await amqp.connect(RABBIT_URL);
            this.channel = await this.connection.createChannel();
        }
        return { connection: this.connection, channel: this.channel };
    }

    async createQueue(queueName, durable = true) {
        const { channel } = await this.connect();
        await channel.assertQueue(queueName, { durable });
        return channel;
    }

    async publishMessage(queueName, message) {
        const channel = await this.createQueue(queueName);
        const payload = JSON.stringify(message);
        channel.sendToQueue(queueName, Buffer.from(payload), { persistent: true });
        console.log(`✅ Mensagem enviada para ${queueName}:`, message);
    }

    async consumeMessages(queueName, callback, options = {}) {
        const channel = await this.createQueue(queueName);
        channel.prefetch(1);
        
        channel.consume(queueName, async (msg) => {
            if (!msg) return;
            
            try {
                const payload = JSON.parse(msg.content.toString());
                await callback(payload);
                channel.ack(msg);
            } catch (error) {
                console.error('Erro ao processar mensagem:', error);
                channel.nack(msg, false, true);
            }
        }, { noAck: false, ...options });
        
        console.log(`🔄 Consumindo mensagens da fila: ${queueName}`);
    }

    async close() {
        if (this.connection) {
            await this.connection.close();
            this.connection = null;
            this.channel = null;
        }
    }
}

module.exports = RabbitMQManager;