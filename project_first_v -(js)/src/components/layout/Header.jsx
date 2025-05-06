import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, Calendar, LogOut, Home, Menu as MenuIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const getHomeLink = () => {
    if (!isAuthenticated) return '/';
    if (user?.role === 'patient') return '/patient/dashboard';
    if (user?.role === 'doctor') return '/doctor/dashboard';
    return '/';
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link 
              to={getHomeLink()} 
              className="flex-shrink-0 flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="text-primary-500 text-2xl font-bold">MediConnect</span>
            </Link>
          </div>

          <nav className="hidden md:ml-6 md:flex md:space-x-8 items-center">
            {isAuthenticated ? (
              <>
                <Link to={getHomeLink()} className="text-gray-600 hover:text-primary-500 px-3 py-2 text-sm font-medium">
                  Dashboard
                </Link>

                {user?.role === 'patient' && (
                  <>
                    <Link to="/patient/doctors" className="text-gray-600 hover:text-primary-500 px-3 py-2 text-sm font-medium">
                      Find Doctors
                    </Link>
                    <Link to="/patient/appointments" className="text-gray-600 hover:text-primary-500 px-3 py-2 text-sm font-medium">
                      My Appointments
                    </Link>
                  </>
                )}

                {user?.role === 'doctor' && (
                  <>
                    <Link to="/doctor/appointments" className="text-gray-600 hover:text-primary-500 px-3 py-2 text-sm font-medium">
                      Appointments
                    </Link>
                    <Link to="/doctor/availability" className="text-gray-600 hover:text-primary-500 px-3 py-2 text-sm font-medium">
                      Availability
                    </Link>
                    <Link to="/doctor/profile" className="text-gray-600 hover:text-primary-500 px-3 py-2 text-sm font-medium">
                      Profile
                    </Link>
                  </>
                )}

                <div className="flex items-center ml-4">
                  {user?.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt={user.name} 
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                      <User size={16} />
                    </div>
                  )}
                  <span className="ml-2 text-sm text-gray-700">{user?.name}</span>
                  <button 
                    onClick={handleLogout}
                    className="ml-4 text-gray-600 hover:text-primary-500"
                    aria-label="Log out"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/" className="text-gray-600 hover:text-primary-500 px-3 py-2 text-sm font-medium">
                  Home
                </Link>
                <Link to="/login" className="text-gray-600 hover:text-primary-500 px-3 py-2 text-sm font-medium">
                  Login
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Register</Button>
                </Link>
              </>
            )}
          </nav>

          <div className="md:hidden flex items-center">
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
          {isAuthenticated ? (
            <>
              <Link to={getHomeLink()} onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2 text-base font-medium text-gray-600 hover:text-primary-500 hover:bg-gray-50">
                <Home size={20} className="mr-2" />
                Dashboard
              </Link>

              {user?.role === 'patient' && (
                <>
                  <Link to="/patient/doctors" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2 text-base font-medium text-gray-600 hover:text-primary-500 hover:bg-gray-50">
                    <User size={20} className="mr-2" />
                    Find Doctors
                  </Link>
                  <Link to="/patient/appointments" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2 text-base font-medium text-gray-600 hover:text-primary-500 hover:bg-gray-50">
                    <Calendar size={20} className="mr-2" />
                    My Appointments
                  </Link>
                </>
              )}

              {user?.role === 'doctor' && (
                <>
                  <Link to="/doctor/appointments" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2 text-base font-medium text-gray-600 hover:text-primary-500 hover:bg-gray-50">
                    <Calendar size={20} className="mr-2" />
                    Appointments
                  </Link>
                  <Link to="/doctor/availability" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2 text-base font-medium text-gray-600 hover:text-primary-500 hover:bg-gray-50">
                    <Calendar size={20} className="mr-2" />
                    Availability
                  </Link>
                  <Link to="/doctor/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2 text-base font-medium text-gray-600 hover:text-primary-500 hover:bg-gray-50">
                    <User size={20} className="mr-2" />
                    Profile
                  </Link>
                </>
              )}

              <button onClick={handleLogout} className="flex w-full items-center px-4 py-2 text-base font-medium text-gray-600 hover:text-primary-500 hover:bg-gray-50">
                <LogOut size={20} className="mr-2" />
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2 text-base font-medium text-gray-600 hover:text-primary-500 hover:bg-gray-50">
                <Home size={20} className="mr-2" />
                Home
              </Link>
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2 text-base font-medium text-gray-600 hover:text-primary-500 hover:bg-gray-50">
                <User size={20} className="mr-2" />
                Login
              </Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2 text-base font-medium text-gray-600 hover:text-primary-500 hover:bg-gray-50">
                <User size={20} className="mr-2" />
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
