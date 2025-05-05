const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  bookAppointment,
  getUserAppointments,
  getAppointmentById,
  cancelAppointment,
  completeAppointment,
} = require('../controllers/appointments');

// @route   POST /api/appointments
// @desc    Book a new appointment
// @access  Private (Patient only)
router.post('/',protect,authorize('patient'), bookAppointment);

// @route   GET /api/appointments
// @desc    Get all appointments for the authenticated user
// @access  Private
router.get('/', protect, getUserAppointments);

// @route   GET /api/appointments/:id
// @desc    Get appointment by ID
// @access  Private
router.get('/:id', protect, getAppointmentById);

// @route   PUT /api/appointments/:id/cancel
// @desc    Cancel an appointment
// @access  Private
router.put('/:id/cancel', protect, cancelAppointment);

// @route   PUT /api/appointments/:id/complete
// @desc    Mark an appointment as completed
// @access  Private (Doctor only)
router.put('/:id/complete', protect, authorize('doctor'), completeAppointment);

module.exports = router;