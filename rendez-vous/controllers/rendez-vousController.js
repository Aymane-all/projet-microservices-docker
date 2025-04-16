import Appointment from "../models/appointment.js"
import axios from "axios"
import { publishMessage } from "../utils/rabbitmq.js"

const DOCTORS_SERVICE_URL = process.env.DOCTORS_SERVICE_URL || "http://localhost:8000/api"

// Book a new appointment
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, availabilityId, date, startTime, endTime } = req.body

    // Ensure patient can only book for themselves
    if (req.user.role !== "patient") {
      return res.status(403).json({ message: "Only patients can book appointments" })
    }

    // Check if availability exists and is not booked
    try {
      const availabilityResponse = await axios.get(`${DOCTORS_SERVICE_URL}/doctors/${doctorId}/availabilities`, {
        headers: { Authorization: req.headers.authorization },
      })

      const availability = availabilityResponse.data.find((a) => a.id.toString() === availabilityId && !a.is_booked)

      if (!availability) {
        return res.status(400).json({ message: "Availability not found or already booked" })
      }
    } catch (error) {
      console.error("Error checking availability:", error)
      return res.status(500).json({ message: "Error checking availability" })
    }

    // Create appointment
    const appointment = new Appointment({
      patientId: req.user.id,
      doctorId,
      availabilityId,
      date,
      startTime,
      endTime,
      status: "scheduled",
    })

    await appointment.save()

    // Update availability status in Doctors Service
    try {
      await axios.patch(
        `${DOCTORS_SERVICE_URL}/availabilities/${availabilityId}`,
        { is_booked: true, appointment_id: appointment._id },
        {
          headers: { Authorization: req.headers.authorization },
        },
      )
    } catch (error) {
      console.error("Error updating availability:", error)
      // If updating availability fails, delete the appointment
      await Appointment.findByIdAndDelete(appointment._id)
      return res.status(500).json({ message: "Error updating availability" })
    }

    // Publish appointment.booked event
    await publishMessage("appointment.booked", {
      appointmentId: appointment._id,
      patientId: req.user.id,
      doctorId,
      date,
      startTime,
      endTime,
    })

    res.status(201).json(appointment)
  } catch (error) {
    console.error("Book appointment error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Get patient's appointments
export const getPatientAppointments = async (req, res) => {
  try {
    // Ensure patient can only see their own appointments
    if (req.user.role !== "patient") {
      return res.status(403).json({ message: "Unauthorized" })
    }

    const appointments = await Appointment.find({ patientId: req.user.id }).sort({ date: 1, startTime: 1 })

    res.json(appointments)
  } catch (error) {
    console.error("Get appointments error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Get doctor's appointments
export const getDoctorAppointments = async (req, res) => {
  try {
    // Ensure doctor can only see their own appointments
    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Unauthorized" })
    }

    const appointments = await Appointment.find({ doctorId: req.user.id }).sort({ date: 1, startTime: 1 })

    res.json(appointments)
  } catch (error) {
    console.error("Get appointments error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Get appointment by ID
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" })
    }

    // Ensure user can only see their own appointments
    if (
      (req.user.role === "patient" && appointment.patientId !== req.user.id) ||
      (req.user.role === "doctor" && appointment.doctorId !== req.user.id)
    ) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    res.json(appointment)
  } catch (error) {
    console.error("Get appointment error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Cancel appointment
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" })
    }

    // Ensure only the patient who booked or the doctor can cancel
    if (
      (req.user.role === "patient" && appointment.patientId !== req.user.id) ||
      (req.user.role === "medcin" && appointment.doctorId !== req.user.id)
    ) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    // Update appointment status
    appointment.status = "canceled"
    await appointment.save()

    // Update availability status in Doctors Service
    try {
      await axios.patch(
        `${DOCTORS_SERVICE_URL}/availabilities/${appointment.availabilityId}`,
        { is_booked: false, appointment_id: null },
        {
          headers: { Authorization: req.headers.authorization },
        },
      )
    } catch (error) {
      console.error("Error updating availability:", error)
    }

    // Publish appointment.canceled event
    await publishMessage("appointment.canceled", {
      appointmentId: appointment._id,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      canceledBy: req.user.role,
      cancelerId: req.user.id,
    })

    res.json(appointment)
  } catch (error) {
    console.error("Cancel appointment error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Update appointment status (e.g., mark as completed)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body

    if (!["scheduled", "completed", "canceled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    const appointment = await Appointment.findById(req.params.id)

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" })
    }

    // Only doctors can mark appointments as completed
    if (status === "completed" && req.user.role !== "doctor") {
      return res.status(403).json({ message: "Only doctors can mark appointments as completed" })
    }

    // Ensure only the patient who booked or the doctor can update
    if (
      (req.user.role === "patient" && appointment.patientId !== req.user.id) ||
      (req.user.role === "doctor" && appointment.doctorId !== req.user.id)
    ) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    // Update appointment status
    appointment.status = status
    await appointment.save()

    // If canceled, update availability
    if (status === "canceled") {
      try {
        await axios.patch(
          `${DOCTORS_SERVICE_URL}/availabilities/${appointment.availabilityId}`,
          { is_booked: false, appointment_id: null },
          {
            headers: { Authorization: req.headers.authorization },
          },
        )

        // Publish appointment.canceled event
        await publishMessage("appointment.canceled", {
          appointmentId: appointment._id,
          patientId: appointment.patientId,
          doctorId: appointment.doctorId,
          canceledBy: req.user.role,
          cancelerId: req.user.id,
        })
      } catch (error) {
        console.error("Error updating availability:", error)
      }
    }

    res.json(appointment)
  } catch (error) {
    console.error("Update appointment error:", error)
    res.status(500).json({ message: "Server error" })
  }
}
