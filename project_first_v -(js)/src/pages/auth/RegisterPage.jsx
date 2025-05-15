import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AnimatedButton from '../../components/common/AnimatedButton';
import { UserPlus, Mail, Lock, User, AlertCircle, CheckCircle, Eye, EyeOff, Shield } from 'lucide-react';
import { showNotification, NOTIFICATION_TYPES } from '../../components/common/Notification';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient', // On garde le rôle par défaut mais on ne l'affiche plus
  });
  const [errors, setErrors] = useState({});
  const [animateForm, setAnimateForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0); // 0: aucun, 1: faible, 2: moyen, 3: fort
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  // Animation à l'entrée de la page
  useEffect(() => {
    setAnimateForm(true);
  }, []);
  
  // Évaluer la force du mot de passe
  useEffect(() => {
    if (!formData.password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    
    // Longueur minimale
    if (formData.password.length >= 6) strength += 1;
    
    // Complexité (chiffres, lettres, caractères spéciaux)
    if (/[0-9]/.test(formData.password)) strength += 1;
    if (/[a-zA-Z]/.test(formData.password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(formData.password)) strength += 1;
    
    setPasswordStrength(Math.min(3, strength));
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email est invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Préparation des données utilisateur pour l'inscription
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        passwordConfirmation: formData.confirmPassword,
        role: formData.role
      };

      // Appel à la fonction register du contexte d'authentification
      const user = await register(userData);

      showNotification('Inscription réussie ! Bienvenue sur MediConnect.', NOTIFICATION_TYPES.SUCCESS);

      // Rediriger vers le dashboard approprié selon le rôle
      if (user.role === 'doctor') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/patient/dashboard');
      }
    } catch (error) {
      console.error('RegisterPage: Error:', error);
      const errorMsg = error instanceof Error ? error.message : 'L\'inscription a échoué';
      showNotification(errorMsg, NOTIFICATION_TYPES.ERROR);
      setErrors(prev => ({ ...prev, form: errorMsg }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className={`sm:mx-auto sm:w-full sm:max-w-md transition-all duration-700 transform ${animateForm ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary-100 mb-6 transition-all duration-500 transform hover:scale-110">
            <UserPlus className="h-10 w-10 text-primary-600" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900 transition-all duration-500 delay-100">
          Créer votre compte
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 transition-all duration-500 delay-200">
          Ou{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 hover:underline transition-colors duration-300">
            connectez-vous à votre compte existant
          </Link>
        </p>
      </div>

      <div className={`mt-8 sm:mx-auto sm:w-full sm:max-w-md transition-all duration-700 delay-300 transform ${animateForm ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="bg-white py-8 px-6 shadow-xl sm:rounded-xl sm:px-10 transition-all duration-300 hover:shadow-2xl">

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-6 transition-all duration-500 transform">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nom complet
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all duration-300"
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
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
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all duration-300"
                    placeholder="vous@exemple.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
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
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all duration-300"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.password}
                  </p>
                )}
                
                {/* Indicateur de force du mot de passe */}
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-gray-500 flex items-center">
                      <Shield className="h-3 w-3 mr-1" />
                      Force du mot de passe: 
                      <span className={`ml-1 font-medium ${passwordStrength === 0 ? 'text-gray-400' : passwordStrength === 1 ? 'text-red-500' : passwordStrength === 2 ? 'text-yellow-500' : 'text-green-500'}`}>
                        {passwordStrength === 0 ? 'Aucun' : passwordStrength === 1 ? 'Faible' : passwordStrength === 2 ? 'Moyen' : 'Fort'}
                      </span>
                    </p>
                  </div>
                  <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${passwordStrength === 0 ? 'w-0' : passwordStrength === 1 ? 'w-1/3 bg-red-500' : passwordStrength === 2 ? 'w-2/3 bg-yellow-500' : 'w-full bg-green-500'} transition-all duration-300`}
                    ></div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Le mot de passe doit contenir au moins 6 caractères</p>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmer le mot de passe
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all duration-300"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.confirmPassword}
                  </p>
                )}
                
                {/* Indicateur de correspondance des mots de passe */}
                {formData.password && formData.confirmPassword && (
                  <div className="mt-1 flex items-center">
                    {formData.password === formData.confirmPassword ? (
                      <p className="text-xs text-green-600 flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Les mots de passe correspondent
                      </p>
                    ) : (
                      <p className="text-xs text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Les mots de passe ne correspondent pas
                      </p>
                    )}
                  </div>
                )}
              </div>

              {errors.form && (
                <div className="flex items-center p-4 text-red-800 rounded-lg bg-red-50 transition-all duration-300 animate-pulse" role="alert">
                  <AlertCircle className="flex-shrink-0 w-5 h-5 mr-2" />
                  <span className="sr-only">Erreur</span>
                  <div className="text-sm font-medium">
                    {errors.form}
                  </div>
                </div>
              )}

              <div className="pt-4">
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
                      Inscription en cours...
                    </>
                  ) : (
                    <>
                      <UserPlus size={20} className="mr-2" />
                      S'inscrire
                    </>
                  )}
                </AnimatedButton>
              </div>
            </div>
          </form>

          <div className="mt-6">
            <p className="text-xs text-center text-gray-500">
              En vous inscrivant, vous acceptez nos{' '}
              <a href="#" className="font-medium text-primary-600 hover:text-primary-500 hover:underline transition-colors duration-300">
                Conditions d'utilisation
              </a>{' '}
              et{' '}
              <a href="#" className="font-medium text-primary-600 hover:text-primary-500 hover:underline transition-colors duration-300">
                Politique de confidentialité
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;