import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  User, 
  Calendar, 
  LogOut, 
  Home, 
  Phone, 
  Menu as MenuIcon,
  Settings,
  ChevronDown,
  Bell,
  FileText,
  UserCircle,
  BarChart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import AnimatedButton from '../common/AnimatedButton';
import NotificationCenter from '../notifications/NotificationCenter';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (user?.role === 'patient') return '/patient/dashboard';
    if (user?.role === 'doctor') return '/doctor/dashboard';
    return '/';
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-md sticky top-0 z-30 transition-all duration-300 backdrop-blur-sm bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link 
              to="/" 
              className="flex-shrink-0 flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="text-primary-600 text-2xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">MediConnect</span>
            </Link>
          </div>

          <nav className="hidden md:flex md:justify-center md:flex-1 items-center">
            <div className="flex space-x-8 justify-center">
              <Link to="/" className="text-gray-600 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-all duration-300 border-b-2 border-transparent hover:border-primary-500">
                Home
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-all duration-300 border-b-2 border-transparent hover:border-primary-500">
                About
              </Link>
              <Link to="/contact" className="text-gray-600 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-all duration-300 border-b-2 border-transparent hover:border-primary-500">
                Contact
              </Link>
            </div>
          </nav>

          <div className="hidden md:flex md:items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Centre de notifications */}
                <NotificationCenter />
                
                {/* User dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-600 shadow-sm">
                      <User size={16} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user?.name || 'Utilisateur'}</span>
                    <ChevronDown size={16} className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Dropdown menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg overflow-hidden z-50 py-1 border border-gray-200 animate-fadeIn">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      
                      <div className="py-1">
                        <Link 
                          to={getDashboardLink()} 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <BarChart size={16} className="mr-2 text-primary-500" />
                          Tableau de bord
                        </Link>
                        
                        {user?.role === 'patient' && (
                          <>
                            <Link 
                              to="/patient/doctors" 
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              <User size={16} className="mr-2 text-primary-500" />
                              Trouver un médecin
                            </Link>
                            <Link 
                              to="/patient/appointments" 
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              <Calendar size={16} className="mr-2 text-primary-500" />
                              Mes rendez-vous
                            </Link>
                          </>
                        )}
                        
                        {user?.role === 'doctor' && (
                          <>
                            <Link 
                              to="/doctor/appointments" 
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              <Calendar size={16} className="mr-2 text-primary-500" />
                              Rendez-vous
                            </Link>
                            <Link 
                              to="/doctor/availability" 
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              <Calendar size={16} className="mr-2 text-primary-500" />
                              Disponibilités
                            </Link>
                          </>
                        )}
                        
                        <Link 
                          to={user?.role === 'patient' ? '/patient/profile' : '/doctor/profile'} 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <UserCircle size={16} className="mr-2 text-primary-500" />
                          Mon profil
                        </Link>
                      </div>
                      
                      <div className="py-1 border-t border-gray-100">
                        <button 
                          onClick={() => {
                            handleLogout();
                            setIsDropdownOpen(false);
                          }}
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <LogOut size={16} className="mr-2 text-red-500" />
                          Déconnexion
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <AnimatedButton variant="outline" size="sm">Connexion</AnimatedButton>
                </Link>
                <Link to="/register">
                  <AnimatedButton variant="primary" size="sm">Inscription</AnimatedButton>
                </Link>
              </div>
            )}
          </div>
          
          <div className="-mr-2 flex items-center md:hidden">
            {isAuthenticated ? (
              <div className="flex items-center mr-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-600 shadow-sm">
                  <User size={16} />
                </div>
              </div>
            ) : null}
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-primary-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="pt-2 pb-3 space-y-1 border-t border-gray-200">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2 text-base font-medium text-gray-600 hover:text-primary-500 hover:bg-gray-50">
            <Home size={20} className="mr-2" />
            Accueil
          </Link>
          <Link to="/about" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2 text-base font-medium text-gray-600 hover:text-primary-500 hover:bg-gray-50">
            <User size={20} className="mr-2" />
            À propos
          </Link>
          <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2 text-base font-medium text-gray-600 hover:text-primary-500 hover:bg-gray-50">
            <Phone size={20} className="mr-2" />
            Contact
          </Link>
          
          {isAuthenticated ? (
            <>
              <div className="py-2 px-4 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Mon compte</p>
              </div>
              
              <Link to={getDashboardLink()} onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2 text-base font-medium text-gray-600 hover:text-primary-500 hover:bg-gray-50">
                <BarChart size={20} className="mr-2" />
                Tableau de bord
              </Link>

              {user?.role === 'patient' && (
                <>
                  <Link to="/patient/doctors" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2 text-base font-medium text-gray-600 hover:text-primary-500 hover:bg-gray-50">
                    <User size={20} className="mr-2" />
                    Trouver un médecin
                  </Link>
                  <Link to="/patient/appointments" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2 text-base font-medium text-gray-600 hover:text-primary-500 hover:bg-gray-50">
                    <Calendar size={20} className="mr-2" />
                    Mes rendez-vous
                  </Link>
                </>
              )}

              {user?.role === 'doctor' && (
                <>
                  <Link to="/doctor/appointments" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2 text-base font-medium text-gray-600 hover:text-primary-500 hover:bg-gray-50">
                    <Calendar size={20} className="mr-2" />
                    Rendez-vous
                  </Link>
                  <Link to="/doctor/availability" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2 text-base font-medium text-gray-600 hover:text-primary-500 hover:bg-gray-50">
                    <Calendar size={20} className="mr-2" />
                    Disponibilités
                  </Link>
                </>
              )}
              
              <Link to={user?.role === 'patient' ? '/patient/profile' : '/doctor/profile'} onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2 text-base font-medium text-gray-600 hover:text-primary-500 hover:bg-gray-50">
                <UserCircle size={20} className="mr-2" />
                Mon profil
              </Link>

              <div className="border-t border-gray-200 mt-2 pt-2">
                <button onClick={handleLogout} className="flex w-full items-center px-4 py-2 text-base font-medium text-red-500 hover:text-red-700 hover:bg-red-50">
                  <LogOut size={20} className="mr-2" />
                  Déconnexion
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="py-2 px-4 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Compte</p>
              </div>
              
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2 text-base font-medium text-gray-600 hover:text-primary-500 hover:bg-gray-50">
                <User size={20} className="mr-2" />
                Connexion
              </Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2 text-base font-medium text-gray-600 hover:text-primary-500 hover:bg-gray-50">
                <User size={20} className="mr-2" />
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;