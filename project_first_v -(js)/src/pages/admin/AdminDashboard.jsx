import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Calendar, Settings, Activity, 
  BarChart2, Bell, User, LogOut, Menu, X, 
  Home, ChevronRight, Search, Filter
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import StatCard from '../../components/admin/StatCard';

const AdminDashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    recentAppointments: []
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  
  // États pour le filtrage et la pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Simuler le chargement des données
  useEffect(() => {
    // Vérifier si l'utilisateur est authentifié et est un admin
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        // Simuler un appel API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Données fictives pour la démo - ajout de plus de rendez-vous pour la pagination
        setStats({
          totalUsers: 1248,
          totalDoctors: 84,
          totalPatients: 1164,
          totalAppointments: 756,
          recentAppointments: [
            { id: 1, patient: 'Jean Dupont', doctor: 'Dr. Marie Lambert', date: '2025-05-14', time: '09:30', status: 'completed' },
            { id: 2, patient: 'Sophie Martin', doctor: 'Dr. Thomas Bernard', date: '2025-05-14', time: '11:00', status: 'upcoming' },
            { id: 3, patient: 'Lucas Petit', doctor: 'Dr. Claire Dubois', date: '2025-05-14', time: '14:15', status: 'upcoming' },
            { id: 4, patient: 'Emma Leroy', doctor: 'Dr. Marie Lambert', date: '2025-05-15', time: '10:30', status: 'upcoming' },
            { id: 5, patient: 'Hugo Moreau', doctor: 'Dr. Thomas Bernard', date: '2025-05-15', time: '16:00', status: 'upcoming' },
            { id: 6, patient: 'Léa Dubois', doctor: 'Dr. Claire Dubois', date: '2025-05-16', time: '09:00', status: 'upcoming' },
            { id: 7, patient: 'Thomas Lefèvre', doctor: 'Dr. Marie Lambert', date: '2025-05-16', time: '14:00', status: 'upcoming' },
            { id: 8, patient: 'Julie Roux', doctor: 'Dr. Thomas Bernard', date: '2025-05-17', time: '11:30', status: 'completed' },
            { id: 9, patient: 'Maxime Girard', doctor: 'Dr. Claire Dubois', date: '2025-05-17', time: '15:45', status: 'completed' },
            { id: 10, patient: 'Camille Fournier', doctor: 'Dr. Marie Lambert', date: '2025-05-18', time: '10:00', status: 'upcoming' },
            { id: 11, patient: 'Antoine Morel', doctor: 'Dr. Thomas Bernard', date: '2025-05-18', time: '16:30', status: 'upcoming' },
            { id: 12, patient: 'Inès Vincent', doctor: 'Dr. Claire Dubois', date: '2025-05-19', time: '08:45', status: 'upcoming' }
          ]
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, navigate, user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Données pour les cartes de statistiques
  const statCards = [
    { title: 'Utilisateurs Totaux', value: stats.totalUsers, icon: <Users className="text-primary-500" size={24} />, color: 'bg-primary-50 border-primary-200' },
    { title: 'Médecins', value: stats.totalDoctors, icon: <User className="text-secondary-500" size={24} />, color: 'bg-secondary-50 border-secondary-200' },
    { title: 'Patients', value: stats.totalPatients, icon: <Users className="text-accent-500" size={24} />, color: 'bg-accent-50 border-accent-200' },
    { title: 'Rendez-vous', value: stats.totalAppointments, icon: <Calendar className="text-success-500" size={24} />, color: 'bg-success-50 border-success-200' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar pour mobile */}
      <div 
        className={`fixed inset-0 z-40 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
        onClick={() => setSidebarOpen(false)}
      >
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        <div className="fixed inset-y-0 left-0 flex flex-col max-w-xs w-full bg-white shadow-xl">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                MediConnect
              </span>
            </div>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto pt-5 pb-4">
            <nav className="px-2 space-y-1">
              {renderNavItems(true)}
            </nav>
          </div>
          <div className="border-t border-gray-200 p-4">
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
            >
              <LogOut size={20} className="mr-3 text-gray-500" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar pour desktop */}
      <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 bg-white shadow-lg animate-fade-in">
        <div className="flex items-center h-16 px-4 border-b border-gray-200">
          <span className="text-xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            MediConnect
          </span>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="px-4 py-6">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-600 shadow-sm">
                <User size={20} />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500">Administrateur</p>
              </div>
            </div>
          </div>
          <nav className="mt-5 px-4 space-y-1">
            {renderNavItems()}
          </nav>
        </div>
        <div className="border-t border-gray-200 p-4">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors duration-200"
          >
            <LogOut size={20} className="mr-3 text-gray-500" />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 md:px-8">
            <div className="flex items-center md:hidden">
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={24} />
              </button>
            </div>
            <div className="flex-1 flex justify-center md:justify-end">
              <div className="max-w-lg w-full">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Rechercher..."
                  />
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                <Bell size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Contenu du dashboard */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* En-tête de la page */}
            <div className="md:flex md:items-center md:justify-between mb-8 animate-fade-in">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                  Tableau de bord
                </h1>
                <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Home className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    Administration
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <ChevronRight className="flex-shrink-0 mx-1 h-4 w-4 text-gray-400" />
                    Tableau de bord
                  </div>
                </div>
              </div>
            </div>

            {/* Cartes de statistiques */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {statCards.map((card, index) => (
                <StatCard 
                  key={card.title}
                  title={card.title} 
                  value={card.value} 
                  icon={card.icon} 
                  iconBgColor={card.color} 
                  iconColor="text-gray-600" 
                  trend="up" 
                  trendValue="+5%" 
                  trendPeriod="ce mois-ci" 
                />
              ))}
            </div>

            {/* Rendez-vous récents */}
            <div className="bg-white shadow rounded-lg mb-8 animate-fade-in animation-delay-300">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Rendez-vous récents
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Liste des derniers rendez-vous planifiés
                </p>
              </div>
              
              {/* Filtres pour les rendez-vous */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Rechercher un patient..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="completed">Terminés</option>
                    <option value="upcoming">À venir</option>
                  </select>
                </div>
                
                <div className="flex justify-end">
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setCurrentPage(1);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Médecin
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Heure
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.recentAppointments
                      // Filtrage par terme de recherche
                      .filter(appointment => 
                        searchTerm === '' || 
                        appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      // Filtrage par statut
                      .filter(appointment => 
                        statusFilter === 'all' || 
                        appointment.status === statusFilter
                      )
                      // Pagination
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .map((appointment) => (
                        <tr key={appointment.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{appointment.patient}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{appointment.doctor}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {appointment.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {appointment.time}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              appointment.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {appointment.status === 'completed' ? 'Terminé' : 'À venir'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button className="text-primary-600 hover:text-primary-900 mr-3 focus:outline-none">Voir</button>
                            <button className="text-primary-600 hover:text-primary-900 focus:outline-none">Modifier</button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              
              {/* Footer avec pagination fonctionnelle */}
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  {/* Pagination mobile */}
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1 ? 'text-gray-400 bg-gray-100' : 'text-gray-700 bg-white hover:bg-gray-50'}`}
                    >
                      Précédent
                    </button>
                    <button 
                      onClick={() => {
                        const filteredAppointments = stats.recentAppointments
                          .filter(appointment => 
                            searchTerm === '' || 
                            appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .filter(appointment => 
                            statusFilter === 'all' || 
                            appointment.status === statusFilter
                          );
                        const maxPage = Math.ceil(filteredAppointments.length / itemsPerPage);
                        setCurrentPage(prev => Math.min(prev + 1, maxPage));
                      }} 
                      disabled={currentPage >= Math.ceil(stats.recentAppointments.filter(appointment => 
                        (searchTerm === '' || 
                        appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase())) &&
                        (statusFilter === 'all' || appointment.status === statusFilter)
                      ).length / itemsPerPage)}
                      className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage >= Math.ceil(stats.recentAppointments.filter(appointment => 
                        (searchTerm === '' || 
                        appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase())) &&
                        (statusFilter === 'all' || appointment.status === statusFilter)
                      ).length / itemsPerPage) ? 'text-gray-400 bg-gray-100' : 'text-gray-700 bg-white hover:bg-gray-50'}`}
                    >
                      Suivant
                    </button>
                  </div>
                  
                  {/* Pagination desktop */}
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      {(() => {
                        const filteredAppointments = stats.recentAppointments
                          .filter(appointment => 
                            searchTerm === '' || 
                            appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .filter(appointment => 
                            statusFilter === 'all' || 
                            appointment.status === statusFilter
                          );
                        
                        const totalItems = filteredAppointments.length;
                        const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
                        const endItem = Math.min(currentPage * itemsPerPage, totalItems);
                        
                        return (
                          <p className="text-sm text-gray-700">
                            Affichage de <span className="font-medium">{startItem}</span> à <span className="font-medium">{endItem}</span> sur <span className="font-medium">{totalItems}</span> résultats
                          </p>
                        );
                      })()} 
                    </div>
                    
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        {/* Bouton précédent */}
                        <button 
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                        >
                          <span className="sr-only">Précédent</span>
                          <ChevronRight className="h-5 w-5 transform rotate-180" />
                        </button>
                        
                        {/* Boutons de page */}
                        {(() => {
                          const filteredAppointments = stats.recentAppointments
                            .filter(appointment => 
                              searchTerm === '' || 
                              appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .filter(appointment => 
                              statusFilter === 'all' || 
                              appointment.status === statusFilter
                            );
                          
                          const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
                          
                          // Générer les boutons de page
                          return Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${currentPage === page ? 'bg-primary-50 text-primary-600' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                            >
                              {page}
                            </button>
                          ));
                        })()}
                        
                        {/* Bouton suivant */}
                        <button 
                          onClick={() => {
                            const filteredAppointments = stats.recentAppointments
                              .filter(appointment => 
                                searchTerm === '' || 
                                appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase())
                              )
                              .filter(appointment => 
                                statusFilter === 'all' || 
                                appointment.status === statusFilter
                              );
                            const maxPage = Math.ceil(filteredAppointments.length / itemsPerPage);
                            setCurrentPage(prev => Math.min(prev + 1, maxPage));
                          }}
                          disabled={currentPage >= Math.ceil(stats.recentAppointments.filter(appointment => 
                            (searchTerm === '' || 
                            appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase())) &&
                            (statusFilter === 'all' || appointment.status === statusFilter)
                          ).length / itemsPerPage)}
                          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 ${currentPage >= Math.ceil(stats.recentAppointments.filter(appointment => 
                            (searchTerm === '' || 
                            appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase())) &&
                            (statusFilter === 'all' || appointment.status === statusFilter)
                          ).length / itemsPerPage) ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                        >
                          <span className="sr-only">Suivant</span>
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );

  // Fonction pour rendre les éléments de navigation
  function renderNavItems(isMobile = false) {
    const navItems = [
      { id: 'dashboard', name: 'Tableau de bord', icon: <BarChart2 size={20} />, path: '/admin/dashboard' },
      { id: 'users', name: 'Utilisateurs', icon: <Users size={20} />, path: '/admin/users' },
      { id: 'doctors', name: 'Médecins', icon: <User size={20} />, path: '/admin/doctors' },
      { id: 'appointments', name: 'Rendez-vous', icon: <Calendar size={20} />, path: '/admin/appointments' },
      { id: 'settings', name: 'Paramètres', icon: <Settings size={20} />, path: '/admin/settings' },
    ];

    const handleNavClick = (itemId, path) => {
      setActiveSection(itemId);
      // Si c'est sur mobile, fermer la sidebar après le clic
      if (isMobile) {
        setSidebarOpen(false);
      }
      // Naviguer vers la page correspondante si ce n'est pas déjà la page actuelle
      if (itemId !== 'dashboard' || path !== '/admin/dashboard') {
        // Pour l'instant, on reste sur la même page car les autres pages n'existent pas encore
        // navigate(path);
        // Afficher un message pour indiquer que la fonctionnalité est en cours de développement
        alert('Cette section est en cours de développement.');
      }
    };

    return navItems.map((item) => (
      <button
        key={item.id}
        onClick={() => handleNavClick(item.id, item.path)}
        className={`
          ${activeSection === item.id 
            ? 'bg-primary-50 text-primary-600' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }
          group flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 w-full text-left
          ${isMobile ? 'text-base' : ''}
        `}
      >
        <span className={`
          ${activeSection === item.id ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'}
          mr-3 flex-shrink-0 h-6 w-6
        `}>
          {item.icon}
        </span>
        {item.name}
      </button>
    ));
  }
};

export default AdminDashboard;
