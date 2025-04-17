const  Rendezvous  = require('../models/rendez-vous');
const axios = require('axios');
const mongoose = require('mongoose');

// Book an appointment
exports.priserRendezvous = async (req, res) => {
  try {
    const {userId ,patientId, medcinId, availabilityId, datedebut, datefin } = req.body;

    // Validate required fields
    if (userId,!patientId || !medcinId || !availabilityId || !datedebut || !datefin) {
      return res.status(400).json({ message: 'veuillez remplir tous les champs' });
    }

    if (new Date(datefin) <= new Date(datedebut)) {
      return res.status(400).json({ message: 'La date de fin doit être plus grand que la date de debut' });
    }

    // Check availability with availability service
    // try {
    //   const availabilityResponse = await axios.get(
    //     `http://localhost:8000/api/availability/${availabilityId}`
    //   );
      
    //   if (!availabilityResponse.data.isAvailable) {
    //     return res.status(400).json({ message: 'Le creneau horaire selectionne ne est pas disponible' });
    //   }
    // } catch (error) {
    //   return res.status(500).json({ message: 'Error de la disponibilite', error: error.message });
    // }

    const isAvailable = true; 

    if (!isAvailable) {
      return res.status(400).json({ message: 'Le creneau horaire selectionne ne est pas disponible' });
    } else {
      console.log('Le creneau horaire selectionne est disponible');
    }


    // Create new appointment
    const appointment = new Rendezvous({
      userId,
      patientId,
      medcinId,
      availabilityId,
      datedebut,
      datefin,
    });

    await appointment.save();



    res.status(201).json({ message: 'Rendez-vous pris avec succès', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Erreur de prendre de rendez-vous', error: error.message });
  }
};

// Cancel appointment
exports.annulerRendezvous = async (req, res) => {
  try {
    // if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
    //   return res.status(400).json({ message: "ID invalide" });
    // }
    const appointment = await Rendezvous.findById(appointmentId);

    
    if (!appointment) {
      console.log('Rendez-vous introuvable');
      return res.status(404).json({ message: 'Rendez-vous introuvable' });
    }

    if (appointment.status === 'annuler') {
      return res.status(400).json({ message: 'Rendez-vous dejà annuler' });
    }

    appointment.status = 'annuler';
    await appointment.save();

 
    res.status(200).json({ message: 'Appointment annuler avec succes ' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur de annulation', error: error.message });
  }
};

// Reprogram appointment
exports.reprogrammerRendezvous = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { availabilityId, datedebut, datefin } = req.body;

    const appointment = await Rendezvous.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check new availability
    // try {
    //   const availabilityResponse = await axios.get(
    //     `http://localhost:8000/api/availability/${availabilityId}`
    //   );
      
    //   if (!availabilityResponse.data.isAvailable) {
    //     return res.status(400).json({ message: 'Le creneau horaire selectionne ne est pas disponible' });
    //   }
    // } catch (error) {
    //   return res.status(500).json({ message: 'Error de la disponibilité', error: error.message });
    // }

    const isAvailable = true; 

    if (!isAvailable) {
      return res.status(400).json({ message: 'Le creneau horaire selectionne ne est pas disponible' });
    }

    // Update appointment
    appointment.availabilityId = availabilityId;
    appointment.datedebut = datedebut;
    appointment.datefin = datefin;
    appointment.status = 'encours';
    await appointment.save();

  

    res.status(200).json({ message: 'Rendez-vous reprogrammé avec succès', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Error de reprogrammation du rendez-vous', error: error.message });
  }
};

// Get appointment history
exports.historyrendezvous = async (req, res) => {
  try {
    // const user = req.user; 
    const user = {
      id : 1,
      role : 'patient'
    }

    let appointments;

    if (user.role === 'patient') {
      // Un patient ne peut voir que ses propres rendez-vous
      appointments = await Rendezvous.find({ patientId: user.id })
        .sort({ createdAt: -1 })
        .select('-__v');
    } else if (user.role === 'medcin') {
      // Un médecin ne peut voir que ses propres rendez-vous
      appointments = await Rendezvous.find({ medcinId: user.id })
        .sort({ createdAt: -1 })
        .select('-__v');
    } else {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    res.status(200).json({ appointments });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l’historique', error: error.message });
  }
};


