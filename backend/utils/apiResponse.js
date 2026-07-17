/**
 * Sends a successful JSON response back to the client.
 *
 * @param {Object} res - Express Response object.
 * @param {any} data - Body payload contents.
 * @param {string} message - Descriptive text message.
 * @param {number} [statusCode=200] - HTTP status code.
 * @returns {Object} Express JSON response.
 */
export function successResponse(res, data, message, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

/**
 * Sends an error JSON response back to the client.
 *
 * @param {Object} res - Express Response object.
 * @param {string} message - Error description message.
 * @param {number} [statusCode=500] - HTTP status code.
 * @param {any} [errors=null] - Validation warnings list or error details.
 * @returns {Object} Express JSON response.
 */
export function errorResponse(res, message, statusCode = 500, errors = null) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
}

/**
 * Sends a paginated successful JSON response back to the client.
 *
 * @param {Object} res - Express Response object.
 * @param {any[]} data - Subset array list of items for the page.
 * @param {number} total - Total count of matching items in DB.
 * @param {number} page - Current page index.
 * @param {number} limit - Items limit per page.
 * @returns {Object} Express JSON response.
 */
export function paginatedResponse(res, data, total, page, limit) {
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const pages = Math.ceil(total / limitNum) || 1;

  return res.status(200).json({
    success: true,
    data,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages
    }
  });
}
