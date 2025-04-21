const amqp = require("amqplib");

const RABBITMQ_URL = 'amqp://localhost';


const consumeEnrollmentEvents = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    const queue = "enrollments";

    await channel.assertQueue(queue, { durable: true });

    console.log(`[*] Waiting for messages in ${queue}. Press CTRL+C to exit.`);

    channel.consume(queue, (msg) => {
      const data = JSON.parse(msg.content.toString());
      console.log(
        `📩 New enrollment: User ${data.userId} enrolled in Course ${data.courseId}`
      );

      // Acknowledge message
      channel.ack(msg);
    });
  } catch (err) {
    console.error("Error in RabbitMQ consumer:", err.message);
  }
};

module.exports = consumeEnrollmentEvents;
