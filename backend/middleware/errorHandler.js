import { errorResponse } from '../utils/apiResponse.js';

/**
 * Express Global Error Handling Middleware.
 * Catches Mongoose errors, MongoDB duplicate codes, and JWT issues.
 * Returns consistent API errors.
 *
 * @param {Error|Object} err - The error object.
 * @param {Object} req - Express Request object.
 * @param {Object} res - Express Response object.
 * @param {Function} next - Next middleware delegate.
 * @returns {void}
 */
export default function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server error';
  let errors = null;

  // 1. Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation input failed';
    errors = {};
    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message;
    });
  }

  // 2. Mongoose Cast Error (invalid ObjectId query)
  else if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Resource not found';
  }

  // 3. MongoDB Duplicate Key (Duplicate account emails)
  else if (err.code === 11000) {
    statusCode = 409;
    // Map custom field message depending on duplicate key paths
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  // 4. JWT Authorization errors
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token authorization credentials';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token session has expired';
  }

  // Construct error payload details
  const isDev = process.env.NODE_ENV === 'development';
  const errorPayload = {
    message,
    errors,
    ...(isDev && { stack: err.stack })
  };

  // Send structured error response
  return errorResponse(res, errorPayload.message, statusCode, errorPayload.errors || (isDev ? err.stack : null));
}
