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
import { Appointment, AppointmentStatus } from '../../types';

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getDoctorAppointments, updateAppointmentStatus, isLoading } = useAppointments();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      const fetchAppointments = async () => {
        const fetchedAppointments = await getDoctorAppointments(user.id);
        setAppointments(fetchedAppointments);
      };
      
      fetchAppointments();
    }
  }, [user, getDoctorAppointments]);

  const handleStatusUpdate = async (appointmentId: string, status: AppointmentStatus) => {
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
  
  const todaysAppointments = appointments.filter(
    apt => 
      apt.status === 'confirmed' && 
      new Date(apt.dateTime).toDateString() === now.toDateString()
  ).sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  
  const pendingAppointments = appointments.filter(
    apt => apt.status === 'pending'
  ).sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  // Calculate statistics
  const stats = {
    total: appointments.length,
    confirmed: appointments.filter(apt => apt.status === 'confirmed').length,
    pending: pendingAppointments.length,
    completed: appointments.filter(apt => apt.status === 'completed').length,
    cancelled: appointments.filter(apt => apt.status === 'cancelled').length,
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back, Dr. {user?.name?.split(' ')[1]}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 h-12 w-12 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Appointments</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 h-12 w-12 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Confirmed</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.confirmed}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 h-12 w-12 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 h-12 w-12 rounded-full flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Appointments */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Today's Appointments</h2>
                <Link to="/doctor/appointments">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center my-8">
                  <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
                </div>
              ) : todaysAppointments.length > 0 ? (
                <div className="space-y-4">
                  {todaysAppointments.map((appointment) => (
                    <div 
                      key={appointment.id} 
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                    >
                      <div className="flex items-center mb-4 sm:mb-0">
                        <div className="mr-4">
                          <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                            <User size={20} />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Patient #{appointment.patientId}</h3>
                          <p className="text-sm text-gray-500">{appointment.reason || 'General Consultation'}</p>
                          <div className="flex items-center mt-1 text-xs text-gray-600">
                            <Clock className="h-3 w-3 mr-1" />
                            {format(new Date(appointment.dateTime), 'h:mm a')} - {format(new Date(appointment.endTime), 'h:mm a')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          icon={<ExternalLink size={14} />}
                        >
                          Details
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="sm"
                          isLoading={updatingId === appointment.id}
                          onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                        >
                          Complete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <Calendar className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No appointments today</h3>
                  <p className="text-gray-500 mb-4">Enjoy your day off or check your upcoming appointments</p>
                  <Link to="/doctor/appointments">
                    <Button variant="primary">View Schedule</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Pending Requests */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Pending Requests</h2>
                <Link to="/doctor/appointments">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center my-8">
                  <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
                </div>
              ) : pendingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {pendingAppointments.slice(0, 3).map((appointment) => (
                    <div 
                      key={appointment.id} 
                      className="p-4 bg-yellow-50 rounded-lg border border-yellow-200"
                    >
                      <div className="flex items-center mb-2">
                        <div className="mr-3">
                          <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                            <User size={18} />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">Patient #{appointment.patientId}</h3>
                          <div className="flex items-center text-xs text-gray-600">
                            <Calendar className="h-3 w-3 mr-1" />
                            {format(new Date(appointment.dateTime), 'MMM d, yyyy')}
                            <span className="mx-1">•</span>
                            <Clock className="h-3 w-3 mr-1" />
                            {format(new Date(appointment.dateTime), 'h:mm a')}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {appointment.reason || 'General consultation'}
                      </p>
                      <div className="flex space-x-2">
                        <Button 
                          variant="primary" 
                          size="sm"
                          isLoading={updatingId === appointment.id}
                          onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                          fullWidth
                        >
                          Accept
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          isLoading={updatingId === appointment.id}
                          onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                          fullWidth
                        >
                          Decline
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <Clock className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No pending requests</h3>
                  <p className="text-gray-500">You're all caught up!</p>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/doctor/availability" 
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-3">
                        <Calendar size={16} />
                      </div>
                      <span>Manage Availability</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/doctor/profile" 
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-3">
                        <User size={16} />
                      </div>
                      <span>Edit Profile</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/doctor/appointments" 
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-3">
                        <BarChart3 size={16} />
                      </div>
                      <span>View Analytics</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;