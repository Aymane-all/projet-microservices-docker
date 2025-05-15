import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, registerUser, getCurrentUser } from '../api/auth'; // Adjust path if needed

// Create AuthContext
const AuthContext = createContext({
  user: null,
  isLoading: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
  token: null,
});

// Export useAuth hook
export const useAuth = () => useContext(AuthContext);

// Export AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        // Only attempt to get current user if we have a token
        if (token) {
          const userData = await getCurrentUser();
          if (userData) {
            setUser(userData);
          } else {
            // If getCurrentUser returns no data despite having a token,
            // the token might be invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to authenticate user:', error);
        // Clear invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [token]);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const userData = await loginUser(email, password);
      // Update token state with what was saved in localStorage by loginUser
      setToken(localStorage.getItem('token'));
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      // Extrait le mot de passe de userData pour le passer séparément à registerUser
      const { password, ...userInfo } = userData;
      const newUser = await registerUser(userInfo, password);
      // Update token state with what was saved in localStorage by registerUser
      setToken(localStorage.getItem('token'));
      setUser(newUser);
      return newUser;
    } catch (error) {
      console.error('AuthContext: Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;