const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { successResponse, createdResponse, errorResponse } = require('../utils/response');

// Register
const register = async (req, res) => {
  const { name, email, password, role } = req.body || {};

  if (!name || !email || !password) {
    return errorResponse(res, 'Name, email, and password are required', 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return errorResponse(res, 'Invalid email format', 400);
  }

  if (password.length < 8) {
    return errorResponse(res, 'Password must be at least 8 characters long', 400);
  }

  let userRole = (role || 'USER').toUpperCase();
  if (!['USER', 'ADMIN'].includes(userRole)) {
    return errorResponse(res, 'Invalid role. Role must be either USER or ADMIN', 400);
  }

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
  const { email, password } = req.body || {};

  if (!email || !password) {
    return errorResponse(res, 'Email and password are required', 400);
  }

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