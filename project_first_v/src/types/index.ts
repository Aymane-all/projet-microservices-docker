export type UserRole = 'patient' | 'doctor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
}

export interface Patient extends User {
  role: 'patient';
  dateOfBirth?: string;
  phone?: string;
  address?: string;
  medicalHistory?: string[];
}

export interface Specialty {
  id: string;
  name: string;
}

export interface Doctor extends User {
  role: 'doctor';
  specialty: Specialty;
  qualifications: string[];
  experience: number; // in years
  rating: number;
  about: string;
  consultationFee?: number;
}

export interface Availability {
  id: string;
  doctorId: string;
  dayOfWeek: number; // 0-6 where 0 is Sunday
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isAvailable: boolean;
}

export interface TimeSlot {
  id: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  isBooked: boolean;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  dateTime: string; // ISO string for start time
  endTime: string; // ISO string for end time
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
  createdAt: string; // ISO string
  doctor?: Doctor; // Optional doctor details
  patient?: Patient; // Optional patient details
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface AppointmentContextType {
  appointments: Appointment[];
  isLoading: boolean;
  error: string | null;
  createAppointment: (appointmentData: Partial<Appointment>) => Promise<Appointment>;
  cancelAppointment: (appointmentId: string) => Promise<void>;
  updateAppointmentStatus: (appointmentId: string, status: AppointmentStatus) => Promise<void>;
  getPatientAppointments: (patientId: string) => Promise<Appointment[]>;
  getDoctorAppointments: (doctorId: string) => Promise<Appointment[]>;
}