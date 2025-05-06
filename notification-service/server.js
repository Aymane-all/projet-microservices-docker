const amqp = require('amqplib');
const dotenv = require('dotenv');
const { sendEmail } = require('./utils/email');

dotenv.config();

// Connect to RabbitMQ and consume messages
const startService = async () => {
  try {
    console.log('Notification Service starting...');
    
    // Connect to RabbitMQ
    const connection = await amqp.connect(`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`);
    const channel = await connection.createChannel();
    
    // Setup exchanges
    await channel.assertExchange('appointment.booked', 'fanout', { durable: true });
    await channel.assertExchange('appointment.canceled', 'fanout', { durable: true });
    
    // Setup queues
    const bookingQueue = await channel.assertQueue('notification.appointment.booked', { durable: true });
    const cancelQueue = await channel.assertQueue('notification.appointment.canceled', { durable: true });
    
    // Bind queues to exchanges
    await channel.bindQueue(bookingQueue.queue, 'appointment.booked', '');
    await channel.bindQueue(cancelQueue.queue, 'appointment.canceled', '');
    
    // Consume messages from booking queue
    channel.consume(bookingQueue.queue, async (msg) => {
      if (msg) {
        try {
          const appointment = JSON.parse(msg.content.toString());
          console.log('Received booking notification:', appointment);
          
          // Send email to patient
          await sendEmail({
            to: `patient-${appointment.patientId}@example.com`, // In a real app, get email from user service
            subject: 'Appointment Confirmation',
            text: `Your appointment with Dr. ${appointment.doctorName} on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.startTime} has been confirmed.`
          });
          
          // Send email to doctor
          await sendEmail({
            to: `doctor-${appointment.doctorId}@example.com`, // In a real app, get email from user service
            subject: 'Nouveaux Appointment a programmer',
            text: `tu as un appointment avec ${appointment.patientName} on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.startTime}.`
          });
          
          channel.ack(msg);
        } catch (error) {
          console.error('Error processing booking notification:', error);
          channel.nack(msg);
        }
      }
    });
    
    // Consume messages from cancel queue
    channel.consume(cancelQueue.queue, async (msg) => {
      if (msg) {
        try {
          const appointment = JSON.parse(msg.content.toString());
          console.log('Received cancellation notification:', appointment);
          
          // Send email to patient
          await sendEmail({
            to: `patient-${appointment.patientId}@example.com`, // In a real app, get email from user service
            subject: 'Appointment Cancellation',
            text: `Your appointment with Dr. ${appointment.doctorName} on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.startTime} has been canceled.`
          });
          
          // Send email to doctor
          await sendEmail({
            to: `doctor-${appointment.doctorId}@example.com`, // In a real app, get email from user service
            subject: 'Appointment Cancellation',
            text: `Your appointment with ${appointment.patientName} on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.startTime} has been canceled.`
          });
          
          channel.ack(msg);
        } catch (error) {
          console.error('Error processing cancellation notification:', error);
          channel.nack(msg);
        }
      }
    });
    
    console.log('Notification Service is running and waiting for messages...');
  } catch (error) {
    console.error('Error starting Notification Service:', error);
    process.exit(1);
  }
};

startService();