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
const {
    validateCreateEvent,
    validateUpdateEvent,
    validateIdParam,
} = require('../middlewares/validationMiddleware');

router.get('/', getAllEvents);
router.get('/:id', validateIdParam, getEventById);

router.post('/', authenticateToken, authorizeRole('ADMIN'), validateCreateEvent, createEvent);
router.put('/:id', authenticateToken, authorizeRole('ADMIN'), validateIdParam, validateUpdateEvent, updateEvent);
router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), validateIdParam, deleteEvent);

module.exports = router;