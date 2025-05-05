const amqp = require('amqplib');

// Connect to RabbitMQ
const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`);
    const channel = await connection.createChannel();
    
    // Ensure exchanges exist
    await channel.assertExchange('appointment.booked', 'fanout', { durable: true });
    await channel.assertExchange('appointment.canceled', 'fanout', { durable: true });
    
    return { connection, channel };
  } catch (error) {
    console.error('RabbitMQ connection error:', error);
    throw error;
  }
};

// Publish message to an exchange
const publishMessage = async (exchange, message) => {
  try {
    const { channel } = await connectRabbitMQ();
    channel.publish(exchange, '', Buffer.from(JSON.stringify(message)));
    console.log(`Message published to ${exchange}`);
  } catch (error) {
    console.error(`Error publishing message to ${exchange}:`, error);
  }
};

module.exports = {
  connectRabbitMQ,
  publishMessage
};