const mongoose = require('mongoose');

const rendezvousSchema = new mongoose.Schema({
  patientId: String,
  medecinId: String,
  date: Date,
  status: { type: String, enum: ['réservé', 'annulé'], default: 'réservé' }
});

module.exports = mongoose.model('Rendez-vous', rendezvousSchema);
