const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getCurrentUser, getAllpatient, getAllDoctors } = require('../controllers/users');

// @route   GET /api/users/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, getCurrentUser);

router.get('/doctors', protect,authorize('admin'), getAllDoctors);

router.get('/patients', protect,authorize('admin'), getAllpatient);

module.exports = router;