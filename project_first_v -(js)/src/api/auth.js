// In a real application, these would be actual API calls to your backend
// For demo purposes, we're using mock data and local storage

// Mock database for the demo
const mockUsers = [
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
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const loginUser = async (email, password) => {
  await delay(800);

  const user = mockUsers.find(u => u.email === email);

  if (!user) {
    throw new Error('User not found');
  }

  if (!password) {
    throw new Error('Password is required');
  }

  localStorage.setItem('token', 'demo-token-' + user.id);
  localStorage.setItem('user', JSON.stringify(user));

  return user;
};

export const registerUser = async (userData, password) => {
  await delay(1000);

  if (!userData.email || !userData.name || !userData.role || !password) {
    throw new Error('Missing required fields');
  }

  if (mockUsers.some(u => u.email === userData.email)) {
    throw new Error('User with this email already exists');
  }

  const newUser = {
    id: `${mockUsers.length + 1}`,
    name: userData.name,
    email: userData.email,
    role: userData.role,
    profileImage: userData.profileImage
  };

  mockUsers.push(newUser);

  localStorage.setItem('token', 'demo-token-' + newUser.id);
  localStorage.setItem('user', JSON.stringify(newUser));

  return newUser;
};

export const getCurrentUser = async () => {
  await delay(300);

  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  if (!token || !storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};
