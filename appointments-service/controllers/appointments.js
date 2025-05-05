const axios = require('axios');
const Appointment = require('../models/Appointment');
const { publishMessage } = require('../utils/rabbitmq');

// Helper function to check slot availability
const checkSlotAvailability = async (doctorId, slotId) => {
  try {
  
    // Fetch all slots for the doctor
    const response = await axios.get(`http://127.0.0.1:8000/api/doctors/${doctorId}/slots`);
    console.log('Response:', response.data);
    
    // Find the slot with the given slotId
    const slot = response.data.find((slot) => slot.id === slotId);
    console.log('Found slot:', slot);
    
    return slot ? slot.is_available : false;
  } catch (error) {
    console.error('Error checking slot availability:', error.message);
    console.error('Error details:', error.response ? error.response.data : 'No response data');
    return false;
  }
};

// Helper function to update slot availability
const updateSlotAvailability = async (slotId, isAvailable) => {
  try {
    await axios.put(
      `${process.env.DOCTORS_SERVICE_URL}/slots/${slotId}`,
      { is_available: isAvailable },
      {
        headers: {
          Authorization: `Bearer ${process.env.SERVICE_TOKEN}`,
        },
      }
    );
    return true;
  } catch (error) {
    console.error('Error updating slot availability:', error);
    return false;
  }
};

// Helper function to get doctor details
const getDoctorDetails = async (doctorId) => {
  try {
    const response = await axios.get(`${process.env.DOCTORS_SERVICE_URL}/doctors/${doctorId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting doctor details:', error);
    return null;
  }
};

// Helper function to get slot details
const getSlotDetails = async (doctorId, slotId) => {
  try {
    const response = await axios.get(`${process.env.DOCTORS_SERVICE_URL}/doctors/${doctorId}/slots`);
    const slot = response.data.find((slot) => slot.id === slotId);
    return slot || null;
  } catch (error) {
    console.error('Error getting slot details:', error);
    return null;
  }
};

// @desc    Book a new appointment
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, slotId, notes } = req.body;

    // Check if slot is available
    const isAvailable = await checkSlotAvailability(doctorId, slotId);
    if (!isAvailable) {
      return res.status(400).json({ message: 'This slot is no longer available' });
    }

    // Get doctor details
    const doctor = await getDoctorDetails(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Get slot details
    const slot = await getSlotDetails(doctorId, slotId);
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    // Create appointment
    const appointment = new Appointment({
      patientId: req.user.id,
      patientName: req.user.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      slotId,
      date: slot.date,
      startTime: slot.start_time,
      endTime: slot.end_time,
      notes,
    });

    await appointment.save();

    // Update slot availability
    await updateSlotAvailability(slotId, false);

    // Publish appointment.booked event
    await publishMessage('appointment.booked', {
      appointmentId: appointment._id,
      patientId: appointment.patientId,
      patientName: appointment.patientName,
      doctorId: appointment.doctorId,
      doctorName: appointment.doctorName,
      date: appointment.date,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all appointments for the authenticated user
const getUserAppointments = async (req, res) => {
  try {
    let appointments;

    if (req.user.role === 'patient') {
      // Patients can only see their own appointments
      appointments = await Appointment.find({ patientId: req.user.id }).sort({
        date: 1,
        startTime: 1,
      });
    } else if (req.user.role === 'doctor') {
      // Doctors can only see appointments for them
      appointments = await Appointment.find({ doctorId: req.user.id }).sort({
        date: 1,
        startTime: 1,
      });
    }

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get appointment by ID
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user is authorized to view this appointment
    if (req.user.role === 'patient' && appointment.patientId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this appointment' });
    }

    if (req.user.role === 'doctor' && appointment.doctorId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this appointment' });
    }

    res.json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Cancel an appointment
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user is authorized to cancel this appointment
    if (req.user.role === 'patient' && appointment.patientId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
    }

    if (req.user.role === 'doctor' && appointment.doctorId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
    }

    // Check if appointment is already canceled or completed
    if (appointment.status !== 'scheduled') {
      return res.status(400).json({
        message: `Cannot cancel an appointment that is ${appointment.status}`,
      });
    }

    // Update appointment status
    appointment.status = 'canceled';
    await appointment.save();

    // Make the slot available again
    await updateSlotAvailability(appointment.slotId, true);

    // Publish appointment.canceled event
    await publishMessage('appointment.canceled', {
      appointmentId: appointment._id,
      patientId: appointment.patientId,
      patientName: appointment.patientName,
      doctorId: appointment.doctorId,
      doctorName: appointment.doctorName,
      date: appointment.date,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      canceledBy: req.user.role,
    });

    res.json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Mark an appointment as completed
const completeAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if doctor is authorized to complete this appointment
    if (appointment.doctorId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to complete this appointment' });
    }

    // Check if appointment is already canceled or completed
    if (appointment.status !== 'scheduled') {
      return res.status(400).json({
        message: `Cannot complete an appointment that is ${appointment.status}`,
      });
    }

    // Update appointment status
    appointment.status = 'completed';
    await appointment.save();

    res.json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  bookAppointment,
  getUserAppointments,
  getAppointmentById,
  cancelAppointment,
  completeAppointment,
};