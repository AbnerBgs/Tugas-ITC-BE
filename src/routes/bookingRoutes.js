const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getAllBookings,
} = require('../controllers/bookingController');

const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

router.post('/', authenticateToken, createBooking);
router.get('/my-bookings', authenticateToken, getMyBookings);

router.get('/admin', authenticateToken, authorizeRole('ADMIN'), getAllBookings);

module.exports = router;