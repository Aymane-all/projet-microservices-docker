import { User } from '../types';

// In a real application, these would be actual API calls to your backend
// For demo purposes, we're using mock data and local storage

// Mock database for the demo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Dr. Jane Smith',
    email: 'doctor@example.com',
    role: 'doctor',
    profileImage: 'https://images.pexels.com/photos/5214959/pexels-photo-5214959.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'patient@example.com',
    role: 'patient',
    profileImage: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const loginUser = async (email: string, password: string): Promise<User> => {
  // Simulate API call
  await delay(800);
  
  const user = mockUsers.find(u => u.email === email);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // In a real app, you would verify the password here
  // For demo, we'll just assume it's correct as long as it's not empty
  if (!password) {
    throw new Error('Password is required');
  }
  
  // Store authentication token in localStorage
  localStorage.setItem('token', 'demo-token-' + user.id);
  localStorage.setItem('user', JSON.stringify(user));
  
  return user;
};

export const registerUser = async (userData: Partial<User>, password: string): Promise<User> => {
  // Simulate API call
  await delay(1000);
  
  if (!userData.email || !userData.name || !userData.role || !password) {
    throw new Error('Missing required fields');
  }
  
  // Check if user already exists
  if (mockUsers.some(u => u.email === userData.email)) {
    throw new Error('User with this email already exists');
  }
  
  // Create new user
  const newUser: User = {
    id: `${mockUsers.length + 1}`,
    name: userData.name,
    email: userData.email,
    role: userData.role,
    profileImage: userData.profileImage
  };
  
  // In a real app, this would be saved to a database
  // For demo, we'll add to our mock data
  mockUsers.push(newUser);
  
  // Store authentication token in localStorage
  localStorage.setItem('token', 'demo-token-' + newUser.id);
  localStorage.setItem('user', JSON.stringify(newUser));
  
  return newUser;
};

export const getCurrentUser = async (): Promise<User | null> => {
  // Simulate API call
  await delay(300);
  
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  
  if (!token || !storedUser) {
    return null;
  }
  
  try {
    return JSON.parse(storedUser) as User;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};