import express from "express"
import { verifyToken } from "../middlewares/auth.js"
import { isPatient, isDoctor, isPatientOrDoctor } from "../middlewares/role.js"
import {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  getAppointmentById,
  cancelAppointment,
  updateAppointmentStatus,
} from "../controllers/appointmentController.js"

const router = express.Router()

// Book a new appointment (patients only)
router.post("/", verifyToken, isPatient, bookAppointment)

// Get patient's appointments
router.get("/patient", verifyToken, isPatient, getPatientAppointments)

// Get doctor's appointments
router.get("/doctor", verifyToken, isDoctor, getDoctorAppointments)

// Get appointment by ID (both patient and doctor can access their own appointments)
router.get("/:id", verifyToken, isPatientOrDoctor, getAppointmentById)

// Cancel appointment (both patient and doctor can cancel)
router.patch("/:id/cancel", verifyToken, isPatientOrDoctor, cancelAppointment)

// Update appointment status (both patient and doctor can update with restrictions)
router.patch("/:id/status", verifyToken, isPatientOrDoctor, updateAppointmentStatus)

export default router
