import React, { createContext, useState, useContext } from 'react';
import {
  fetchPatientAppointments,
  fetchDoctorAppointments,
  createNewAppointment,
  cancelExistingAppointment,
  updateAppointment,
} from '../api/appointments';
import toast from 'react-hot-toast';

const AppointmentContext = createContext({
  appointments: [],
  isLoading: false,
  error: null,
  createAppointment: async () => ({}),
  cancelAppointment: async () => {},
  updateAppointmentStatus: async () => {},
  getPatientAppointments: async () => [],
  getDoctorAppointments: async () => [],
});

export const useAppointments = () => useContext(AppointmentContext);

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getPatientAppointments = async (patientId) => {
    setIsLoading(true);
    setError(null);
    try {
      const patientAppointments = await fetchPatientAppointments(patientId);
      setAppointments(patientAppointments);
      return patientAppointments;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch appointments';
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getDoctorAppointments = async (doctorId) => {
    setIsLoading(true);
    setError(null);
    try {
      const doctorAppointments = await fetchDoctorAppointments(doctorId);
      setAppointments(doctorAppointments);
      return doctorAppointments;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch appointments';
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const createAppointment = async (appointmentData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newAppointment = await createNewAppointment(appointmentData);
      setAppointments((prev) => [...prev, newAppointment]);
      toast.success('Appointment booked successfully!');
      return newAppointment;
    } catch (err) {
      const errorMessage = err.message || 'Failed to create appointment';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    setIsLoading(true);
    setError(null);
    try {
      await cancelExistingAppointment(appointmentId);
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
        )
      );
      toast.success('Appointment cancelled successfully');
    } catch (err) {
      const errorMessage = err.message || 'Failed to cancel appointment';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, status) => {
    setIsLoading(true);
    setError(null);
    try {
      await updateAppointment(appointmentId, { status });
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId ? { ...apt, status } : apt
        )
      );
      toast.success(`Appointment ${status} successfully`);
    } catch (err) {
      const errorMessage = err.message || 'Failed to update appointment';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        isLoading,
        error,
        createAppointment,
        cancelAppointment,
        updateAppointmentStatus,
        getPatientAppointments,
        getDoctorAppointments,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};