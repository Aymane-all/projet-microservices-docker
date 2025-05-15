const User = require('../models/User');

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};



// Get all users
exports.getAllDoctors = async (req, res) => {
  try {
    const users = await User.find({role: 'doctor'}).select('-password');
    res.json(users.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getAllpatient = async (req, res) => {
  try {
    const users = await User.find({ role: 'patient' }).select('-password');
    res.json(users.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};