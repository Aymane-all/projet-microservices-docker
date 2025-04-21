import React, { createContext, useState, useContext } from 'react';
import { Appointment, AppointmentContextType, AppointmentStatus } from '../types';
import { 
  fetchPatientAppointments, 
  fetchDoctorAppointments, 
  createNewAppointment, 
  cancelExistingAppointment, 
  updateAppointment 
} from '../api/appointments';
import toast from 'react-hot-toast';

const AppointmentContext = createContext<AppointmentContextType>({
  appointments: [],
  isLoading: false,
  error: null,
  createAppointment: async () => ({} as Appointment),
  cancelAppointment: async () => {},
  updateAppointmentStatus: async () => {},
  getPatientAppointments: async () => [],
  getDoctorAppointments: async () => [],
});

export const useAppointments = () => useContext(AppointmentContext);

interface AppointmentProviderProps {
  children: React.ReactNode;
}

export const AppointmentProvider: React.FC<AppointmentProviderProps> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getPatientAppointments = async (patientId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const patientAppointments = await fetchPatientAppointments(patientId);
      setAppointments(patientAppointments);
      return patientAppointments;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch appointments';
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getDoctorAppointments = async (doctorId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const doctorAppointments = await fetchDoctorAppointments(doctorId);
      setAppointments(doctorAppointments);
      return doctorAppointments;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch appointments';
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const createAppointment = async (appointmentData: Partial<Appointment>) => {
    setIsLoading(true);
    setError(null);
    try {
      const newAppointment = await createNewAppointment(appointmentData);
      setAppointments(prev => [...prev, newAppointment]);
      toast.success('Appointment booked successfully!');
      return newAppointment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create appointment';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await cancelExistingAppointment(appointmentId);
      setAppointments(prev => 
        prev.map(apt => apt.id === appointmentId 
          ? { ...apt, status: 'cancelled' as AppointmentStatus } 
          : apt
        )
      );
      toast.success('Appointment cancelled successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel appointment';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: AppointmentStatus) => {
    setIsLoading(true);
    setError(null);
    try {
      await updateAppointment(appointmentId, { status });
      setAppointments(prev => 
        prev.map(apt => apt.id === appointmentId 
          ? { ...apt, status } 
          : apt
        )
      );
      toast.success(`Appointment ${status} successfully`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update appointment';
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