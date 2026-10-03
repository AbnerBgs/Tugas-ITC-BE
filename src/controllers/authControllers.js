const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { successResponse, createdResponse, errorResponse } = require('../utils/response');

// Register
const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const userRole = (role || 'USER').toUpperCase();

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return errorResponse(res, 'Email already taken', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: userRole,
      },
    });

    return createdResponse(res, 'User registered successfully', {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error('[Register Error]', error);
    return errorResponse(res, 'An internal server error occurred. Please try again later.', 500);
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return errorResponse(res, 'Invalid email or password', 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password', 400);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    return successResponse(res, 'Login successful', {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('[Login Error]', error);
    return errorResponse(res, 'An internal server error occurred. Please try again later.', 500);
  }
};

module.exports = { register, login };