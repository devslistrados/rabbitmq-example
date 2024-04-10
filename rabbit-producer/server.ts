import amqp, { Channel, Connection } from 'amqplib';

const exchangeName = 'formulario-ex';
const routingKey = 'integracao';
const exchangeType = 'direct';
let count = 0;

// Cria e retorna uma conexão e um canal para comunicação com RabbitMQ
async function createConnection(): Promise<{ connection: Connection; channel: Channel }> {
    try {
        const connection = await amqp.connect('amqp://root:root@localhost:5672');
        const channel = await connection.createChannel();
        return { connection, channel };
    } catch (error) {
        console.error('Erro ao conectar com RabbitMQ:', error);
        throw error;
    }
}

// Configura uma exchange no RabbitMQ
async function setupExchange(channel: Channel, exchangeName: string, exchangeType: string = 'direct'): Promise<void> {
    try {
        await channel.assertExchange(exchangeName, exchangeType, { durable: true });
    } catch (error) {
        console.error('Erro ao configurar a exchange:', error);
        throw error;
    }
}

// Configura uma fila no RabbitMQ
async function setupQueue(channel: Channel, queueName: string): Promise<void> {
    try {
        await channel.assertQueue(queueName, { durable: true });
    } catch (error) {
        console.error('Erro ao configurar a fila:', error);
        throw error;
    }
}

// Vincula uma fila a uma exchange usando uma routing key
async function bindQueue(channel: Channel, queueName: string, exchangeName: string, routingKey: string): Promise<void> {
    try {
        await channel.bindQueue(queueName, exchangeName, routingKey);
    } catch (error) {
        console.error('Erro ao vincular a fila:', error);
        throw error;
    }
}

// Envia uma mensagem para a exchange configurada
async function sendMessage(): Promise<void> {
    let connection: Connection | null = null;
    let channel: Channel | null = null;
    try {
        ({ connection, channel } = await createConnection());
        await setupExchange(channel, exchangeName, exchangeType);
        // Descomente e configure se esses não foram configurados anteriormente
        // const queueName = 'suaFila';
        // await setupQueue(channel, queueName);
        // await bindQueue(channel, queueName, exchangeName, routingKey);

        count++;
        const message = {
            item_id: `Bahia-${count}`,
            text: `Bahia é o mundo pagamento - ${count}`,
        };

        channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(message)));
        console.log(' [x] Enviado "%s"', JSON.stringify(message));

    } catch (error) {
        console.error('Falha ao enviar mensagem:', error);
    } finally {
        if (channel) await channel.close();
        if (connection) await connection.close();
    }
}

// Configura o envio de mensagem a cada 1 segundo
setInterval(sendMessage, 1000);
