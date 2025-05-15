import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AnimatedButton from '../../components/common/AnimatedButton';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import { showNotification, NOTIFICATION_TYPES } from '../../components/common/Notification';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [animateForm, setAnimateForm] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  // Animation à l'entrée de la page
  useEffect(() => {
    setAnimateForm(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const user = await login(email, password);
      if (!user || !user.role) {
        throw new Error('User data or role is missing');
      }
      
      showNotification('Connexion réussie !', NOTIFICATION_TYPES.SUCCESS);
      
      // Rediriger vers le dashboard approprié selon le rôle
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'doctor') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/patient/dashboard');
      }
    } catch (error) {
      console.error('LoginPage: Error:', error);
      const errorMsg = error.message || 'Une erreur est survenue lors de la connexion';
      setErrorMessage(errorMsg);
      showNotification(errorMsg, NOTIFICATION_TYPES.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className={`sm:mx-auto sm:w-full sm:max-w-md transition-all duration-700 transform ${animateForm ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary-100 mb-6 transition-all duration-500 transform hover:scale-110">
            <LogIn className="h-10 w-10 text-primary-600" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900 transition-all duration-500 delay-100">
          Connexion à votre compte
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 transition-all duration-500 delay-200">
          Ou{' '}
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500 hover:underline transition-colors duration-300">
            créer un nouveau compte
          </Link>
        </p>
      </div>

      <div className={`mt-8 sm:mx-auto sm:w-full sm:max-w-md transition-all duration-700 delay-300 transform ${animateForm ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="bg-white py-8 px-6 shadow-xl sm:rounded-xl sm:px-10 transition-all duration-300 hover:shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="transition-all duration-500 delay-400">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all duration-300"
                  placeholder="vous@exemple.com"
                />
              </div>
            </div>

            <div className="transition-all duration-500 delay-500">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all duration-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between transition-all duration-500 delay-600">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition-colors duration-200"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Se souvenir de moi
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500 hover:underline transition-colors duration-300">
                  Mot de passe oublié ?
                </a>
              </div>
            </div>

            {errorMessage && (
              <div className="flex items-center p-4 text-red-800 rounded-lg bg-red-50 transition-all duration-300 animate-pulse" role="alert">
                <AlertCircle className="flex-shrink-0 w-5 h-5 mr-2" />
                <span className="sr-only">Erreur</span>
                <div className="text-sm font-medium">
                  {errorMessage}
                </div>
              </div>
            )}

            <div className="pt-2 transition-all duration-500 delay-700">
              <AnimatedButton
                type="submit"
                variant="primary"
                fullWidth
                disabled={isLoading}
                className="py-3 text-base font-medium"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    <LogIn size={20} className="mr-2" />
                    Se connecter
                  </>
                )}
              </AnimatedButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;