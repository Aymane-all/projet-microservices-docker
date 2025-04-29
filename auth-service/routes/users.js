const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getCurrentUser, updateUserProfile } = require('../controllers/users');

// @route   GET /api/users/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, getCurrentUser);

// @route   PUT /api/users/me
// @desc    Update user profile
// @access  Private
router.put('/me', protect, updateUserProfile);

module.exports = router;