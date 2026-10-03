const { errorResponse } = require('../utils/response');
const {
  isNonEmptyString,
  isPositiveInteger,
  isNonNegativeInteger,
  isValidDate,
} = require('../utils/validators');

const validate = (validateRequest) => (req, res, next) => {
  const error = validateRequest({
    ...req,
    body: req.body || {},
    params: req.params || {},
  });

  if (error) {
    return errorResponse(res, error, 400);
  }

  next();
};

// 1. Auth Validations
const validateRegister = validate(({ body }) => {
  const { name, email, password, role } = body;

  if (!isNonEmptyString(name)) return 'Name is required';
  if (name.trim().length > 100) return 'Name must be at most 100 characters';

  if (!isNonEmptyString(email)) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format';

  if (!isNonEmptyString(password)) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters long';
  if (password.length > 72) return 'Password must be at most 72 characters long';

  if (role !== undefined && !['USER', 'ADMIN'].includes(String(role).toUpperCase())) {
    return 'Invalid role. Role must be either USER or ADMIN';
  }

  return null;
});

const validateLogin = validate(({ body }) => {
  const { email, password } = body;

  if (!isNonEmptyString(email)) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format';
  if (!isNonEmptyString(password)) return 'Password is required';

  return null;
});

// 2. Category Validation
const validateCategory = validate(({ body }) => {
  const { name } = body;

  if (!isNonEmptyString(name)) return 'Category name is required';
  if (name.trim().length > 100) return 'Category name must be at most 100 characters';

  return null;
});

const validateEventFields = (body) => {
  if (body.title !== undefined) {
    if (!isNonEmptyString(body.title)) return 'Title must be a non-empty string';
    if (body.title.trim().length > 150) return 'Title must be at most 150 characters';
  }

  if (body.description !== undefined && body.description !== null) {
    if (typeof body.description !== 'string') return 'Description must be a string';
  }

  if (body.date !== undefined) {
    if (!isValidDate(body.date)) return 'Date must be a valid date';
  }

  if (body.location !== undefined) {
    if (!isNonEmptyString(body.location)) return 'Location must be a non-empty string';
    if (body.location.trim().length > 255) return 'Location must be at most 255 characters';
  }

  if (body.price !== undefined) {
    if (!isNonNegativeInteger(body.price)) return 'Price must be a non-negative integer';
  }

  if (body.quota !== undefined) {
    if (!isNonNegativeInteger(body.quota)) return 'Quota must be a non-negative integer';
  }

  if (body.categoryId !== undefined) {
    if (!isPositiveInteger(body.categoryId)) return 'categoryId must be a positive integer';
  }

  return null;
};

// 3. Event Validations
const validateCreateEvent = validate(({ body }) => {
  const requiredFields = ['title', 'date', 'location', 'price', 'quota', 'categoryId'];

  for (const field of requiredFields) {
    if (body[field] === undefined || body[field] === null || body[field] === '') {
      return `${field} is required`;
    }
  }

  return validateEventFields(body);
});

const validateUpdateEvent = validate(({ body }) => {
  if (!body || Object.keys(body).length === 0) {
    return 'At least one event field is required for update';
  }

  return validateEventFields(body);
});

// 4. Booking Validation
const validateBooking = validate(({ body }) => {
  if (!isPositiveInteger(body.eventId)) return 'eventId must be a positive integer';
  if (!isPositiveInteger(body.quantity)) return 'quantity must be a positive integer';

  return null;
});

// 5. Parameter Validation
const validateIdParam = validate(({ params }) => {
  if (!isPositiveInteger(params.id)) return 'ID must be a positive integer';

  return null;
});

module.exports = {
  validateRegister,
  validateLogin,
  validateCategory,
  validateCreateEvent,
  validateUpdateEvent,
  validateBooking,
  validateIdParam,
};