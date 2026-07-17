import { validationResult } from 'express-validator';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * Higher-order middleware validation runner for express-validator array validation sets.
 *
 * @param {Array<Object>} validations - List of validation checks to run.
 * @returns {Function} Express middleware callback.
 */
export function validate(validations) {
  return async (req, res, next) => {
    // Run all validations asynchronously in parallel
    await Promise.all(validations.map((val) => val.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Format errors to show the affected fields and custom error messages
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg
    }));

    return errorResponse(res, 'Validation input failed', 400, formattedErrors);
  };
}

export default validate;
