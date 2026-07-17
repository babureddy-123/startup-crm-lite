import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Helper function to generate a JSON Web Token for authenticated users.
 *
 * @param {string} userId - MongoDB ObjectId of the user.
 * @returns {string} Signed JWT string.
 */
export function generateToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

/**
 * Register a new user account inside the CRM workspace database.
 *
 * @param {Object} req - Express Request object.
 * @param {Object} res - Express Response object.
 * @param {Function} next - Express error forwarder.
 * @returns {Promise<void>} Resolves when account is registered.
 */
export async function register(req, res, next) {
  // NOTE: In production, express-rate-limit should be mounted on the registration endpoint to prevent brute-force signups.
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 'Email already exists', 409);
    }

    const user = await User.create({
      name,
      email,
      password
    });

    const token = generateToken(user._id);

    return successResponse(
      res,
      { token, user: user.toJSON() },
      'User registered successfully',
      201
    );
  } catch (error) {
    next(error);
  }
}

/**
 * Log in a user and establish auth session.
 *
 * @param {Object} req - Express Request object.
 * @param {Object} res - Express Response object.
 * @param {Function} next - Express error forwarder.
 * @returns {Promise<void>} Resolves when credentials match.
 */
export async function login(req, res, next) {
  // NOTE: In production, express-rate-limit should be mounted on this login route to avoid brute-force attacks on passwords.
  const { email, password } = req.body;

  try {
    // Explicitly select password field to execute comparisons
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      // General credentials error to hide database structure details
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // Verify account activation flag
    if (!user.isActive) {
      return errorResponse(res, 'Account is deactivated', 403);
    }

    const token = generateToken(user._id);

    return successResponse(
      res,
      { token, user: user.toJSON() },
      'User logged in successfully'
    );
  } catch (error) {
    next(error);
  }
}

/**
 * Retrieve the active user profile profile.
 *
 * @param {Object} req - Express Request object.
 * @param {Object} res - Express Response object.
 * @param {Function} next - Express error forwarder.
 * @returns {void}
 */
export function getProfile(req, res) {
  return successResponse(
    res,
    req.user,
    'User profile retrieved successfully'
  );
}

/**
 * Update user details (Name only, or Password change validation).
 *
 * @param {Object} req - Express Request object.
 * @param {Object} res - Express Response object.
 * @param {Function} next - Express error forwarder.
 * @returns {Promise<void>} Resolves when update commits.
 */
export async function updateProfile(req, res, next) {
  const { name, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id).select('+password');

    // 1. Update name details if provided
    if (name) {
      user.name = name;
    }

    // 2. Validate password transition
    if (newPassword) {
      if (!currentPassword) {
        return errorResponse(res, 'Current password is required to change password', 400);
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return errorResponse(res, 'Invalid current password credentials', 401);
      }

      // Assign the new password; pre-save middleware handles hashing auto on save()
      user.password = newPassword;
    }

    await user.save();

    return successResponse(
      res,
      user.toJSON(),
      'User profile updated successfully'
    );
  } catch (error) {
    next(error);
  }
}
