const express = require('express');
const router = express.Router();
const {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent, 
    deleteEvent,
} = require('../controllers/eventController');

const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

router.get('/', getAllEvents);
router.get('/', getEventById);

router.post('/', authenticateToken, authorizeRole('ADMIN'), createEvent);
router.put('/:id', authenticateToken, authorizeRole('ADMIN'), updateEvent);
router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), deleteEvent);

module.exports = router;