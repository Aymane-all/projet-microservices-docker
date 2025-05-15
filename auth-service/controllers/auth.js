const jwt = require('jsonwebtoken');
const User = require('../models/User');
const axios = require('axios');

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      name: user.name
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d'
    }
  );
};

// Register a user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user with default patient role
    const user = await User.create({
      name,
      email,
      password,
      role: 'patient'
    });

    if (user) {
      res.status(201).json({ message: 'Register avec succès' });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Login a user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Admin register doctor
const registerDoctor = async (req, res) => {
  try {
    // Optional: Explicit role check
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can register doctors' });
    }

    const { name, email, password, phone, specialty, location, description, photo } = req.body;

    // Validate required fields
    if (!name || !email || !password || !phone || !specialty || !location) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user exists in MongoDB
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Doctor already exists' });
    }

    // Create user in MongoDB with doctor role
    const user = await User.create({
      name,
      email,
      password,
      role: 'doctor'
    });

    // Generate JWT token for the newly created doctor user
    const token = generateToken(user);

    // Save doctor details in Laravel with JWT token
    try {
      const laravel_response = await axios.post(
        'http://127.0.0.1:8000/api/doctors',
        {
          name,
          email,
          phone,
          specialty,
          location,
          description: description || null,
          photo: photo || null
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('Laravel API response:', laravel_response.data);
    } catch (error) {
      console.error(
        'Error saving to Laravel:',
        error.response
          ? {
              status: error.response.status,
              data: error.response.data,
              headers: error.response.headers
            }
          : error.message
      );

      // Rollback MongoDB user if Laravel fails
      await User.deleteOne({ _id: user._id });
      return res.status(500).json({
        message: 'Failed to save doctor details',
        error: error.response ? error.response.data : error.message
      });
    }

    res.status(201).json({
      message: 'Doctor registered successfully',
      doctor: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('MongoDB error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Export all functions
module.exports = {
  register,
  login,
  registerDoctor
};