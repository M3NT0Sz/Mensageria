require('dotenv').config();
const amqp = require('amqplib');

const RABBIT_URL = process.env.RABBIT_URL;
const QUEUE = process.env.QUEUE;

async function receberNotificacao() {
    const conn = await amqp.connect(RABBIT_URL);
    const ch = await conn.createChannel();
    await ch.assertQueue(QUEUE, { durable: true });

    ch.prefetch(1);

    ch.consume(QUEUE, async (msg) => {
        if (!msg) return;
        const payload = JSON.parse(msg.content.toString());
        console.log("Notificação recebida: " + payload);
        ch.ack(msg);
    }, {noAck: false});
}

receberNotificacao();