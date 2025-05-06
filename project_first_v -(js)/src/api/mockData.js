// Mock specialties
export const mockSpecialties = [
  { id: '1', name: 'Cardiology' },
  { id: '2', name: 'Dermatology' },
  { id: '3', name: 'Neurology' },
  { id: '4', name: 'Pediatrics' },
  { id: '5', name: 'Orthopedics' },
  { id: '6', name: 'Psychiatry' },
  { id: '7', name: 'Gynecology' },
  { id: '8', name: 'Ophthalmology' }
];

// Mock doctors
export const mockDoctors = [
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

// Mock patients
export const mockPatients = [
  {
    id: '2',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'patient',
    dateOfBirth: '1985-06-15',
    phone: '555-123-4567',
    address: '123 Main St, Anytown, USA',
    profileImage: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    medicalHistory: ['Hypertension', 'Allergies: Peanuts']
  },
  {
    id: '3',
    name: 'Emma Wilson',
    email: 'emma.wilson@example.com',
    role: 'patient',
    dateOfBirth: '1990-11-23',
    phone: '555-987-6543',
    address: '456 Oak Ave, Somewhere, USA',
    profileImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    medicalHistory: ['Asthma', 'Previous surgery: Appendectomy (2018)']
  }
];
