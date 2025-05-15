import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import * as notificationService from '../api/notificationService';

// Création du contexte
const NotificationContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications doit être utilisé à l\'intérieur d\'un NotificationProvider');
  }
  return context;
};

// Fournisseur du contexte
export const NotificationProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fonction pour charger les notifications
  const fetchUserNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Utiliser le service de notification
      const data = await notificationService.fetchNotifications();
      
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    } catch (err) {
      console.error('Erreur lors du chargement des notifications:', err);
      setError('Impossible de charger les notifications');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Charger les notifications au chargement et quand l'utilisateur change
  useEffect(() => {
    fetchUserNotifications();
    
    // Ici, vous pourriez configurer un WebSocket ou une connexion SSE
    // pour recevoir les notifications en temps réel
    
    // Exemple avec un intervalle de rafraîchissement
    const intervalId = setInterval(() => {
      fetchUserNotifications();
    }, 60000); // Rafraîchir toutes les minutes
    
    return () => clearInterval(intervalId);
  }, [fetchUserNotifications, user?.id]);

  // Marquer une notification comme lue
  const markAsRead = useCallback(async (notificationId) => {
    try {
      // Appeler l'API
      await notificationService.markAsRead(notificationId);
      
      // Mise à jour locale
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Erreur lors du marquage de la notification comme lue:', err);
      setError('Impossible de marquer la notification comme lue');
    }
  }, []);

  // Marquer toutes les notifications comme lues
  const markAllAsRead = useCallback(async () => {
    try {
      // Appeler l'API
      await notificationService.markAllAsRead();
      
      // Mise à jour locale
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      setUnreadCount(0);
    } catch (err) {
      console.error('Erreur lors du marquage de toutes les notifications comme lues:', err);
      setError('Impossible de marquer toutes les notifications comme lues');
    }
  }, []);

  // Supprimer une notification
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      // Appeler l'API
      await notificationService.deleteNotification(notificationId);
      
      // Mise à jour locale
      const notification = notifications.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (err) {
      console.error('Erreur lors de la suppression de la notification:', err);
      setError('Impossible de supprimer la notification');
    }
  }, [notifications]);

  // Valeur du contexte
  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications: fetchUserNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
