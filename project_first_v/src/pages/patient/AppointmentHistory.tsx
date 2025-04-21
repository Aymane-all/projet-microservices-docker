import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  ChevronRight, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ClipboardCheck
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { useAppointments } from '../../context/AppointmentContext';
import Button from '../../components/common/Button';
import { Appointment, AppointmentStatus } from '../../types';

const AppointmentHistory: React.FC = () => {
  const { user } = useAuth();
  const { getPatientAppointments, cancelAppointment, isLoading } = useAppointments();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      const fetchAppointments = async () => {
        const fetchedAppointments = await getPatientAppointments(user.id);
        setAppointments(fetchedAppointments);
      };
      
      fetchAppointments();
    }
  }, [user, getPatientAppointments]);

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      setCancellingId(appointmentId);
      await cancelAppointment(appointmentId);
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
    } finally {
      setCancellingId(null);
    }
  };

  const now = new Date();
  
  const upcomingAppointments = appointments.filter(
    apt => ['confirmed', 'pending'].includes(apt.status) && new Date(apt.dateTime) > now
  ).sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  
  const pastAppointments = appointments.filter(
    apt => apt.status === 'completed' || apt.status === 'cancelled' || new Date(apt.dateTime) <= now
  ).sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" />
            Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertCircle size={12} className="mr-1" />
            Pending
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle size={12} className="mr-1" />
            Cancelled
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <ClipboardCheck size={12} className="mr-1" />
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          <p className="mt-2 text-gray-600">View and manage your appointments</p>
        </div>

        <div className="flex mb-6">
          <div className="flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                activeTab === 'upcoming'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Upcoming
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('past')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                activeTab === 'past'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Past
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center my-12">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
          </div>
        ) : activeTab === 'upcoming' ? (
          <>
            {upcomingAppointments.length > 0 ? (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                <ul className="divide-y divide-gray-200">
                  {upcomingAppointments.map((appointment) => (
                    <li key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            {appointment.doctor?.profileImage ? (
                              <img
                                src={appointment.doctor.profileImage}
                                alt={appointment.doctor.name}
                                className="h-16 w-16 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500 text-xl font-medium">
                                  {appointment.doctor?.name?.charAt(0) || 'D'}
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center mb-1">
                              {getStatusBadge(appointment.status)}
                              <span className="mx-1">•</span>
                              <span className="text-sm text-gray-500">
                                {appointment.doctor?.specialty.name}
                              </span>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">{appointment.doctor?.name}</h3>
                            <div className="mt-2 flex flex-wrap gap-4">
                              <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                {format(new Date(appointment.dateTime), 'EEEE, MMMM d, yyyy')}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <Clock className="h-4 w-4 mr-1 text-gray-400" />
                                {format(new Date(appointment.dateTime), 'h:mm a')} - {format(new Date(appointment.endTime), 'h:mm a')}
                              </div>
                            </div>
                            {appointment.reason && (
                              <div className="mt-2 text-sm text-gray-600">
                                <span className="font-medium">Reason:</span> {appointment.reason}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-4 md:mt-0">
                          {appointment.status === 'confirmed' && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                              >
                                Reschedule
                              </Button>
                              <Button 
                                variant="danger" 
                                size="sm"
                                isLoading={cancellingId === appointment.id}
                                onClick={() => handleCancelAppointment(appointment.id)}
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                          {appointment.status === 'pending' && (
                            <Button 
                              variant="danger" 
                              size="sm"
                              isLoading={cancellingId === appointment.id}
                              onClick={() => handleCancelAppointment(appointment.id)}
                            >
                              Cancel Request
                            </Button>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center border border-gray-100">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No upcoming appointments</h3>
                <p className="text-gray-500 mb-4">You don't have any upcoming appointments scheduled.</p>
                <Link to="/patient/doctors">
                  <Button variant="primary">Find a Doctor</Button>
                </Link>
              </div>
            )}
          </>
        ) : (
          <>
            {pastAppointments.length > 0 ? (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                <ul className="divide-y divide-gray-200">
                  {pastAppointments.map((appointment) => (
                    <li key={appointment.id} className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            {appointment.doctor?.profileImage ? (
                              <img
                                src={appointment.doctor.profileImage}
                                alt={appointment.doctor.name}
                                className="h-16 w-16 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500 text-xl font-medium">
                                  {appointment.doctor?.name?.charAt(0) || 'D'}
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center mb-1">
                              {getStatusBadge(appointment.status)}
                              <span className="mx-1">•</span>
                              <span className="text-sm text-gray-500">
                                {appointment.doctor?.specialty.name}
                              </span>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">{appointment.doctor?.name}</h3>
                            <div className="mt-2 flex flex-wrap gap-4">
                              <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                {format(new Date(appointment.dateTime), 'EEEE, MMMM d, yyyy')}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <Clock className="h-4 w-4 mr-1 text-gray-400" />
                                {format(new Date(appointment.dateTime), 'h:mm a')} - {format(new Date(appointment.endTime), 'h:mm a')}
                              </div>
                            </div>
                            {appointment.notes && (
                              <div className="mt-2 text-sm text-gray-600">
                                <span className="font-medium">Notes:</span> {appointment.notes}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-4 md:mt-0">
                          {appointment.status === 'completed' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                            >
                              Book Again
                            </Button>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center border border-gray-100">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No past appointments</h3>
                <p className="text-gray-500 mb-4">You don't have any past appointments to view.</p>
                <Link to="/patient/doctors">
                  <Button variant="primary">Find a Doctor</Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AppointmentHistory;