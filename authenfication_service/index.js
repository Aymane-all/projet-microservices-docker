const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');

const authRoutes = require('./routes/auth');

app.use(express.json());
app.use(cors());

const MONGO_URI = 'mongodb://localhost:27017/auth-medcine';

const PORT = 5001;

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("Erreur de connexion à MongoDB:", err);
    process.exit(1);  // Quitter l'application si la connexion échoue
  });


// Use auth routes
app.use('/api/auth', authRoutes);


app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));


