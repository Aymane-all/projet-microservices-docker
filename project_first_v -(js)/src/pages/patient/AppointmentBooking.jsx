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
// import { Doctor, TimeSlot } from '../../types';
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

  const handleDateChange = async (date) => {
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
    if (!timeSlot.isBooked) {
      setSelectedTimeSlot(timeSlot);
    }
  };

  const handleSubmit = async (e) => {
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

                {/* Time slots */}
                <div className="grid grid-cols-2 gap-4">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.startTime}
                      onClick={() => handleTimeSlotSelection(slot)}
                      disabled={slot.isBooked}
                      className={`flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium ${
                        slot.isBooked
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-primary-500 text-white hover:bg-primary-400'
                      }`}
                    >
                      <Clock size={16} className="mr-2" />
                      {format(new Date(slot.startTime), 'hh:mm a')}
                    </button>
                  ))}
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button onClick={() => setStep(2)} disabled={!selectedTimeSlot}>
                    Next
                  </Button>
                </div>
              </div>
            )}
            
            {/* Step 2: Appointment Details */}
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
                  <Button onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button onClick={handleSubmit} className="ml-3" disabled={isCreatingAppointment}>
                    {isCreatingAppointment ? 'Submitting...' : 'Submit Appointment'}
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
