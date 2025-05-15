import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  ChevronRight, 
  Activity, 
  Search, 
  AlertCircle,
  CheckCircle,
  User,
  FileText,
  Bell,
  Heart,
  Settings,
  Pill,
  Stethoscope,
  XCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppointments } from '../../context/AppointmentContext';
import AnimatedButton from '../../components/common/AnimatedButton';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { showNotification, NOTIFICATION_TYPES } from '../../components/common/Notification';
import { useNotifications } from '../../context/NotificationContext';
import { format } from 'date-fns';

// Configuration pour les notifications
const notificationConfig = {
  appointment_booked: {
    icon: <Calendar className="h-5 w-5 text-primary-600" />,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-100',
    iconBgColor: 'bg-blue-100',
    getText: (data) => `Votre rendez-vous avec Dr. ${data?.doctorName || 'Inconnu'} est confirmé pour le ${data?.date || 'date inconnue'} à ${data?.time || 'heure inconnue'}`
  },
  appointment_canceled: {
    icon: <XCircle className="h-5 w-5 text-red-600" />,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-100',
    iconBgColor: 'bg-red-100',
    getText: (data) => `Votre rendez-vous avec Dr. ${data?.doctorName || 'Inconnu'} le ${data?.date || 'date inconnue'} a été annulé`
  },
  appointment_reminder: {
    icon: <Calendar className="h-5 w-5 text-primary-600" />,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-100',
    iconBgColor: 'bg-blue-100',
    getText: (data) => `Rappel: Votre rendez-vous avec Dr. ${data?.doctorName || 'Inconnu'} est demain à ${data?.time || 'heure inconnue'}`
  },
  medical_report_available: {
    icon: <FileText className="h-5 w-5 text-purple-600" />,
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-100',
    iconBgColor: 'bg-purple-100',
    getText: () => 'Un nouveau rapport médical est disponible'
  }
};

const PatientDashboard = () => {
  const { user } = useAuth();
  const { getPatientAppointments, isLoading } = useAppointments();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Utiliser le contexte de notification
  const { notifications, unreadCount, loading: notificationsLoading, markAsRead } = useNotifications();
  
  // Fonction pour formater les dates relatives
  const formatRelativeTime = (dateString) => {
    if (!dateString) return 'Date non disponible';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Date invalide';

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
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [healthMetrics, setHealthMetrics] = useState({
    heartRate: { value: 72, trend: 'stable' },
    bloodPressure: { value: '120/80', trend: 'down' },
    weight: { value: '75 kg', trend: 'down' },
    sleep: { value: '7.5 hrs', trend: 'up' }
  });
  const [medications] = useState([
    { id: 1, name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', time: 'Morning', refill: '10 days left' },
    { id: 2, name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', time: 'Morning/Evening', refill: '15 days left' }
  ]);
  
  // Références pour les animations au scroll
  const overviewRef = useRef(null);
  const appointmentsRef = useRef(null);
  const notificationsRef = useRef(null);
  

  // Fonction pour récupérer les rendez-vous
  const fetchAppointments = async () => {
    try {
      if (!user?.id) return;
      
      const appointments = await getPatientAppointments(user.id);
      
      // Filtrer les rendez-vous à venir (confirmés et dans le futur)
      const now = new Date();
      const upcoming = appointments.filter(
        apt => apt.status === 'confirmed' && new Date(apt.dateTime) > now
      ).sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
      
      // Filtrer les rendez-vous en attente
      const pending = appointments.filter(apt => apt.status === 'pending')
        .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
      
      setUpcomingAppointments(upcoming);
      setPendingAppointments(pending);
      showNotification('Données du tableau de bord mises à jour', NOTIFICATION_TYPES.INFO);
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous:', error);
      showNotification('Erreur lors de la récupération des rendez-vous', NOTIFICATION_TYPES.ERROR);
    }
  };

  // Récupérer les rendez-vous au chargement de la page
  useEffect(() => {
    if (user?.id) {
      fetchAppointments();
    }
  }, [user]);
  
  // Effet pour animer l'entrée de la page
  useEffect(() => {
    // Simuler un temps de chargement pour l'animation
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Gérer le changement d'onglet
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Afficher un écran de chargement pendant le chargement des données
  if (isLoading && !isPageLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" color="primary" />
          <p className="mt-4 text-gray-600">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête avec animation */}
        <div className={`mb-8 transition-all duration-700 transform ${isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
              <p className="mt-2 text-gray-600">Bienvenue, <span className="text-primary-600 font-medium">{user?.name}</span> !</p>
            </div>
            <div className="flex space-x-2">
              <AnimatedButton 
                variant="outline" 
                size="sm"
                onClick={() => fetchAppointments()}
              >
                <Clock size={16} className="mr-1" /> Actualiser
              </AnimatedButton>
              <AnimatedButton 
                variant="primary" 
                size="sm"
                onClick={() => showNotification('Profil mis à jour', NOTIFICATION_TYPES.SUCCESS)}
              >
                <User size={16} className="mr-1" /> Mon profil
              </AnimatedButton>
            </div>
          </div>
        </div>
        
        {/* Onglets de navigation */}
        <div className={`mb-8 transition-all duration-700 delay-100 transform ${isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex flex-wrap border-b border-gray-200">
            <button
              onClick={() => handleTabChange('overview')}
              className={`mr-8 py-4 text-sm font-medium border-b-2 transition-colors duration-300 ${activeTab === 'overview' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <Activity className="inline-block mr-2 h-5 w-5" /> Vue d'ensemble
            </button>
            <button
              onClick={() => handleTabChange('appointments')}
              className={`mr-8 py-4 text-sm font-medium border-b-2 transition-colors duration-300 ${activeTab === 'appointments' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <Calendar className="inline-block mr-2 h-5 w-5" /> Rendez-vous
            </button>
            <button
              onClick={() => handleTabChange('health')}
              className={`mr-8 py-4 text-sm font-medium border-b-2 transition-colors duration-300 ${activeTab === 'health' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <Heart className="inline-block mr-2 h-5 w-5" /> Santé
            </button>
            <button
              onClick={() => handleTabChange('medications')}
              className={`mr-8 py-4 text-sm font-medium border-b-2 transition-colors duration-300 ${activeTab === 'medications' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <Pill className="inline-block mr-2 h-5 w-5" /> Médicaments
            </button>
            <button
              onClick={() => handleTabChange('notifications')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors duration-300 ${activeTab === 'notifications' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <Bell className="inline-block mr-2 h-5 w-5" /> Notifications
            </button>
          </div>
        </div>

        {/* Contenu principal en fonction de l'onglet actif */}
        {activeTab === 'overview' && (
          <div ref={overviewRef} className={`transition-all duration-700 delay-200 transform ${isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {/* Actions rapides */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions rapides</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/patient/doctors" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="p-2 rounded-full bg-primary-100">
                          <Search className="h-5 w-5 text-primary-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Trouver un médecin</h3>
                      </div>
                      <p className="text-gray-600 text-sm">Rechercher par spécialité, nom ou disponibilité</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </Link>
                <Link to="/patient/appointments" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="p-2 rounded-full bg-secondary-100">
                          <Calendar className="h-5 w-5 text-secondary-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Mes rendez-vous</h3>
                      </div>
                      <p className="text-gray-600 text-sm">Consulter et gérer vos rendez-vous</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </Link>
                <Link to="#" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="p-2 rounded-full bg-accent-100">
                          <FileText className="h-5 w-5 text-accent-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Dossier médical</h3>
                      </div>
                      <p className="text-gray-600 text-sm">Accéder à votre historique et vos rapports médicaux</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </Link>
              </div>
            </section>
            
            {/* Statistiques de santé */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Statistiques de santé</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-lg shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-500">Rythme cardiaque</h3>
                    <div className="p-2 rounded-full bg-red-100">
                      <Heart className="h-4 w-4 text-red-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{healthMetrics.heartRate.value} <span className="text-sm font-normal text-gray-500">bpm</span></p>
                  <p className="text-xs text-gray-500 mt-1">Tendance: {healthMetrics.heartRate.trend === 'stable' ? 'Stable' : healthMetrics.heartRate.trend === 'up' ? 'En hausse' : 'En baisse'}</p>
                </div>
                
                <div className="bg-white p-5 rounded-lg shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-500">Tension artérielle</h3>
                    <div className="p-2 rounded-full bg-blue-100">
                      <Activity className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{healthMetrics.bloodPressure.value}</p>
                  <p className="text-xs text-gray-500 mt-1">Tendance: {healthMetrics.bloodPressure.trend === 'stable' ? 'Stable' : healthMetrics.bloodPressure.trend === 'up' ? 'En hausse' : 'En baisse'}</p>
                </div>
                
                <div className="bg-white p-5 rounded-lg shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-500">Poids</h3>
                    <div className="p-2 rounded-full bg-green-100">
                      <Activity className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{healthMetrics.weight.value}</p>
                  <p className="text-xs text-gray-500 mt-1">Tendance: {healthMetrics.weight.trend === 'stable' ? 'Stable' : healthMetrics.weight.trend === 'up' ? 'En hausse' : 'En baisse'}</p>
                </div>
                
                <div className="bg-white p-5 rounded-lg shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-500">Sommeil</h3>
                    <div className="p-2 rounded-full bg-purple-100">
                      <Clock className="h-4 w-4 text-purple-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{healthMetrics.sleep.value}</p>
                  <p className="text-xs text-gray-500 mt-1">Tendance: {healthMetrics.sleep.trend === 'stable' ? 'Stable' : healthMetrics.sleep.trend === 'up' ? 'En hausse' : 'En baisse'}</p>
                </div>
              </div>
            </section>

            {/* Rendez-vous à venir */}
            <section className="mb-8" ref={appointmentsRef}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Rendez-vous à venir</h2>
                <Link to="/patient/appointments">
                  <AnimatedButton variant="outline" size="sm">
                    Voir tous
                  </AnimatedButton>
                </Link>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center my-8">
                  <LoadingSpinner size="md" color="primary" />
                </div>
              ) : upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.slice(0, 3).map((appointment, index) => (
                    <div 
                      key={appointment.id} 
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01] border border-gray-100 ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                      style={{ transitionDelay: `${300 + (index * 100)}ms` }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-0">
                        <div className="mr-4 mb-3 sm:mb-0">
                          {appointment.doctor?.profileImage ? (
                            <img 
                              src={appointment.doctor.profileImage} 
                              alt={appointment.doctor.name} 
                              className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-md"
                            />
                          ) : (
                            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-600 shadow-md">
                              <span className="text-lg font-medium">
                                {appointment.doctor?.name?.charAt(0) || '?'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <div className="px-2 py-1 rounded-full bg-green-100 flex items-center">
                              <CheckCircle className="h-3 w-3 text-green-600 mr-1" />
                              <span className="text-xs font-medium text-green-700">Confirmé</span>
                            </div>
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mt-1">{appointment.doctor?.name}</h3>
                          <p className="text-sm text-gray-500">{appointment.doctor?.specialty?.name || 'Spécialité non spécifiée'}</p>
                          <div className="flex flex-wrap gap-3 mt-2">
                            <div className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                              <Calendar className="h-3 w-3 mr-1" />
                              {format(new Date(appointment.dateTime), 'MMMM d, yyyy')}
                            </div>
                            <div className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                              <Clock className="h-3 w-3 mr-1" />
                              {format(new Date(appointment.dateTime), 'h:mm a')}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <AnimatedButton variant="outline" size="sm" onClick={() => showNotification('Fonctionnalité de reprogrammation en cours de développement', NOTIFICATION_TYPES.INFO)}>
                          Reprogrammer
                        </AnimatedButton>
                        <AnimatedButton variant="danger" size="sm" onClick={() => showNotification('Fonctionnalité d\'annulation en cours de développement', NOTIFICATION_TYPES.WARNING)}>
                          Annuler
                        </AnimatedButton>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-white rounded-lg shadow-md border border-gray-100 transition-all duration-500 transform ${isPageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-100 mb-4 transition-all duration-300 transform hover:scale-110">
                    <Calendar className="h-10 w-10 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Aucun rendez-vous à venir</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">Planifiez votre prochaine visite avec un médecin pour commencer à prendre soin de votre santé</p>
                  <Link to="/patient/doctors">
                    <AnimatedButton variant="primary">
                      <Search size={16} className="mr-2" />
                      Trouver un médecin
                    </AnimatedButton>
                  </Link>
                </div>
              )}
            </section>

            {/* Rendez-vous en attente */}
            <section className="mb-8" ref={notificationsRef}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg transform hover:scale-[1.01]">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Approbations en attente</h2>
                    {pendingAppointments.length > 0 && (
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {pendingAppointments.length}
                      </span>
                    )}
                  </div>
                  
                  {isLoading ? (
                    <div className="flex justify-center my-4">
                      <LoadingSpinner size="sm" color="primary" />
                    </div>
                  ) : pendingAppointments.length > 0 ? (
                    <div className="space-y-3">
                      {pendingAppointments.map((appointment, index) => (
                        <div 
                          key={appointment.id} 
                          className={`p-4 bg-white rounded-lg shadow-sm border border-yellow-200 hover:shadow-md transition-all duration-300 ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                          style={{ transitionDelay: `${600 + (index * 100)}ms` }}
                        >
                          <div className="flex items-center mb-2">
                            <div className="px-2 py-1 rounded-full bg-yellow-100 flex items-center">
                              <AlertCircle className="h-3 w-3 text-yellow-600 mr-1" />
                              <span className="text-xs font-medium text-yellow-700">En attente de confirmation</span>
                            </div>
                          </div>
                          <h3 className="font-medium text-gray-900">
                            {appointment.doctor?.name}
                          </h3>
                          <div className="flex flex-wrap gap-3 mt-2">
                            <div className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                              <Calendar className="h-3 w-3 mr-1" />
                              {format(new Date(appointment.dateTime), 'MMMM d, yyyy')}
                            </div>
                            <div className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                              <Clock className="h-3 w-3 mr-1" />
                              {format(new Date(appointment.dateTime), 'h:mm a')}
                            </div>
                          </div>
                          <div className="mt-3 flex justify-end">
                            <AnimatedButton 
                              variant="text" 
                              size="sm"
                              onClick={() => showNotification('Détails du rendez-vous en attente', NOTIFICATION_TYPES.INFO)}
                            >
                              Voir détails
                            </AnimatedButton>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-gray-50 rounded-lg">
                      <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-2" />
                      <p className="text-gray-600">Aucun rendez-vous en attente</p>
                    </div>
                  )}
                </div>

                {/* Notifications */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg transform hover:scale-[1.01]">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {unreadCount > 0 ? `${unreadCount} nouvelle${unreadCount > 1 ? 's' : ''}` : 'Aucune nouvelle'}
                    </span>
                  </div>
                  
                  {notificationsLoading ? (
                    <div className="flex justify-center py-4">
                      <LoadingSpinner size="medium" />
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      Aucune notification
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {notifications.slice(0, 3).map((notification, index) => {
                        const { type, data, read, createdAt, id } = notification;
                        const isNew = !read;
                        
                        // Obtenir la configuration pour ce type de notification
                        const config = notificationConfig[type] || {
                          icon: <Bell className="h-5 w-5 text-gray-600" />,
                          bgColor: "bg-gray-50",
                          borderColor: "border-gray-100",
                          iconBgColor: "bg-gray-100",
                          getText: () => "Nouvelle notification"
                        };
                        
                        // Formater la date relative
                        const formattedDate = formatRelativeTime(createdAt);
                        
                        return (
                          <div 
                            key={id} 
                            className={`flex items-start space-x-3 p-4 ${config.bgColor} rounded-lg border ${config.borderColor} transition-all duration-300 ${isNew ? 'shadow-md' : ''}`}
                          >
                            <div className="flex-shrink-0">
                              <div className={`h-10 w-10 rounded-full ${config.iconBgColor} flex items-center justify-center shadow-sm`}>
                                {config.icon}
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-900 font-medium">
                                {config.getText(data)}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">{formattedDate}</p>
                              
                              <div className="mt-2 flex space-x-2">
                                {type === 'appointment_reminder' && (
                                  <AnimatedButton 
                                    variant="outline" 
                                    size="xs"
                                    onClick={() => {
                                      showNotification('Rappel ajouté au calendrier', NOTIFICATION_TYPES.SUCCESS);
                                      // Logique pour ajouter au calendrier
                                    }}
                                  >
                                    Ajouter un rappel
                                  </AnimatedButton>
                                )}
                                
                                {isNew && (
                                  <AnimatedButton 
                                    variant="text" 
                                    size="xs"
                                    onClick={() => markAsRead(id)}
                                  >
                                    Marquer comme lu
                                  </AnimatedButton>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      
                      {notifications.length > 3 && (
                        <div className="text-center pt-2">
                          <Link 
                            to="/notifications" 
                            className="text-sm font-medium text-primary-600 hover:text-primary-700"
                          >
                            Voir toutes les notifications ({notifications.length})
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </section>
            
            {/* Onglet Médicaments */}
            {activeTab === 'medications' && (
              <div className="transition-all duration-500 transform ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Mes médicaments</h2>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Médicament</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fréquence</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Renouvellement</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {medications.map((med) => (
                          <tr key={med.id} className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0">
                                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                    <Pill className="h-5 w-5 text-primary-600" />
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{med.name}</div>
                                  <div className="text-sm text-gray-500">{med.time}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{med.dosage}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{med.frequency}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                {med.refill}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-primary-600 hover:text-primary-900 mr-3">Renouveler</button>
                              <button className="text-gray-600 hover:text-gray-900">Détails</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;