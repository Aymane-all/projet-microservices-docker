import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  ChevronRight,
  Users,
  BarChart3,
  User,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { useAppointments } from '../../context/AppointmentContext';
import Button from '../../components/common/Button';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const { getDoctorAppointments, updateAppointmentStatus, isLoading } = useAppointments();
  const [appointments, setAppointments] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (user?.id) {
      const fetchAppointments = async () => {
        const fetchedAppointments = await getDoctorAppointments(user.id);
        setAppointments(fetchedAppointments);
      };
      fetchAppointments();
    }
  }, [user, getDoctorAppointments]);

  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      setUpdatingId(appointmentId);
      await updateAppointmentStatus(appointmentId, status);
    } catch (error) {
      console.error('Failed to update appointment status:', error);
    } finally {
      setUpdatingId(null);
    }
  };

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

  const stats = {
    total: appointments.length,
    confirmed: appointments.filter(apt => apt.status === 'confirmed').length,
    pending: pendingAppointments.length,
    completed: appointments.filter(apt => apt.status === 'completed').length,
    cancelled: appointments.filter(apt => apt.status === 'cancelled').length
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ...render as in original code, unchanged JSX structure... */}
    </div>
  );
};

export default DoctorDashboard;
