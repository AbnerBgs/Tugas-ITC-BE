const express = require('express');
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

const {authenticateToken, authorizeRole} = require('../middleware/authMiddleware');

router.get('/', getAllCategories);

router.post('/', authenticateToken, authorizeRole('ADMIN'), createCategory);
router.put('/:id', authenticateToken, authorizeRole('ADMIN'), updateCategory);
router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), deleteCategory);

module.exports = router;