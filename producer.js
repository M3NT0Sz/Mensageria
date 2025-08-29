require("dotenv").config();
const amqp = require('amqplib');

const RABBIT_URL = process.env.RABBIT_URL;
const QUEUE = process.env.QUEUE;

async function publicarNotificacao({ numPedido, mensagem }) {
    const conn = await amqp.connect(RABBIT_URL);
    const ch = await conn.createChannel();
    await ch.assertQueue(QUEUE, { durable: true })

    const payload = {
        numPedido,
        mensagem,
        status: 'POSTADO'
    }

    ch.sendToQueue(QUEUE, Buffer.from(JSON.stringify(payload)), { persistent: true });


}

const numPedido = process.argv[2];
const mensagem = "Pedido numero " + numPedido + " foi postado!";

publicarNotificacao({ numPedido, mensagem });