import { format } from 'date-fns';
import apiService from './apiService';
import toast from 'react-hot-toast';

export const getAllDoctors = async () => {
  try {
    const data = await apiService.doctors.getAll();
    return Array.isArray(data)
      ? data.map((doctor) => ({
          id: doctor?.id || '',
          name: doctor?.name || 'Unknown Doctor',
          specialty: { id: doctor?.id || '', name: doctor?.specialty || 'Unknown' },
          qualifications: doctor?.qualifications || [],
          profile_image: doctor?.photo || null,
          rating: doctor?.rating || 0,
          about: doctor?.description || '',
          consultation_fee: doctor?.consultation_fee || 0,
          experience: doctor?.experience || 0,
          location: doctor?.location || 'New York, NY',
          email: doctor?.email || '',
          phone: doctor?.phone || '',
        }))
      : [];
  } catch (error) {
    toast.error('Impossible de récupérer la liste des médecins');
    console.error('Error fetching doctors:', error);
    return [];
  }
};

export const getAllSpecialties = async () => {
  try {
    // Essayer d'abord de récupérer les spécialités directement depuis l'API
    try {
      const specialties = await apiService.doctors.getSpecialties();
      if (Array.isArray(specialties) && specialties.length > 0) {
        return specialties;
      }
    } catch (specialtyError) {
      console.log('Fallback to extracting specialties from doctors');
    }

    // Fallback: extraire les spécialités depuis les médecins
    const doctors = await getAllDoctors();
    const specialtiesSet = new Set();

    doctors.forEach(doctor => {
      if (doctor.specialty && doctor.specialty.name) {
        specialtiesSet.add(doctor.specialty.name);
      }
    });

    const specialties = Array.from(specialtiesSet).map((name, index) => ({
      id: (index + 1).toString(),
      name
    }));

    return specialties;
  } catch (error) {
    toast.error('Impossible de récupérer les spécialités');
    console.error('Error extracting specialties:', error);
    return [];
  }
};

export const getDoctorById = async (doctorId) => {
  try {
    const doctor = await apiService.doctors.getById(doctorId);
    return {
      id: doctor?.id || '',
      name: doctor?.name || 'Unknown Doctor',
      specialty: { id: doctor?.id || '', name: doctor?.specialty || 'Unknown' },
      qualifications: doctor?.qualifications || [],
      profile_image: doctor?.photo || null,
      rating: doctor?.rating || 0,
      about: doctor?.description || '',
      consultation_fee: doctor?.consultation_fee || 0,
      experience: doctor?.experience || 0,
      location: doctor?.location || 'New York, NY',
      email: doctor?.email || '',
      phone: doctor?.phone || '',
    };
  } catch (error) {
    toast.error(`Impossible de récupérer les informations du médecin`);
    console.error('Error fetching doctor by ID:', error);
    return null;
  }
};

export const getAvailableTimeSlots = async (doctorId, date) => {
  try {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const slots = await apiService.doctors.getAvailableSlots(doctorId, formattedDate);
    return Array.isArray(slots)
      ? slots.map((slot) => ({
          id: slot.id,
          start_time: slot.start_time,
          end_time: slot.end_time,
          is_available: slot.is_available,
        }))
      : [];
  } catch (error) {
    toast.error('Impossible de récupérer les créneaux disponibles');
    console.error('Error fetching time slots:', error);
    return [];
  }
};

export const bookAppointment = async (appointmentData) => {
  try {
    const result = await apiService.appointments.create(appointmentData);
    toast.success('Rendez-vous réservé avec succès!');
    return result;
  } catch (error) {
    toast.error('Erreur lors de la réservation du rendez-vous');
    console.error('Error booking appointment:', error);
    throw error;
  }
};