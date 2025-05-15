import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppointmentProvider } from './context/AppointmentContext';
import { NotificationProvider } from './context/NotificationContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PageTransition from './components/common/PageTransition';
import Notification from './components/common/Notification';
import HomePage from './pages/home about contact/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import PatientDashboard from './pages/patient/PatientDashboard';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorSearch from './pages/patient/DoctorSearch';
import AppointmentBooking from './pages/patient/AppointmentBooking';
import AppointmentHistory from './pages/patient/AppointmentHistory';
import DoctorProfile from './pages/doctor/DoctorProfile';
import DoctorAvailability from './pages/doctor/DoctorAvailability';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage';
import AboutPage from './pages/home about contact/About';
import ContactPage from './pages/home about contact/Contact';

// Composant pour faire défiler vers le haut lors des changements de page
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppointmentProvider>
          <Router>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow">
              <PageTransition transitionType="fade">
                <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                
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
                
                {/* Admin Routes */}
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <ProtectedRoute role="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              </PageTransition>
            </main>
            <Footer />
            <Notification 
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#fff',
                  color: '#333',
                },
              }}
            />
          </div>
          </Router>
        </AppointmentProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
