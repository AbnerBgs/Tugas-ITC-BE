const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return errorResponse(res, 'Authorization header missing', 401);
  }

  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return errorResponse(res, 'Access token required', 401);
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) {
      console.error('[Token Verification Error]', err);
      return errorResponse(res, 'Invalid or expired token', 403);
    }
    req.user = user;
    next();
  });
};

const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return errorResponse(res, 'Access denied: Insufficient permissions', 403);
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRole };