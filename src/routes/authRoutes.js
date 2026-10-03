const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authControllers');
const {
  validateRegister,
  validateLogin,
} = require('../middlewares/validationMiddleware');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

module.exports = router;