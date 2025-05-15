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

/**
 * Service pour gérer les notifications dans l'application
 */

/**
 * Récupère toutes les notifications pour l'utilisateur connecté
 * @returns {Promise} Promesse contenant les notifications
 */
export const fetchNotifications = async () => {
  try {
    // En mode développement, on peut basculer entre les données simulées et l'API réelle
    const useMockData = false; // Mettre à true pour utiliser des données simulées
    
    if (useMockData) {
      return getMockNotifications();
    }
    
    const response = await nodeApi.get('/');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    if (error.response?.status === 401) {
      throw new Error('Authentification requise. Veuillez vous reconnecter.');
    }
    throw new Error(error.response?.data?.message || 'Échec de la récupération des notifications');
  }
};

/**
 * Récupère le nombre de notifications non lues
 * @returns {Promise} Promesse contenant le nombre de notifications non lues
 */
export const fetchUnreadCount = async () => {
  try {
    const notifications = await fetchNotifications();
    const count = notifications.filter(n => !n.read).length;
    return count;
  } catch (error) {
    console.error('Erreur lors de la récupération du nombre de notifications non lues:', error);
    return 0;
  }
};

/**
 * Marque une notification comme lue
 * @param {string} notificationId - ID de la notification à marquer comme lue
 * @returns {Promise} Promesse contenant la notification mise à jour
 */
export const markAsRead = async (notificationId) => {
  try {
    const response = await nodeApi.patch(`/notifications/${notificationId}/read`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Erreur lors du marquage de la notification comme lue:', error);
    if (error.response?.status === 401) {
      throw new Error('Authentification requise. Veuillez vous reconnecter.');
    }
    throw new Error(error.response?.data?.message || 'Échec du marquage de la notification comme lue');
  }
};

/**
 * Marque toutes les notifications comme lues
 * @returns {Promise} Promesse contenant le résultat de l'opération
 */
export const markAllAsRead = async () => {
  try {
    const response = await nodeApi.patch('/notifications/read-all');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Erreur lors du marquage de toutes les notifications comme lues:', error);
    if (error.response?.status === 401) {
      throw new Error('Authentification requise. Veuillez vous reconnecter.');
    }
    throw new Error(error.response?.data?.message || 'Échec du marquage de toutes les notifications comme lues');
  }
};

/**
 * Supprime une notification
 * @param {string} notificationId - ID de la notification à supprimer
 * @returns {Promise} Promesse contenant le résultat de l'opération
 */
export const deleteNotification = async (notificationId) => {
  try {
    const response = await nodeApi.delete(`/notifications/${notificationId}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression de la notification:', error);
    if (error.response?.status === 401) {
      throw new Error('Authentification requise. Veuillez vous reconnecter.');
    }
    throw new Error(error.response?.data?.message || 'Échec de la suppression de la notification');
  }
};

/**
 * Crée une nouvelle notification (pour les tests ou les notifications manuelles)
 * @param {Object} notificationData - Données de la notification
 * @returns {Promise} Promesse contenant la notification créée
 */
export const createNotification = async (notificationData) => {
  try {
    const response = await nodeApi.post('/notifications', notificationData);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la notification:', error);
    if (error.response?.status === 401) {
      throw new Error('Authentification requise. Veuillez vous reconnecter.');
    }
    throw new Error(error.response?.data?.message || 'Échec de la création de la notification');
  }
};

/**
 * Fonction pour générer des données de test (à utiliser en développement)
 * @returns {Array} Tableau de notifications simulées
 */
export const getMockNotifications = () => {
  return [
    {
      id: 1,
      type: 'appointment_booked',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      data: {
        appointmentId: '123',
        patientId: '456',
        patientName: 'Jean Dupont',
        patientImage: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
        doctorId: '789',
        doctorName: 'Dr. Marie Lambert',
        doctorImage: 'https://images.pexels.com/photos/5214959/pexels-photo-5214959.jpeg',
        date: '2025-05-15',
        time: '14:30'
      }
    },
    {
      id: 2,
      type: 'appointment_canceled',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      data: {
        appointmentId: '124',
        patientId: '457',
        patientName: 'Sophie Martin',
        patientImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
        doctorId: '790',
        doctorName: 'Dr. Thomas Bernard',
        doctorImage: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg',
        date: '2025-05-16',
        time: '10:00'
      }
    },
    {
      id: 3,
      type: 'appointment_reminder',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      data: {
        appointmentId: '125',
        patientId: '458',
        patientName: 'Lucas Petit',
        patientImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
        doctorId: '791',
        doctorName: 'Dr. Claire Dubois',
        doctorImage: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg',
        date: '2025-05-17',
        time: '09:15'
      }
    }
  ];
};
