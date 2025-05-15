import axios from 'axios';

const API_URL = 'http://localhost:5002/api';

// Create axios instance with baseURL
const nodeApi = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to include auth token in all requests
nodeApi.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const createNewAppointment = async (appointmentData) => {
  try {
    const response = await nodeApi.post('/appointments', appointmentData);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error creating appointment:', error);
    
    // More descriptive error handling
    if (error.response?.status === 401) {
      throw new Error('Authentification requise. Veuillez vous reconnecter.');
    } else if (error.response?.status === 403) {
      throw new Error('Vous n\'avez pas la permission de créer des rendez-vous.');
    } else {
      throw new Error(error.response?.data?.message || 'Échec de la création du rendez-vous');
    }
  }
};

export const fetchPatientAppointments = async (patientId) => {
  try {
    const response = await nodeApi.get(`/patients/${patientId}/appointments`);
    const data = response.data.data || response.data;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching patient appointments:', error);
    if (error.response?.status === 401) {
      throw new Error('Authentification requise. Veuillez vous reconnecter.');
    }
    throw new Error(error.response?.data?.message || 'Échec de la récupération des rendez-vous du patient');
  }
};

export const fetchDoctorAppointments = async (doctorId) => {
  try {
    const response = await nodeApi.get(`/doctors/${doctorId}/appointments`);
    const data = response.data.data || response.data;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    if (error.response?.status === 401) {
      throw new Error('Authentification requise. Veuillez vous reconnecter.');
    }
    throw new Error(error.response?.data?.message || 'Échec de la récupération des rendez-vous du médecin');
  }
};

export const cancelExistingAppointment = async (appointmentId) => {
  try {
    const response = await nodeApi.delete(`/appointments/${appointmentId}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    if (error.response?.status === 401) {
      throw new Error('Authentification requise. Veuillez vous reconnecter.');
    } else if (error.response?.status === 403) {
      throw new Error('Vous n\'avez pas la permission d\'annuler ce rendez-vous.');
    }
    throw new Error(error.response?.data?.message || 'Échec de l\'annulation du rendez-vous');
  }
};

export const updateAppointment = async (appointmentId, data) => {
  try {
    const response = await nodeApi.patch(`/appointments/${appointmentId}`, data);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error updating appointment:', error);
    if (error.response?.status === 401) {
      throw new Error('Authentification requise. Veuillez vous reconnecter.');
    } else if (error.response?.status === 403) {
      throw new Error('Vous n\'avez pas la permission de modifier ce rendez-vous.');
    }
    throw new Error(error.response?.data?.message || 'Échec de la mise à jour du rendez-vous');
  }
};