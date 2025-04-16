const amqp = require("amqplib");

const RABBITMQ_URL = "amqp://localhost";
// const RABBITMQ_URL = "amqp://rabbitmq"   docker
let channel;

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue("enrollments", { durable: true });
    console.log("[RabbitMQ] Connected and channel ready");
  } catch (err) {
    console.error("[RabbitMQ] Connection failed:", err.message);
  }
};

const publishEnrollment = (data) => {
  if (!channel) {
    console.error("[RabbitMQ] Channel not ready");
    return;
  }

  const buffer = Buffer.from(JSON.stringify(data));
  channel.sendToQueue("enrollments", buffer);
};

module.exports = {
  connectRabbitMQ,
  publishEnrollment,
};
