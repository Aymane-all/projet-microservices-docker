import React, { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

/**
 * Types de notifications disponibles
 */
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

/**
 * Affiche une notification
 * @param {string} message - Le message à afficher
 * @param {string} type - Le type de notification (success, error, info, warning)
 * @param {number} duration - La durée d'affichage en ms
 */
export const showNotification = (message, type = NOTIFICATION_TYPES.INFO, duration = 3000) => {
  switch (type) {
    case NOTIFICATION_TYPES.SUCCESS:
      toast.success(message, { duration });
      break;
    case NOTIFICATION_TYPES.ERROR:
      toast.error(message, { duration });
      break;
    case NOTIFICATION_TYPES.WARNING:
      toast(message, {
        duration,
        icon: '⚠️',
        style: {
          borderRadius: '10px',
          background: '#FEF3C7',
          color: '#92400E',
        },
      });
      break;
    case NOTIFICATION_TYPES.INFO:
    default:
      toast(message, {
        duration,
        icon: 'ℹ️',
        style: {
          borderRadius: '10px',
          background: '#E0F2FE',
          color: '#0369A1',
        },
      });
      break;
  }
};

/**
 * Composant de notification à inclure une seule fois dans l'application
 * @param {Object} props - Les propriétés du composant
 * @param {Object} props.toastOptions - Options pour personnaliser les toasts
 */
const Notification = ({ toastOptions = {} }) => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Styles par défaut
        duration: 3000,
        style: {
          background: '#fff',
          color: '#363636',
          borderRadius: '8px',
          boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
          padding: '16px',
          fontSize: '14px',
        },
        // Options personnalisées
        ...toastOptions,
        // Styles spécifiques par type
        success: {
          style: {
            background: '#F0FDF4',
            color: '#166534',
            borderLeft: '4px solid #22C55E',
          },
          iconTheme: {
            primary: '#22C55E',
            secondary: '#FFFFFF',
          },
        },
        error: {
          style: {
            background: '#FEF2F2',
            color: '#B91C1C',
            borderLeft: '4px solid #EF4444',
          },
          iconTheme: {
            primary: '#EF4444',
            secondary: '#FFFFFF',
          },
        },
      }}
    />
  );
};

export default Notification;
