const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  cancelBooking,
} = require('../controllers/bookingController');

const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');
const { validateBooking, validateIdParam } = require('../middlewares/validationMiddleware');

router.post('/', authenticateToken, validateBooking, createBooking);
router.get('/my-bookings', authenticateToken, getMyBookings);
router.delete('/:id', authenticateToken, validateIdParam, cancelBooking);

router.get('/admin', authenticateToken, authorizeRole('ADMIN'), getAllBookings);

module.exports = router;