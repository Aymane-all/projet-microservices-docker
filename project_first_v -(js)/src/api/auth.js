  import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Login
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    // console.log('api.js: Login response:', response.data); 
    const { token, email: userEmail, name, role, _id } = response.data;

    if (!role) {
      throw new Error('Invalid login response: role missing');
    }

    const user = { email: userEmail, name, role, _id }; // Construct user object
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return user;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Login failed';
    console.error('api.js: Login error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: errorMessage,
    }); // Debug
    throw new Error(errorMessage);
  }
};

// Register
export const registerUser = async (userData, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      name: userData.name,
      email: userData.email,
      password,
      role: userData.role || 'patient', // Default to patient as per backend
    });
    // console.log('api.js: Register response:', response.data); 
    // Backend only returns { message: 'Register avec succès' }, so we need to log in after registering
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: userData.email,
      password,
    });
    // console.log('api.js: Post-register login response:', loginResponse.data); 
    const { token, email: userEmail, name, role, _id } = loginResponse.data;

    if (!role) {
      throw new Error('Invalid login response: role missing');
    }

    const user = { email: userEmail, name, role, _id };
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return user;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
    console.error('api.js: Register error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: errorMessage,
    }); // Debug
    throw new Error(errorMessage);
  }
};

// Get Current User
export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  if (!token || !storedUser) {
    return null;
  }

  try {
    const response = await axios.get(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // console.log('api.js: Get current user response:', response.data); 
    return response.data;
  } catch (error) {
    console.error('api.js: Error fetching user:', error);
    return JSON.parse(storedUser);
  }
};

// Get All Users
export const getAllUsers = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No token found');
  }

  try {
    const response = await axios.get(`${API_URL}/users/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // console.log('api.js: Get all users response:', response.data); 
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch users';
    console.error('api.js: Get all users error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: errorMessage,
    });
    throw new Error(errorMessage);
  }
};