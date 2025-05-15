import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  ChevronRight,
  Users,
  BarChart3,
  User,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  FileText,
  Pill,
  MessageCircle,
  Search,
  Bell
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { useAppointments } from '../../context/AppointmentContext';
import AnimatedButton from '../../components/common/AnimatedButton';
import { showNotification, NOTIFICATION_TYPES } from '../../components/common/Notification';

// Composant de statistique avec animation
const StatCard = ({ icon: Icon, title, value, color, delay }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${color} transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace('border-l-4', 'bg')}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
};

// Composant pour les actions rapides
const QuickAction = ({ icon: Icon, title, onClick, color, delay }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] ${color === 'primary' ? 'hover:bg-primary-50' : 'hover:bg-gray-50'}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`p-2 rounded-full mr-3 ${color === 'primary' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'}`}>
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-sm font-medium text-gray-700">{title}</span>
    </button>
  );
};

// Composant pour le spinner de chargement
const LoadingSpinner = ({ size = "md", color = "primary" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  const colorClasses = {
    primary: "border-primary-200 border-t-primary-600",
    secondary: "border-gray-200 border-t-gray-600",
    white: "border-gray-100 border-t-white"
  };

  return (
    <div className={`${sizeClasses[size]} border-4 ${colorClasses[color]} rounded-full animate-spin`}></div>
  );
};

const DoctorDashboard = () => {
  const { user } = useAuth();
  const { getDoctorAppointments, updateAppointmentStatus, isLoading } = useAppointments();
  const [appointments, setAppointments] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('appointments');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Nouveau message de patient: Marie Dupont", time: "Il y a 5 minutes", type: "message" },
    { id: 2, message: "Rappel: Réunion d'équipe à 14h00", time: "Il y a 1 heure", type: "reminder" }
  ]);

  useEffect(() => {
    if (user?.id) {
      const fetchAppointments = async () => {
        const fetchedAppointments = await getDoctorAppointments(user.id);
        setAppointments(fetchedAppointments);
        // Activer les animations après le chargement des données
        setTimeout(() => setIsPageLoaded(true), 300);
      };
      fetchAppointments();
    }
  }, [user, getDoctorAppointments]);

  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      setUpdatingId(appointmentId);
      await updateAppointmentStatus(appointmentId, status);
      
      // Afficher une notification en fonction du statut
      if (status === 'confirmed') {
        showNotification('Rendez-vous confirmé avec succès', NOTIFICATION_TYPES.SUCCESS);
      } else if (status === 'cancelled') {
        showNotification('Rendez-vous annulé', NOTIFICATION_TYPES.INFO);
      } else if (status === 'completed') {
        showNotification('Rendez-vous marqué comme terminé', NOTIFICATION_TYPES.SUCCESS);
      }
      
      // Mettre à jour la liste des rendez-vous
      const updatedAppointments = appointments.map(apt => 
        apt.id === appointmentId ? { ...apt, status } : apt
      );
      setAppointments(updatedAppointments);
      
    } catch (error) {
      console.error('Failed to update appointment status:', error);
      showNotification('Erreur lors de la mise à jour du statut', NOTIFICATION_TYPES.ERROR);
    } finally {
      setUpdatingId(null);
    }
  };
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const filteredAppointments = appointments.filter(apt => {
    const patientName = apt.patient?.name?.toLowerCase() || '';
    const searchLower = searchQuery.toLowerCase();
    return patientName.includes(searchLower) || apt.status.includes(searchLower);
  });

  const now = new Date();

  const todaysAppointments = appointments
    .filter(
      apt =>
        apt.status === 'confirmed' &&
        new Date(apt.dateTime).toDateString() === now.toDateString()
    )
    .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

  const pendingAppointments = appointments
    .filter(apt => apt.status === 'pending')
    .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
    
  const upcomingAppointments = appointments
    .filter(
      apt =>
        apt.status === 'confirmed' &&
        new Date(apt.dateTime) > now &&
        new Date(apt.dateTime).toDateString() !== now.toDateString()
    )
    .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

  const stats = {
    total: appointments.length,
    confirmed: appointments.filter(apt => apt.status === 'confirmed').length,
    pending: pendingAppointments.length,
    completed: appointments.filter(apt => apt.status === 'completed').length,
    cancelled: appointments.filter(apt => apt.status === 'cancelled').length
  };
  
  // Données fictives pour les patients récents
  const recentPatients = [
    { id: 1, name: "Marie Dupont", age: 42, lastVisit: "2023-05-15", condition: "Hypertension" },
    { id: 2, name: "Jean Martin", age: 35, lastVisit: "2023-05-10", condition: "Diabète de type 2" },
    { id: 3, name: "Sophie Lefebvre", age: 28, lastVisit: "2023-05-05", condition: "Migraine chronique" }
  ];
  
  // Données fictives pour les médicaments prescrits
  const medications = [
    { id: 1, name: "Amoxicilline", prescriptions: 24, category: "Antibiotique" },
    { id: 2, name: "Paracétamol", prescriptions: 45, category: "Analgésique" },
    { id: 3, name: "Oméprazole", prescriptions: 18, category: "Anti-ulcéreux" }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête du tableau de bord */}
        <div className={`bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-6 shadow-lg mb-8 transition-all duration-700 ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-bold text-white mb-2">Bonjour, Dr. {user?.name || 'Médecin'}</h1>
              <p className="text-primary-100">{format(now, 'EEEE, d MMMM yyyy')}</p>
            </div>
            
            <div className="flex space-x-3">
              <div className="relative">
                <button className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
              
              <Link to="/doctor/profile" className="flex items-center bg-white/20 hover:bg-white/30 transition-colors rounded-full px-3 py-1.5 text-white">
                <div className="h-8 w-8 rounded-full bg-primary-300 flex items-center justify-center mr-2">
                  <User className="h-5 w-5 text-primary-800" />
                </div>
                <span>Mon profil</span>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            icon={Users} 
            title="Total Patients" 
            value={stats.total} 
            color="border-l-blue-500" 
            delay={100} 
          />
          <StatCard 
            icon={Calendar} 
            title="Rendez-vous confirmés" 
            value={stats.confirmed} 
            color="border-l-green-500" 
            delay={200} 
          />
          <StatCard 
            icon={AlertCircle} 
            title="En attente" 
            value={stats.pending} 
            color="border-l-yellow-500" 
            delay={300} 
          />
          <StatCard 
            icon={Activity} 
            title="Complétés" 
            value={stats.completed} 
            color="border-l-purple-500" 
            delay={400} 
          />
        </div>
        
        {/* Actions rapides */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 transition-all duration-700 ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '500ms' }}>
          <QuickAction 
            icon={FileText} 
            title="Nouveaux dossiers" 
            color="primary"
            onClick={() => showNotification('Création de nouveau dossier patient', NOTIFICATION_TYPES.INFO)}
            delay={100}
          />
          <QuickAction 
            icon={Pill} 
            title="Prescriptions" 
            color="primary"
            onClick={() => showNotification('Gestion des prescriptions', NOTIFICATION_TYPES.INFO)}
            delay={200}
          />
          <QuickAction 
            icon={MessageCircle} 
            title="Messages" 
            color="primary"
            onClick={() => showNotification('Messagerie ouverte', NOTIFICATION_TYPES.INFO)}
            delay={300}
          />
          <QuickAction 
            icon={BarChart3} 
            title="Rapports" 
            color="primary"
            onClick={() => showNotification('Génération de rapports', NOTIFICATION_TYPES.INFO)}
            delay={400}
          />
        </div>
        
        {/* Onglets */}
        <div className={`bg-white rounded-lg shadow-md p-2 mb-8 transition-all duration-700 ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '600ms' }}>
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'appointments' ? 'bg-primary-100 text-primary-800' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('appointments')}
            >
              Rendez-vous
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'patients' ? 'bg-primary-100 text-primary-800' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('patients')}
            >
              Patients
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'prescriptions' ? 'bg-primary-100 text-primary-800' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('prescriptions')}
            >
              Prescriptions
            </button>
          </div>
        </div>
        
        {/* Contenu des onglets */}
        <div className="mb-8">
          {/* Barre de recherche */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition duration-150 ease-in-out"
                placeholder="Rechercher un patient ou un rendez-vous..."
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
          
          {/* Onglet Rendez-vous */}
          {activeTab === 'appointments' && (
            <div className="space-y-6">
              {/* Rendez-vous d'aujourd'hui */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 bg-primary-50 border-b border-primary-100">
                  <h2 className="text-lg font-semibold text-primary-800 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary-600" />
                    Rendez-vous d'aujourd'hui
                    {todaysAppointments.length > 0 && (
                      <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
                        {todaysAppointments.length}
                      </span>
                    )}
                  </h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {isLoading ? (
                    <div className="py-8 flex justify-center">
                      <LoadingSpinner />
                    </div>
                  ) : todaysAppointments.length > 0 ? (
                    todaysAppointments.map((appointment, index) => (
                      <div 
                        key={appointment.id} 
                        className={`p-4 hover:bg-gray-50 transition-all duration-300 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        style={{ transitionDelay: `${700 + (index * 100)}ms` }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">{appointment.patient?.name}</h3>
                              <div className="flex items-center mt-1">
                                <Clock className="h-4 w-4 text-gray-400 mr-1" />
                                <span className="text-xs text-gray-500">{format(new Date(appointment.dateTime), 'HH:mm')}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <AnimatedButton
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                              disabled={updatingId === appointment.id}
                            >
                              {updatingId === appointment.id ? (
                                <LoadingSpinner size="sm" color="primary" />
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Terminé
                                </>
                              )}
                            </AnimatedButton>
                            
                            <AnimatedButton
                              variant="text"
                              size="sm"
                              onClick={() => showNotification('Détails du rendez-vous affichés', NOTIFICATION_TYPES.INFO)}
                            >
                              Détails
                            </AnimatedButton>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center">
                      <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">Aucun rendez-vous aujourd'hui</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Rendez-vous en attente */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 bg-yellow-50 border-b border-yellow-100">
                  <h2 className="text-lg font-semibold text-yellow-800 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 text-yellow-600" />
                    Rendez-vous en attente
                    {pendingAppointments.length > 0 && (
                      <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                        {pendingAppointments.length}
                      </span>
                    )}
                  </h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {isLoading ? (
                    <div className="py-8 flex justify-center">
                      <LoadingSpinner />
                    </div>
                  ) : pendingAppointments.length > 0 ? (
                    pendingAppointments.map((appointment, index) => (
                      <div 
                        key={appointment.id} 
                        className={`p-4 hover:bg-gray-50 transition-all duration-300 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        style={{ transitionDelay: `${800 + (index * 100)}ms` }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                              <User className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">{appointment.patient?.name}</h3>
                              <div className="flex items-center mt-1 space-x-3">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                                  <span className="text-xs text-gray-500">{format(new Date(appointment.dateTime), 'dd/MM/yyyy')}</span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 text-gray-400 mr-1" />
                                  <span className="text-xs text-gray-500">{format(new Date(appointment.dateTime), 'HH:mm')}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <AnimatedButton
                              variant="primary"
                              size="sm"
                              onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                              disabled={updatingId === appointment.id}
                            >
                              {updatingId === appointment.id ? (
                                <LoadingSpinner size="sm" color="white" />
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Confirmer
                                </>
                              )}
                            </AnimatedButton>
                            
                            <AnimatedButton
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                              disabled={updatingId === appointment.id}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Refuser
                            </AnimatedButton>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center">
                      <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">Aucun rendez-vous en attente</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Prochains rendez-vous */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 bg-green-50 border-b border-green-100">
                  <h2 className="text-lg font-semibold text-green-800 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-green-600" />
                    Prochains rendez-vous
                  </h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {isLoading ? (
                    <div className="py-8 flex justify-center">
                      <LoadingSpinner />
                    </div>
                  ) : upcomingAppointments.length > 0 ? (
                    upcomingAppointments.slice(0, 3).map((appointment, index) => (
                      <div 
                        key={appointment.id} 
                        className={`p-4 hover:bg-gray-50 transition-all duration-300 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        style={{ transitionDelay: `${900 + (index * 100)}ms` }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                              <User className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">{appointment.patient?.name}</h3>
                              <div className="flex items-center mt-1 space-x-3">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                                  <span className="text-xs text-gray-500">{format(new Date(appointment.dateTime), 'dd/MM/yyyy')}</span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 text-gray-400 mr-1" />
                                  <span className="text-xs text-gray-500">{format(new Date(appointment.dateTime), 'HH:mm')}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <AnimatedButton
                            variant="text"
                            size="sm"
                            onClick={() => showNotification('Détails du rendez-vous affichés', NOTIFICATION_TYPES.INFO)}
                          >
                            Détails
                          </AnimatedButton>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center">
                      <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">Aucun rendez-vous à venir</p>
                    </div>
                  )}
                  
                  {upcomingAppointments.length > 3 && (
                    <div className="p-4 text-center">
                      <AnimatedButton
                        variant="text"
                        onClick={() => showNotification('Affichage de tous les rendez-vous', NOTIFICATION_TYPES.INFO)}
                      >
                        Voir tous les rendez-vous ({upcomingAppointments.length})
                      </AnimatedButton>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Onglet Patients */}
          {activeTab === 'patients' && (
            <div className="space-y-6">
              {/* Patients récents */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
                  <h2 className="text-lg font-semibold text-blue-800 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-600" />
                    Patients récents
                  </h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Âge</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dernière visite</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentPatients.map((patient, index) => (
                        <tr 
                          key={patient.id} 
                          className={`hover:bg-gray-50 transition-all duration-300 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`}
                          style={{ transitionDelay: `${700 + (index * 100)}ms` }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <User className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.age} ans</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.lastVisit}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {patient.condition}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-primary-600 hover:text-primary-900 mr-3">Dossier</button>
                            <button className="text-gray-600 hover:text-gray-900">Contacter</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Statistiques patients */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistiques des patients</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Total patients</p>
                    <p className="text-2xl font-bold">124</p>
                    <div className="mt-2 text-xs text-green-600">+12% ce mois</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Nouveaux patients</p>
                    <p className="text-2xl font-bold">18</p>
                    <div className="mt-2 text-xs text-green-600">+5% ce mois</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Consultations ce mois</p>
                    <p className="text-2xl font-bold">87</p>
                    <div className="mt-2 text-xs text-green-600">+8% vs mois dernier</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Onglet Prescriptions */}
          {activeTab === 'prescriptions' && (
            <div className="space-y-6">
              {/* Médicaments les plus prescrits */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 bg-purple-50 border-b border-purple-100">
                  <h2 className="text-lg font-semibold text-purple-800 flex items-center">
                    <Pill className="h-5 w-5 mr-2 text-purple-600" />
                    Médicaments les plus prescrits
                  </h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Médicament</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prescriptions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {medications.map((med, index) => (
                        <tr 
                          key={med.id} 
                          className={`hover:bg-gray-50 transition-all duration-300 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`}
                          style={{ transitionDelay: `${700 + (index * 100)}ms` }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <Pill className="h-4 w-4 text-purple-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{med.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{med.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                              {med.prescriptions} prescriptions
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Nouvelle prescription */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Nouvelle prescription</h2>
                <div className="flex justify-center">
                  <AnimatedButton
                    variant="primary"
                    onClick={() => showNotification('Formulaire de prescription ouvert', NOTIFICATION_TYPES.INFO)}
                  >
                    <FileText className="h-5 w-5 mr-2" />
                    Créer une prescription
                  </AnimatedButton>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
