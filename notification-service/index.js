const express = require('express');
const consumeEnrollmentEvents = require('./consumer');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Notification Service Running');
});

app.listen(5003, () => {
  console.log('Notification Service running on port 5003');
  consumeEnrollmentEvents(); // start listening to RabbitMQ
});
