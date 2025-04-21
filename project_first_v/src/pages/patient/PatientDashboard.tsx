import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  ChevronRight, 
  Activity, 
  Search, 
  AlertCircle,
  CheckCircle 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppointments } from '../../context/AppointmentContext';
import Button from '../../components/common/Button';
import { Appointment } from '../../types';
import { format } from 'date-fns';

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getPatientAppointments, isLoading } = useAppointments();
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [pendingAppointments, setPendingAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (user?.id) {
      const fetchAppointments = async () => {
        const appointments = await getPatientAppointments(user.id);
        
        // Filter upcoming appointments (confirmed and in the future)
        const now = new Date();
        const upcoming = appointments.filter(
          apt => apt.status === 'confirmed' && new Date(apt.dateTime) > now
        ).sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
        
        // Filter pending appointments
        const pending = appointments.filter(apt => apt.status === 'pending')
          .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
        
        setUpcomingAppointments(upcoming);
        setPendingAppointments(pending);
      };
      
      fetchAppointments();
    }
  }, [user, getPatientAppointments]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back, {user?.name}!</p>
        </div>

        {/* Quick Actions */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/patient/doctors" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Search className="h-5 w-5 text-primary-500" />
                    <h3 className="text-lg font-medium text-gray-900">Find a Doctor</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Search by specialty, name, or availability</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </Link>
            <Link to="/patient/appointments" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-5 w-5 text-primary-500" />
                    <h3 className="text-lg font-medium text-gray-900">My Appointments</h3>
                  </div>
                  <p className="text-gray-600 text-sm">View and manage your appointments</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </Link>
            <Link to="#" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="h-5 w-5 text-primary-500" />
                    <h3 className="text-lg font-medium text-gray-900">Health Records</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Access your medical history and reports</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </Link>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Upcoming Appointments */}
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Upcoming Appointments</h2>
                <Link to="/patient/appointments">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center my-8">
                  <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
                </div>
              ) : upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.slice(0, 3).map((appointment) => (
                    <div 
                      key={appointment.id} 
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-0">
                        <div className="mr-4 mb-3 sm:mb-0">
                          {appointment.doctor?.profileImage ? (
                            <img 
                              src={appointment.doctor.profileImage} 
                              alt={appointment.doctor.name} 
                              className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                          ) : (
                            <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                              <span className="text-lg font-medium">
                                {appointment.doctor?.name?.charAt(0) || '?'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-success-500 mr-1" />
                            <span className="text-xs font-medium text-success-600">Confirmed</span>
                          </div>
                          <h3 className="text-lg font-medium text-gray-900">{appointment.doctor?.name}</h3>
                          <p className="text-sm text-gray-500">{appointment.doctor?.specialty.name}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <div className="flex items-center text-xs text-gray-600">
                              <Calendar className="h-3 w-3 mr-1" />
                              {format(new Date(appointment.dateTime), 'MMMM d, yyyy')}
                            </div>
                            <div className="flex items-center text-xs text-gray-600">
                              <Clock className="h-3 w-3 mr-1" />
                              {format(new Date(appointment.dateTime), 'h:mm a')}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">Reschedule</Button>
                        <Button variant="danger" size="sm">Cancel</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <Calendar className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No upcoming appointments</h3>
                  <p className="text-gray-500 mb-4">Schedule your next visit with a doctor</p>
                  <Link to="/patient/doctors">
                    <Button variant="primary">Find a Doctor</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Notifications and Pending Appointments */}
          <div className="space-y-6">
            {/* Pending Appointments */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Approvals</h2>
              
              {isLoading ? (
                <div className="flex justify-center my-4">
                  <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
                </div>
              ) : pendingAppointments.length > 0 ? (
                <div className="space-y-3">
                  {pendingAppointments.map((appointment) => (
                    <div 
                      key={appointment.id} 
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center mb-2">
                        <AlertCircle className="h-4 w-4 text-warning-500 mr-1" />
                        <span className="text-xs font-medium text-warning-600">Awaiting confirmation</span>
                      </div>
                      <h3 className="font-medium text-gray-900">
                        {appointment.doctor?.name}
                      </h3>
                      <div className="flex items-center text-xs text-gray-600 mb-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(appointment.dateTime), 'MMMM d, yyyy')}
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <Clock className="h-3 w-3 mr-1" />
                        {format(new Date(appointment.dateTime), 'h:mm a')}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm py-2">No pending appointments</p>
              )}
            </div>

            {/* Notifications */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Notifications</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-primary-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">Your appointment with Dr. Jane Smith is tomorrow at 10:00 AM</p>
                    <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-success-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">Your appointment with Dr. Michael Johnson has been confirmed</p>
                    <p className="text-xs text-gray-500 mt-1">Yesterday</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;