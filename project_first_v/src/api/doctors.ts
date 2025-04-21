import { Doctor, Specialty, Availability, TimeSlot } from '../types';
import { format, addDays, setHours, setMinutes } from 'date-fns';

// Mock data
const mockSpecialties: Specialty[] = [
  { id: '1', name: 'Cardiology' },
  { id: '2', name: 'Dermatology' },
  { id: '3', name: 'Neurology' },
  { id: '4', name: 'Pediatrics' },
  { id: '5', name: 'Orthopedics' },
  { id: '6', name: 'Psychiatry' },
  { id: '7', name: 'Gynecology' },
  { id: '8', name: 'Ophthalmology' }
];

const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Jane Smith',
    email: 'jane.smith@example.com',
    role: 'doctor',
    specialty: mockSpecialties[0], // Cardiology
    qualifications: ['MD', 'PhD', 'FACC'],
    experience: 15,
    rating: 4.8,
    about: 'Dr. Smith is a board-certified cardiologist with over 15 years of experience in treating various heart conditions.',
    profileImage: 'https://images.pexels.com/photos/5214959/pexels-photo-5214959.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    consultationFee: 150
  },
  {
    id: '2',
    name: 'Dr. Michael Johnson',
    email: 'michael.johnson@example.com',
    role: 'doctor',
    specialty: mockSpecialties[1], // Dermatology
    qualifications: ['MD', 'FAAD'],
    experience: 8,
    rating: 4.6,
    about: 'Dr. Johnson specializes in treating skin conditions including acne, eczema, and skin cancer.',
    profileImage: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    consultationFee: 120
  },
  {
    id: '3',
    name: 'Dr. Sarah Williams',
    email: 'sarah.williams@example.com',
    role: 'doctor',
    specialty: mockSpecialties[3], // Pediatrics
    qualifications: ['MD', 'FAAP'],
    experience: 12,
    rating: 4.9,
    about: 'Dr. Williams is a compassionate pediatrician who has been caring for children of all ages for over a decade.',
    profileImage: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    consultationFee: 100
  },
  {
    id: '4',
    name: 'Dr. Robert Chen',
    email: 'robert.chen@example.com',
    role: 'doctor',
    specialty: mockSpecialties[2], // Neurology
    qualifications: ['MD', 'PhD', 'FAAN'],
    experience: 20,
    rating: 4.7,
    about: 'Dr. Chen is a neurologist with expertise in treating headaches, seizures, and other neurological disorders.',
    profileImage: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    consultationFee: 180
  }
];

// Mock availabilities (simplified for demo)
const mockAvailabilities: Record<string, Availability[]> = {
  '1': [
    { id: '1', doctorId: '1', dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isAvailable: true },
    { id: '2', doctorId: '1', dayOfWeek: 2, startTime: '09:00', endTime: '17:00', isAvailable: true },
    { id: '3', doctorId: '1', dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isAvailable: true },
    { id: '4', doctorId: '1', dayOfWeek: 4, startTime: '09:00', endTime: '17:00', isAvailable: true },
    { id: '5', doctorId: '1', dayOfWeek: 5, startTime: '09:00', endTime: '15:00', isAvailable: true }
  ],
  '2': [
    { id: '6', doctorId: '2', dayOfWeek: 1, startTime: '10:00', endTime: '18:00', isAvailable: true },
    { id: '7', doctorId: '2', dayOfWeek: 3, startTime: '10:00', endTime: '18:00', isAvailable: true },
    { id: '8', doctorId: '2', dayOfWeek: 5, startTime: '10:00', endTime: '18:00', isAvailable: true }
  ],
  '3': [
    { id: '9', doctorId: '3', dayOfWeek: 1, startTime: '08:00', endTime: '16:00', isAvailable: true },
    { id: '10', doctorId: '3', dayOfWeek: 2, startTime: '08:00', endTime: '16:00', isAvailable: true },
    { id: '11', doctorId: '3', dayOfWeek: 3, startTime: '08:00', endTime: '16:00', isAvailable: true },
    { id: '12', doctorId: '3', dayOfWeek: 4, startTime: '08:00', endTime: '16:00', isAvailable: true }
  ],
  '4': [
    { id: '13', doctorId: '4', dayOfWeek: 2, startTime: '11:00', endTime: '19:00', isAvailable: true },
    { id: '14', doctorId: '4', dayOfWeek: 4, startTime: '11:00', endTime: '19:00', isAvailable: true }
  ]
};

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get all doctors
export const getAllDoctors = async (): Promise<Doctor[]> => {
  await delay(800);
  return [...mockDoctors];
};

// Get doctors by specialty
export const getDoctorsBySpecialty = async (specialtyId: string): Promise<Doctor[]> => {
  await delay(600);
  return mockDoctors.filter(doctor => doctor.specialty.id === specialtyId);
};

// Get doctor by ID
export const getDoctorById = async (doctorId: string): Promise<Doctor | null> => {
  await delay(500);
  const doctor = mockDoctors.find(doc => doc.id === doctorId);
  return doctor || null;
};

// Get all specialties
export const getAllSpecialties = async (): Promise<Specialty[]> => {
  await delay(400);
  return [...mockSpecialties];
};

// Get doctor availability
export const getDoctorAvailability = async (doctorId: string): Promise<Availability[]> => {
  await delay(600);
  return mockAvailabilities[doctorId] || [];
};

// Update doctor availability
export const updateDoctorAvailability = async (doctorId: string, availabilities: Availability[]): Promise<Availability[]> => {
  await delay(800);
  
  // In a real app, this would update the database
  mockAvailabilities[doctorId] = availabilities;
  
  return availabilities;
};

// Generate time slots for appointment booking based on doctor availability
export const getAvailableTimeSlots = async (doctorId: string, date: Date): Promise<TimeSlot[]> => {
  await delay(700);
  
  const dayOfWeek = date.getDay();
  const formattedDate = format(date, 'yyyy-MM-dd');
  
  // Find doctor's availability for the given day
  const availability = mockAvailabilities[doctorId]?.find(a => a.dayOfWeek === dayOfWeek);
  
  if (!availability || !availability.isAvailable) {
    return []; // Doctor not available on this day
  }
  
  // Generate 30-minute slots
  const slots: TimeSlot[] = [];
  const [startHour, startMinute] = availability.startTime.split(':').map(Number);
  const [endHour, endMinute] = availability.endTime.split(':').map(Number);
  
  let slotDate = setMinutes(setHours(new Date(formattedDate), startHour), startMinute);
  const endDate = setMinutes(setHours(new Date(formattedDate), endHour), endMinute);
  
  let slotId = 1;
  
  while (slotDate < endDate) {
    const endSlotDate = new Date(slotDate);
    endSlotDate.setMinutes(endSlotDate.getMinutes() + 30);
    
    if (endSlotDate <= endDate) {
      slots.push({
        id: `${doctorId}-${formattedDate}-${slotId}`,
        startTime: slotDate.toISOString(),
        endTime: endSlotDate.toISOString(),
        isBooked: Math.random() < 0.3 // Randomly mark some slots as booked for demo
      });
      
      slotId++;
    }
    
    slotDate = new Date(endSlotDate);
  }
  
  return slots;
};