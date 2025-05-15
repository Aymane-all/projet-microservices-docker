import React, { useRef } from 'react';
import { Bell, X, User, Calendar, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const NotificationCenter = () => {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = useRef(null);

  // Les notifications sont maintenant gérées par le contexte NotificationContext
  
  // Fermer le dropdown lorsqu'on clique en dehors
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Ces fonctions sont maintenant fournies par le contexte NotificationContext
  
  // Formater la date relative (ex: "il y a 30 minutes")
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return "à l'instant";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `il y a ${days} jour${days > 1 ? 's' : ''}`;
    }
  };
  
  // Obtenir le contenu de la notification en fonction de son type
  const getNotificationContent = (notification) => {
    const { type, data } = notification;
    
    switch (type) {
      case 'appointment_booked':
        return {
          title: 'Nouveau rendez-vous',
          message: `Rendez-vous confirmé avec ${user?.role === 'doctor' ? data.patientName : data.doctorName} le ${data.date} à ${data.time}.`,
          icon: <Calendar className="text-primary-500" />,
          profileImage: user?.role === 'doctor' ? data.patientImage : data.doctorImage,
          profileName: user?.role === 'doctor' ? data.patientName : data.doctorName,
          profileLink: user?.role === 'doctor' ? `/patients/${data.patientId}` : `/doctors/${data.doctorId}`,
          actionLink: `/appointments/${data.appointmentId}`
        };
      case 'appointment_canceled':
        return {
          title: 'Rendez-vous annulé',
          message: `Rendez-vous avec ${user?.role === 'doctor' ? data.patientName : data.doctorName} le ${data.date} à ${data.time} a été annulé.`,
          icon: <XCircle className="text-red-500" />,
          profileImage: user?.role === 'doctor' ? data.patientImage : data.doctorImage,
          profileName: user?.role === 'doctor' ? data.patientName : data.doctorName,
          profileLink: user?.role === 'doctor' ? `/patients/${data.patientId}` : `/doctors/${data.doctorId}`,
          actionLink: `/appointments`
        };
      case 'appointment_reminder':
        return {
          title: 'Rappel de rendez-vous',
          message: `Rappel: Vous avez rendez-vous avec ${user?.role === 'doctor' ? data.patientName : data.doctorName} demain à ${data.time}.`,
          icon: <CheckCircle className="text-green-500" />,
          profileImage: user?.role === 'doctor' ? data.patientImage : data.doctorImage,
          profileName: user?.role === 'doctor' ? data.patientName : data.doctorName,
          profileLink: user?.role === 'doctor' ? `/patients/${data.patientId}` : `/doctors/${data.doctorId}`,
          actionLink: `/appointments/${data.appointmentId}`
        };
      default:
        return {
          title: 'Notification',
          message: 'Vous avez une nouvelle notification.',
          icon: <Bell className="text-gray-500" />,
          profileImage: null,
          profileName: null,
          profileLink: null,
          actionLink: null
        };
    }
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Icône de notification avec badge */}
      <button
        className="relative p-1 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="sr-only">Notifications</span>
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs font-medium flex items-center justify-center transform -translate-y-1/4 translate-x-1/4">
            {unreadCount}
          </span>
        )}
      </button>
      
      {/* Dropdown de notifications */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg overflow-hidden z-50 transform origin-top-right transition-all duration-200 ease-out">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-primary-600 hover:text-primary-800 font-medium"
              >
                Tout marquer comme lu
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Aucune notification
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {notifications.map(notification => {
                  const content = getNotificationContent(notification);
                  return (
                    <li 
                      key={notification.id} 
                      className={`relative ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
                    >
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mr-3">
                            {content.profileImage ? (
                              <Link to={content.profileLink} className="block relative">
                                <img 
                                  src={content.profileImage} 
                                  alt={content.profileName}
                                  className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm" 
                                />
                                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-green-400" />
                              </Link>
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <User size={20} className="text-gray-500" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {content.title}
                              </p>
                              <div className="ml-2 flex-shrink-0 flex">
                                <p className="text-xs text-gray-500">
                                  {formatRelativeTime(notification.createdAt)}
                                </p>
                              </div>
                            </div>
                            
                            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                              {content.message}
                            </p>
                            
                            <div className="mt-2 flex justify-between">
                              {content.actionLink && (
                                <Link 
                                  to={content.actionLink}
                                  className="text-xs text-primary-600 hover:text-primary-800 font-medium flex items-center"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  Voir les détails
                                  <ChevronRight size={14} className="ml-1" />
                                </Link>
                              )}
                              
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-xs text-gray-500 hover:text-gray-700"
                                >
                                  Marquer comme lu
                                </button>
                              )}
                            </div>
                          </div>
                          
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
                          >
                            <span className="sr-only">Supprimer</span>
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-200 text-center">
            <Link
              to="/notifications"
              className="text-sm font-medium text-primary-600 hover:text-primary-800"
              onClick={() => setIsOpen(false)}
            >
              Voir toutes les notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
