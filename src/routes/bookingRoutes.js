const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getAllBookings,
} = require('../controllers/bookingController');

const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');
const { validateBooking } = require('../middlewares/validationMiddleware');

router.post('/', authenticateToken, validateBooking, createBooking);
router.get('/my-bookings', authenticateToken, getMyBookings);

router.get('/admin', authenticateToken, authorizeRole('ADMIN'), getAllBookings);

module.exports = router;