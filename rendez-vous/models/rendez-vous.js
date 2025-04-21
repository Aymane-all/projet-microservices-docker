const mongoose = require("mongoose")

const rendezvousSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
  },
  medcinId: {
    type: String,
    required: true,
  },
  availabilityId: {
    type: String,
    required: true,
  },
  datedebut: {
    type: Date,
    required: true,
  },
  datefin: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["encours", "confirmer", "annuler"],
    default: "encours",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("rendezvous", rendezvousSchema);
