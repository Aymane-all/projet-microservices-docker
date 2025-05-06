import { mockDoctors } from './mockData';

// Mock data for appointments
let mockAppointments = [
  {
    id: '1',
    doctorId: '1',
    patientId: '2',
    dateTime: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
    endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 3)).setMinutes(new Date().getMinutes() + 30)).toISOString(),
    status: 'confirmed',
    reason: 'Annual checkup',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    doctorId: '3',
    patientId: '2',
    dateTime: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
    endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 5)).setMinutes(new Date().getMinutes() + 30)).toISOString(),
    status: 'pending',
    reason: 'Cold symptoms',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    doctorId: '2',
    patientId: '2',
    dateTime: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    endTime: new Date(new Date(new Date().setDate(new Date().getDate() - 10)).setMinutes(new Date().getMinutes() + 30)).toISOString(),
    status: 'completed',
    reason: 'Skin rash',
    notes: 'Prescribed antihistamine cream',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString()
  }
];

// Helper to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get appointments for a patient
export const fetchPatientAppointments = async (patientId) => {
  await delay(800);

  const appointments = mockAppointments.filter(apt => apt.patientId === patientId);

  return appointments.map(apt => ({
    ...apt,
    doctor: mockDoctors.find(doc => doc.id === apt.doctorId)
  }));
};

// Get appointments for a doctor
export const fetchDoctorAppointments = async (doctorId) => {
  await delay(800);

  return mockAppointments.filter(apt => apt.doctorId === doctorId);
};

// Create a new appointment
export const createNewAppointment = async (appointmentData) => {
  await delay(1000);

  if (!appointmentData.doctorId || !appointmentData.patientId || !appointmentData.dateTime || !appointmentData.endTime) {
    throw new Error('Missing required appointment fields');
  }

  const newAppointment = {
    id: `${mockAppointments.length + 1}`,
    doctorId: appointmentData.doctorId,
    patientId: appointmentData.patientId,
    dateTime: appointmentData.dateTime,
    endTime: appointmentData.endTime,
    status: 'pending',
    reason: appointmentData.reason || '',
    notes: appointmentData.notes || '',
    createdAt: new Date().toISOString(),
    doctor: mockDoctors.find(doc => doc.id === appointmentData.doctorId)
  };

  mockAppointments.push(newAppointment);

  return newAppointment;
};

// Cancel an appointment
export const cancelExistingAppointment = async (appointmentId) => {
  await delay(700);

  const appointmentIndex = mockAppointments.findIndex(apt => apt.id === appointmentId);

  if (appointmentIndex === -1) {
    throw new Error('Appointment not found');
  }

  mockAppointments[appointmentIndex].status = 'cancelled';
};

// Update an appointment
export const updateAppointment = async (appointmentId, updates) => {
  await delay(800);

  const appointmentIndex = mockAppointments.findIndex(apt => apt.id === appointmentId);

  if (appointmentIndex === -1) {
    throw new Error('Appointment not found');
  }

  mockAppointments[appointmentIndex] = {
    ...mockAppointments[appointmentIndex],
    ...updates
  };

  return mockAppointments[appointmentIndex];
};
