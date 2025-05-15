// routes/auth.js
const express = require('express');
const router = express.Router();
const { register, login, registerDoctor } = require('../controllers/auth');
const { protect, authorize } = require('../middleware/auth');

// Routes
router.post('/register', register);
router.post('/login', login);
router.post('/register-doctor', protect, authorize('admin'), registerDoctor);

module.exports = router;