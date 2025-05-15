import axios from 'axios';
import toast from 'react-hot-toast';

// Configuration des URLs de base
const API_CONFIG = {
  laravel: {
    baseURL: 'http://127.0.0.1:8000/api',
    timeout: 10000
  },
  node: {
    baseURL: 'http://localhost:5002/api',
    timeout: 10000
  }
};

// Création des instances axios
const createApiInstance = (config) => {
  const instance = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  // Intercepteur de requête pour ajouter le token d'authentification
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Intercepteur de réponse pour gérer les erreurs
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const { response } = error;
      
      if (response) {
        // Gestion des erreurs selon le code HTTP
        switch (response.status) {
          case 401:
            toast.error('Session expirée. Veuillez vous reconnecter.');
            // Redirection vers la page de login si nécessaire
            localStorage.removeItem('token');
            window.location.href = '/login';
            break;
          case 403:
            toast.error('Accès non autorisé.');
            break;
          case 404:
            toast.error('La ressource demandée n\'existe pas.');
            break;
          case 422:
            // Erreurs de validation
            const validationErrors = response.data.errors;
            if (validationErrors) {
              Object.values(validationErrors).forEach(errors => {
                errors.forEach(error => toast.error(error));
              });
            } else {
              toast.error('Erreur de validation.');
            }
            break;
          case 500:
            toast.error('Erreur serveur. Veuillez réessayer plus tard.');
            break;
          default:
            toast.error(response.data.message || 'Une erreur est survenue.');
        }
      } else if (error.request) {
        // La requête a été faite mais pas de réponse reçue
        toast.error('Impossible de joindre le serveur. Vérifiez votre connexion internet.');
      } else {
        // Erreur lors de la configuration de la requête
        toast.error('Erreur lors de la préparation de la requête.');
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Création des instances API
export const laravelApi = createApiInstance(API_CONFIG.laravel);
export const nodeApi = createApiInstance(API_CONFIG.node);

// Fonction utilitaire pour extraire les données de la réponse
const extractData = (response) => {
  return response.data.data || response.data;
};

// Service API générique
const apiService = {
  // Méthodes génériques
  get: async (endpoint, params = {}, useNode = false) => {
    try {
      const api = useNode ? nodeApi : laravelApi;
      const response = await api.get(endpoint, { params });
      return extractData(response);
    } catch (error) {
      console.error(`GET ${endpoint} error:`, error);
      throw error;
    }
  },

  post: async (endpoint, data = {}, useNode = false) => {
    try {
      const api = useNode ? nodeApi : laravelApi;
      const response = await api.post(endpoint, data);
      return extractData(response);
    } catch (error) {
      console.error(`POST ${endpoint} error:`, error);
      throw error;
    }
  },

  put: async (endpoint, data = {}, useNode = false) => {
    try {
      const api = useNode ? nodeApi : laravelApi;
      const response = await api.put(endpoint, data);
      return extractData(response);
    } catch (error) {
      console.error(`PUT ${endpoint} error:`, error);
      throw error;
    }
  },

  delete: async (endpoint, useNode = false) => {
    try {
      const api = useNode ? nodeApi : laravelApi;
      const response = await api.delete(endpoint);
      return extractData(response);
    } catch (error) {
      console.error(`DELETE ${endpoint} error:`, error);
      throw error;
    }
  },

  // Méthodes spécifiques pour les différentes entités
  auth: {
    login: async (credentials) => {
      return apiService.post('/auth/login', credentials);
    },
    register: async (userData) => {
      return apiService.post('/auth/register', userData);
    },
    logout: async () => {
      return apiService.post('/auth/logout');
    },
    getUser: async () => {
      return apiService.get('/auth/user');
    }
  },

  doctors: {
    getAll: async (params = {}) => {
      return apiService.get('/doctors', params);
    },
    getById: async (id) => {
      return apiService.get(`/doctors/${id}`);
    },
    getSpecialties: async () => {
      return apiService.get('/specialties');
    },
    getAvailableSlots: async (doctorId, date) => {
      return apiService.get(`/doctors/${doctorId}/slots`, { date });
    },
    updateProfile: async (doctorId, profileData) => {
      return apiService.put(`/doctors/${doctorId}`, profileData);
    }
  },

  appointments: {
    getAll: async (params = {}) => {
      return apiService.get('/appointments', params);
    },
    getById: async (id) => {
      return apiService.get(`/appointments/${id}`);
    },
    create: async (appointmentData) => {
      return apiService.post('/appointments', appointmentData, true); // Utilise l'API Node
    },
    update: async (id, appointmentData) => {
      return apiService.put(`/appointments/${id}`, appointmentData);
    },
    cancel: async (id) => {
      return apiService.delete(`/appointments/${id}`);
    },
    getPatientAppointments: async () => {
      return apiService.get('/patient/appointments');
    },
    getDoctorAppointments: async () => {
      return apiService.get('/doctor/appointments');
    }
  }
};

export default apiService;
