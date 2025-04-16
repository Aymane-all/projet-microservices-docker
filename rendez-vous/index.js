const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000; 


app.use(cors());
app.use(express.json());


app.use('/api/appointments', require('./routes/appointments'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/rendez-vous')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Start server
app.listen(PORT, () => {
  console.log(`Rendez-vous Service running on port ${PORT}`);
});