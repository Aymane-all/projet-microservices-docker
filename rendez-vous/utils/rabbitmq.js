const amqp = require("amqplib");

const RABBITMQ_URL = "amqp://localhost";
// const RABBITMQ_URL = "amqp://rabbitmq"   docker
let channel;

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertExchange('appointments', 'topic', { durable: true });
    
    console.log('Connected to RabbitMQ');
    return channel;
  } catch (error) {
    console.error('RabbitMQ connection error:', error);
    throw error;
  }
};

const publishEvent = async (routingKey, message) => {
  try {
    if (!channel) {
      await connectRabbitMQ();
    }
    
    channel.publish(
      'appointments',
      routingKey,
      Buffer.from(JSON.stringify(message))
    );
    
    console.log(`Event published: ${routingKey}`);
  } catch (error) {
    console.error('Error publishing event:', error);
    throw error;
  }
};

module.exports = {
  connectRabbitMQ,
  publishEvent
};