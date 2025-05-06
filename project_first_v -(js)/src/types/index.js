// User roles: 'patient' | 'doctor'

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {'patient' | 'doctor'} role
 * @property {string} [profileImage]
 */

/**
 * @typedef {User & {
*   role: 'patient',
*   dateOfBirth?: string,
*   phone?: string,
*   address?: string,
*   medicalHistory?: string[]
* }} Patient
*/

/**
* @typedef {Object} Specialty
* @property {string} id
* @property {string} name
*/

/**
* @typedef {User & {
*   role: 'doctor',
*   specialty: Specialty,
*   qualifications: string[],
*   experience: number,
*   rating: number,
*   about: string,
*   consultationFee?: number
* }} Doctor
*/

/**
* @typedef {Object} Availability
* @property {string} id
* @property {string} doctorId
* @property {number} dayOfWeek
* @property {string} startTime
* @property {string} endTime
* @property {boolean} isAvailable
*/

/**
* @typedef {Object} TimeSlot
* @property {string} id
* @property {string} startTime
* @property {string} endTime
* @property {boolean} isBooked
*/

/**
* @typedef {'pending' | 'confirmed' | 'cancelled' | 'completed'} AppointmentStatus
*/

/**
* @typedef {Object} Appointment
* @property {string} id
* @property {string} doctorId
* @property {string} patientId
* @property {string} dateTime
* @property {string} endTime
* @property {AppointmentStatus} status
* @property {string} [reason]
* @property {string} [notes]
* @property {string} createdAt
* @property {Doctor} [doctor]
* @property {Patient} [patient]
*/

/**
* @typedef {Object} AuthContextType
* @property {User|null} user
* @property {boolean} isLoading
* @property {(email: string, password: string) => Promise<void>} login
* @property {(userData: Partial<User>, password: string) => Promise<void>} register
* @property {() => void} logout
* @property {boolean} isAuthenticated
*/

/**
* @typedef {Object} AppointmentContextType
* @property {Appointment[]} appointments
* @property {boolean} isLoading
* @property {string|null} error
* @property {(appointmentData: Partial<Appointment>) => Promise<Appointment>} createAppointment
* @property {(appointmentId: string) => Promise<void>} cancelAppointment
* @property {(appointmentId: string, status: AppointmentStatus) => Promise<void>} updateAppointmentStatus
* @property {(patientId: string) => Promise<Appointment[]>} getPatientAppointments
* @property {(doctorId: string) => Promise<Appointment[]>} getDoctorAppointments
*/
