import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Clock,
  ArrowLeft,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { format, addDays, subDays, isSameDay, parseISO } from 'date-fns';
import { getDoctorById, getAvailableTimeSlots } from '../../api/doctors';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useAppointments } from '../../context/AppointmentContext';
import toast from 'react-hot-toast';

const AppointmentBooking = () => {
  const { doctorId } = useParams();
  const { user } = useAuth();
  const { createAppointment, isLoading: isCreatingAppointment } = useAppointments();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState(1);

  const nextSevenDays = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  useEffect(() => {
    const fetchDoctorData = async () => {
      if (!doctorId) return;

      try {
        setIsLoading(true);
        const doctorData = await getDoctorById(doctorId);
        if (doctorData) {
          setDoctor(doctorData);
          const slots = await getAvailableTimeSlots(doctorId, selectedDate);
          // Filter slots to match selected date
          const filteredSlots = slots.filter((slot) => {
            const slotDate = parseISO(slot.start_time);
            return isSameDay(slotDate, selectedDate);
          });
          setTimeSlots(filteredSlots);
        } else {
          toast.error('Doctor not found');
        }
      } catch (error) {
        console.error('Error fetching doctor data:', error);
        toast.error('Failed to load doctor details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctorData();
  }, [doctorId, selectedDate]);

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);

    if (!doctorId) return;

    try {
      setIsLoading(true);
      const slots = await getAvailableTimeSlots(doctorId, date);
      // Filter slots to match selected date
      const filteredSlots = slots.filter((slot) => {
        const slotDate = parseISO(slot.start_time);
        return isSameDay(slotDate, date);
      });
      setTimeSlots(filteredSlots);
    } catch (error) {
      console.error('Error fetching time slots:', error);
      toast.error('Failed to load available time slots');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevDate = () => {
    const prevDate = subDays(selectedDate, 1);
    if (prevDate >= new Date()) {
      handleDateChange(prevDate);
    }
  };

  const handleNextDate = () => {
    handleDateChange(addDays(selectedDate, 1));
  };

  const handleTimeSlotSelection = (timeSlot) => {
    if (timeSlot.is_available) {
      setSelectedTimeSlot(timeSlot);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!doctor || !selectedTimeSlot) {
      toast.error('Please select a time slot');
      return;
    }

    if (!user) {
      toast.error('Please log in to book an appointment');
      navigate('/login'); // Redirect to login page
      return;
    }

    try {
      const appointmentData = {
        doctor_id: doctor.id,
        patient_id: user.id,
        date: selectedDate.toISOString(), // e.g., "2025-05-12T00:00:00.000Z"
        start_time: selectedTimeSlot.start_time, // e.g., "2025-05-12T09:00:00.000000Z"
        end_time: selectedTimeSlot.end_time, // e.g., "2025-05-12T09:30:00.000000Z"
        notes: reason || 'General consultation',
      };

      await createAppointment(appointmentData);
      toast.success('Appointment booked successfully!');
      navigate('/patient/appointments');
    } catch (error) {
      console.error('Error booking appointment:', error);
      // Error is handled by createAppointment with toast
    }
  };

  if (isLoading && !doctor) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-3 inline-flex items-center justify-center p-2 rounded-full bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Book Appointment</h1>
            <p className="mt-1 text-gray-600">Schedule a consultation with {doctor?.name || 'Doctor'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
          <div className="flex flex-col md:flex-row p-6 border-b border-gray-200">
            <div className="flex-shrink-0 mb-4 md:mb-0 mr-6">
              <img
                src={
                  doctor?.profile_image ||
                  'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
                }
                alt={doctor?.name || 'Doctor'}
                className="w-24 h-24 object-cover rounded-full border-2 border-white shadow"
              />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{doctor?.name || 'Unknown Doctor'}</h2>
              <p className="text-primary-600 font-medium">{doctor?.specialty?.name || 'Unknown'}</p>
              <div className="flex items-center mt-1 text-gray-600">
                <span className="flex items-center">
                  <CheckCircle size={16} className="text-success-500 mr-1" />
                  <span>Verified</span>
                </span>
                <span className="mx-2">•</span>
                <span className="flex items-center">
                  <CalendarIcon size={16} className="mr-1" />
                  <span>{doctor?.experience ? `${doctor.experience} years experience` : 'N/A'}</span>
                </span>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-lg font-semibold text-gray-900">
                  <span>${doctor?.consultation_fee || 'N/A'}</span>
                  <span className="ml-2 text-sm font-normal text-gray-500">per consultation</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex mb-8">
              <div className="flex-1">
                <div className={`h-2 rounded-l-full ${step >= 1 ? 'bg-primary-500' : 'bg-gray-200'}`}></div>
                <div className="mt-2 text-center text-sm font-medium text-gray-600">
                  Select Date & Time
                </div>
              </div>
              <div className="flex-1">
                <div className={`h-2 ${step >= 2 ? 'bg-primary-500' : 'bg-gray-200'}`}></div>
                <div className="mt-2 text-center text-sm font-medium text-gray-600">
                  Appointment Details
                </div>
              </div>
              <div className="flex-1">
                <div className={`h-2 rounded-r-full ${step >= 3 ? 'bg-primary-500' : 'bg-gray-200'}`}></div>
                <div className="mt-2 text-center text-sm font-medium text-gray-600">
                  Confirmation
                </div>
              </div>
            </div>

            {step === 1 && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Select Date and Time</h3>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                  <div className="relative flex bg-white rounded-lg border border-gray-200 p-1 overflow-x-auto">
                    <button
                      onClick={handlePrevDate}
                      className="flex-shrink-0 p-2 rounded-full hover:bg-gray-100"
                      aria-label="Previous date"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
                      {nextSevenDays.map((date, index) => (
                        <button
                          key={index}
                          onClick={() => handleDateChange(date)}
                          className={`flex-shrink-0 flex flex-col items-center justify-center p-2 rounded-md transition-colors ${
                            isSameDay(date, selectedDate)
                              ? 'bg-primary-500 text-white'
                              : 'hover:bg-primary-100 text-gray-800'
                          }`}
                        >
                          <span className="text-sm">{format(date, 'EEE')}</span>
                          <span className="text-base font-semibold">{format(date, 'dd')}</span>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleNextDate}
                      className="flex-shrink-0 p-2 rounded-full hover:bg-gray-100"
                      aria-label="Next date"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {timeSlots.length > 0 ? (
                    timeSlots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => handleTimeSlotSelection(slot)}
                         disabled={!slot.is_available}
                        className={`flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium ${
                          !slot.is_available
                            ? 'bg-gray-300 cursor-not-allowed'
                            : selectedTimeSlot?.id === slot.id
                            ? 'bg-primary-600 text-white'
                            : 'bg-primary-500 text-white hover:bg-primary-400'
                        }`}
                      >
                        <Clock size={16} className="mr-2" />
                        {format(parseISO(slot.start_time), 'hh:mm a')}
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-500 col-span-2">No available time slots for this date.</p>
                  )}
                </div>
                <div className="mt-6 flex justify-end">
                  <Button onClick={() => setStep(2)} disabled={!selectedTimeSlot}>
                    Next
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Appointment Details</h3>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Visit</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    rows={4}
                    placeholder="Please describe the reason for your visit"
                  />
                </div>
                <div className="mt-6 flex justify-end">
                  <Button onClick={() => setStep(1)} variant="outline">
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="ml-3"
                    disabled={isCreatingAppointment || isLoading}
                  >
                    {isCreatingAppointment || isLoading ? 'Submitting...' : 'Submit Appointment'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;