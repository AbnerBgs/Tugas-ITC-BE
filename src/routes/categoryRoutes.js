const express = require('express');
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

const {authenticateToken, authorizeRole} = require('../middlewares/authMiddleware');
const {
  validateCategory,
  validateIdParam,
} = require('../middlewares/validationMiddleware');

router.get('/', getAllCategories);

router.post('/', authenticateToken, authorizeRole('ADMIN'), validateCategory, createCategory);
router.put('/:id', authenticateToken, authorizeRole('ADMIN'), validateIdParam, validateCategory, updateCategory);
router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), validateIdParam, deleteCategory);

module.exports = router;