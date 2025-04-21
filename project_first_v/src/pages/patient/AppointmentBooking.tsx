import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ArrowLeft, 
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { format, addDays, subDays, isSameDay } from 'date-fns';
import { getDoctorById, getAvailableTimeSlots } from '../../api/doctors';
import { Doctor, TimeSlot } from '../../types';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useAppointments } from '../../context/AppointmentContext';
import toast from 'react-hot-toast';

const AppointmentBooking: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const { user } = useAuth();
  const { createAppointment, isLoading: isCreatingAppointment } = useAppointments();
  const navigate = useNavigate();
  
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState(1);

  // Generate the next 7 days for the date picker
  const nextSevenDays = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  // Fetch doctor details and available time slots
  useEffect(() => {
    const fetchDoctorData = async () => {
      if (!doctorId) return;
      
      try {
        setIsLoading(true);
        const doctorData = await getDoctorById(doctorId);
        if (doctorData) {
          setDoctor(doctorData);
          const slots = await getAvailableTimeSlots(doctorId, selectedDate);
          setTimeSlots(slots);
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

  // Change date and fetch new time slots
  const handleDateChange = async (date: Date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
    
    if (!doctorId) return;
    
    try {
      setIsLoading(true);
      const slots = await getAvailableTimeSlots(doctorId, date);
      setTimeSlots(slots);
    } catch (error) {
      console.error('Error fetching time slots:', error);
      toast.error('Failed to load available time slots');
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate to previous date
  const handlePrevDate = () => {
    const prevDate = subDays(selectedDate, 1);
    if (prevDate >= new Date()) {
      handleDateChange(prevDate);
    }
  };

  // Navigate to next date
  const handleNextDate = () => {
    handleDateChange(addDays(selectedDate, 1));
  };

  // Handle time slot selection
  const handleTimeSlotSelection = (timeSlot: TimeSlot) => {
    if (!timeSlot.isBooked) {
      setSelectedTimeSlot(timeSlot);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!doctor || !selectedTimeSlot || !user) {
      toast.error('Please select a time slot');
      return;
    }
    
    try {
      await createAppointment({
        doctorId: doctor.id,
        patientId: user.id,
        dateTime: selectedTimeSlot.startTime,
        endTime: selectedTimeSlot.endTime,
        reason: reason,
        doctor: doctor
      });
      
      toast.success('Appointment request submitted successfully!');
      navigate('/patient/appointments');
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Failed to book appointment');
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
            <p className="mt-1 text-gray-600">Schedule a consultation with {doctor?.name}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
          {/* Doctor information header */}
          <div className="flex flex-col md:flex-row p-6 border-b border-gray-200">
            <div className="flex-shrink-0 mb-4 md:mb-0 mr-6">
              <img 
                src={doctor?.profileImage || 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'} 
                alt={doctor?.name}
                className="w-24 h-24 object-cover rounded-full border-2 border-white shadow"
              />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{doctor?.name}</h2>
              <p className="text-primary-600 font-medium">{doctor?.specialty.name}</p>
              <div className="flex items-center mt-1 text-gray-600">
                <span className="flex items-center">
                  <CheckCircle size={16} className="text-success-500 mr-1" />
                  <span>Verified</span>
                </span>
                <span className="mx-2">•</span>
                <span className="flex items-center">
                  <CalendarIcon size={16} className="mr-1" />
                  <span>{doctor?.experience} years experience</span>
                </span>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-lg font-semibold text-gray-900">
                  <span>${doctor?.consultationFee}</span>
                  <span className="ml-2 text-sm font-normal text-gray-500">per consultation</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking steps */}
          <div className="p-6">
            {/* Step indicators */}
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

            {/* Step 1: Date and Time Selection */}
            {step === 1 && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Select Date and Time</h3>
                
                {/* Date selector */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
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
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          <span className="text-xs font-medium">{format(date, 'EEE')}</span>
                          <span className="text-lg font-bold">{format(date, 'd')}</span>
                          <span className="text-xs">{format(date, 'MMM')}</span>
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
                
                {/* Time slots */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Select Time
                    </label>
                    <span className="text-sm text-gray-500">
                      {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </span>
                  </div>
                  
                  {isLoading ? (
                    <div className="flex justify-center my-8">
                      <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
                    </div>
                  ) : timeSlots.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => handleTimeSlotSelection(slot)}
                          disabled={slot.isBooked}
                          className={`p-3 rounded-md border text-center transition-all ${
                            slot.isBooked
                              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                              : selectedTimeSlot?.id === slot.id
                              ? 'bg-primary-500 text-white border-primary-500 shadow-md'
                              : 'bg-white border-gray-200 hover:border-primary-400 hover:bg-primary-50'
                          }`}
                        >
                          <div className="flex items-center justify-center mb-1">
                            <Clock size={14} className="mr-1" />
                            <span className="text-sm">
                              {format(new Date(slot.startTime), 'h:mm a')}
                            </span>
                          </div>
                          {slot.isBooked && (
                            <span className="text-xs text-gray-500">Booked</span>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                      <AlertCircle size={24} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-700">No available slots for this date</p>
                      <p className="text-sm text-gray-500 mt-1">Please select another date</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-8 flex justify-end">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setStep(2)}
                    disabled={!selectedTimeSlot}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Appointment Details */}
            {step === 2 && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Appointment Details</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center mb-1">
                        <CalendarIcon size={16} className="text-primary-500 mr-2" />
                        <span className="font-medium text-gray-900">
                          {selectedTimeSlot && format(new Date(selectedTimeSlot.startTime), 'EEEE, MMMM d, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="text-primary-500 mr-2" />
                        <span className="font-medium text-gray-900">
                          {selectedTimeSlot && format(new Date(selectedTimeSlot.startTime), 'h:mm a')} - {selectedTimeSlot && format(new Date(selectedTimeSlot.endTime), 'h:mm a')}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setStep(1)}
                    >
                      Change
                    </Button>
                  </div>
                </div>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  setStep(3);
                }}>
                  <div className="mb-6">
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                      Reason for Visit
                    </label>
                    <textarea
                      id="reason"
                      rows={4}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Please briefly describe your symptoms or reason for the appointment..."
                      className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-between mt-8">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                    >
                      Review & Confirm
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirm Your Appointment</h3>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Appointment Summary</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-sm font-medium text-gray-500 mb-1">Doctor</h5>
                      <p className="text-gray-900">{doctor?.name}</p>
                      <p className="text-sm text-gray-600">{doctor?.specialty.name}</p>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-gray-500 mb-1">Patient</h5>
                      <p className="text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-gray-500 mb-1">Date & Time</h5>
                      <p className="text-gray-900">
                        {selectedTimeSlot && format(new Date(selectedTimeSlot.startTime), 'EEEE, MMMM d, yyyy')}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedTimeSlot && format(new Date(selectedTimeSlot.startTime), 'h:mm a')} - {selectedTimeSlot && format(new Date(selectedTimeSlot.endTime), 'h:mm a')}
                      </p>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-gray-500 mb-1">Consultation Fee</h5>
                      <p className="text-gray-900">${doctor?.consultationFee}</p>
                      <p className="text-sm text-gray-600">Payment due at appointment</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <h5 className="text-sm font-medium text-gray-500 mb-1">Reason for Visit</h5>
                    <p className="text-gray-900">{reason}</p>
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle size={20} className="text-yellow-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Please note</h3>
                      <p className="mt-1 text-sm text-yellow-700">
                        Your appointment request will be sent to the doctor for confirmation. You'll receive a notification once it's confirmed.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setStep(2)}
                  >
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleSubmit}
                    isLoading={isCreatingAppointment}
                  >
                    Confirm Appointment
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