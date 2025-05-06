import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingScreen from '../common/LoadingScreen';

const ProtectedRoute = ({ children, role }) => {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If role is specified, check if user has the required role
  if (role && user?.role !== role) {
    // Redirect to appropriate dashboard based on role
    if (user?.role === 'patient') {
      return <Navigate to="/patient/dashboard" replace />;
    }
    if (user?.role === 'doctor') {
      return <Navigate to="/doctor/dashboard" replace />;
    }
    // If somehow the user has an invalid role, redirect to login
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
