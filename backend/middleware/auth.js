import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * Authentication check middleware to protect routes.
 * Extracts the JWT from Authorization: Bearer <token>, verifies it, and attaches the user payload.
 *
 * @param {Object} req - Express Request object.
 * @param {Object} res - Express Response object.
 * @param {Function} next - Express next handler.
 * @returns {Promise<void>} Resolves when verification succeeds.
 */
export async function protect(req, res, next) {
  let token;

  // Read auth header format: Bearer <token>
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return errorResponse(res, 'No token provided, access denied', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the user and exclude password field
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return errorResponse(res, 'User belonging to this token no longer exists', 401);
    }

    // Attach active user session info to request context
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token has expired, please login again', 401);
    }
    return errorResponse(res, 'Token is invalid', 401);
  }
}

export default protect;
