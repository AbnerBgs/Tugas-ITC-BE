const response = (res, statusCode, message, status, data = null) => {
  return res.status(statusCode).json({
    code: statusCode,
    message,
    status,
    data,
  });
};

const successResponse = (res, message, data = null) =>
  response(res, 200, message, true, data);

const createdResponse = (res, message, data = null) =>
  response(res, 201, message, true, data);

const errorResponse = (res, message, statusCode = 400, data = null) =>
  response(res, statusCode, message, false, data);

module.exports = {
  successResponse,
  createdResponse,
  errorResponse,
};