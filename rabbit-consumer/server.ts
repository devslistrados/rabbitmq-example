import amqp, { Channel, Connection, ConsumeMessage } from 'amqplib';

const queueName = 'integracao-queue';

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

// Configura uma fila no RabbitMQ
async function setupQueue(channel: Channel, queueName: string): Promise<void> {
    try {
        await channel.assertQueue(queueName, { durable: true });
    } catch (error) {
        console.error('Erro ao configurar a fila:', error);
        throw error;
    }
}

// Processa cada mensagem recebida
function processMessage(channel: Channel, message: ConsumeMessage | null): void {
    if (!message) return;

    try {
        console.log(' [x] Recebido "%s"', message.content.toString());
        const content = JSON.parse(message.content.toString());
        console.log('Processando mensagem:', content);

        // Confirma a mensagem após processamento bem-sucedido
        channel.ack(message);
    } catch (error) {
        console.error('Erro ao processar a mensagem:', error);
        // Rejeita a mensagem sem reenfileirá-la
        channel.nack(message, false, false);
    }
}

// Inicia o consumidor
async function startConsumer(): Promise<void> {
    const { connection, channel } = await createConnection();
    await setupQueue(channel, queueName);

    channel.consume(
        queueName,
        message => processMessage(channel, message),
        { noAck: false } // Habilita a confirmação manual de mensagens
    );

    console.log(' [*] Aguardando mensagens. Para sair pressione CTRL+C');

    process.once('SIGINT', async () => {
        await channel.close();
        await connection.close();
        process.exit();
    });
}

startConsumer().catch(error => console.error('Falha ao iniciar consumidor:', error));
