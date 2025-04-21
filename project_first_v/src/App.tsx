import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { AppointmentProvider } from './context/AppointmentContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import PatientDashboard from './pages/patient/PatientDashboard';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorSearch from './pages/patient/DoctorSearch';
import AppointmentBooking from './pages/patient/AppointmentBooking';
import AppointmentHistory from './pages/patient/AppointmentHistory';
import DoctorProfile from './pages/doctor/DoctorProfile';
import DoctorAvailability from './pages/doctor/DoctorAvailability';
import ProtectedRoute from './components/auth/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <AppointmentProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Patient Routes */}
                <Route 
                  path="/patient/dashboard" 
                  element={
                    <ProtectedRoute role="patient">
                      <PatientDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/patient/doctors" 
                  element={
                    <ProtectedRoute role="patient">
                      <DoctorSearch />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/patient/book/:doctorId" 
                  element={
                    <ProtectedRoute role="patient">
                      <AppointmentBooking />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/patient/appointments" 
                  element={
                    <ProtectedRoute role="patient">
                      <AppointmentHistory />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Doctor Routes */}
                <Route 
                  path="/doctor/dashboard" 
                  element={
                    <ProtectedRoute role="doctor">
                      <DoctorDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/doctor/profile" 
                  element={
                    <ProtectedRoute role="doctor">
                      <DoctorProfile />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/doctor/availability" 
                  element={
                    <ProtectedRoute role="doctor">
                      <DoctorAvailability />
                    </ProtectedRoute>
                  } 
                />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 5000,
                style: {
                  background: '#fff',
                  color: '#333',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                  padding: '16px',
                }
              }}
            />
          </div>
        </Router>
      </AppointmentProvider>
    </AuthProvider>
  );
}

export default App;