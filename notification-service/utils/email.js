const nodemailer = require('nodemailer');

// Create a test account for development
const createTestAccount = async () => {
  const testAccount = await nodemailer.createTestAccount();
  return {
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  };
};

// Send email
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // In production, use real SMTP settings from env variables
    // For development, use ethereal.email test account
    const transportConfig = process.env.NODE_ENV === 'production'
      ? {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        }
      : await createTestAccount();
    
    const transporter = nodemailer.createTransport(transportConfig);
    
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Medical Appointments" <appointments@example.com>',
      to,
      subject,
      text,
      html: html || text
    });
    
    console.log('Email sent:', info.messageId);
    
    // If using ethereal.email for testing, log the URL to view the email
    if (process.env.NODE_ENV !== 'production') {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = {
  sendEmail
};