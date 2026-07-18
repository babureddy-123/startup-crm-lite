/**
 * Categorizes and formats detailed error messages for API failures.
 * Handles CORS, 401 Unauthorized, Server Errors (5xx), and Network Errors separately.
 *
 * @param {Error} err - Axios error object.
 * @param {string} context - Operation context ('login' | 'register' | 'general').
 * @returns {{ type: string, message: string }} Structured error type and display message.
 */
export function handleApiError(err, context = 'general') {
  // 1. Response received from backend (HTTP status code returned)
  if (err && err.response) {
    const status = err.response.status;
    const serverMessage = err.response.data?.message;

    // 401 Unauthorized
    if (status === 401) {
      if (context === 'login') {
        return {
          type: '401',
          message: serverMessage || 'Invalid email or password. Please check your credentials.'
        };
      }
      return {
        type: '401',
        message: serverMessage || 'Unauthorized access. Session expired or invalid credentials.'
      };
    }

    // 403 Forbidden
    if (status === 403) {
      return {
        type: '403',
        message: serverMessage || 'Access forbidden. You do not have permission for this action.'
      };
    }

    // 409 Conflict / Account exists
    if (status === 409) {
      return {
        type: '409',
        message: serverMessage || 'Account already exists. Please Sign In.'
      };
    }

    // 503 Service Unavailable / Database connection issues
    if (status === 503) {
      return {
        type: '503',
        message: serverMessage || 'Database connection is currently unavailable. Please try again later.'
      };
    }

    // 5xx Internal Server Error
    if (status >= 500) {
      return {
        type: 'server_error',
        message: serverMessage || `Server Error (${status}). The server encountered an issue. Please try again later.`
      };
    }

    // Express-validator validation field error array
    const validationErrors = err.response.data?.errors;
    if (Array.isArray(validationErrors) && validationErrors.length > 0) {
      return {
        type: 'validation',
        message: validationErrors[0].message
      };
    }

    // General 4xx client errors
    return {
      type: 'client_error',
      message: serverMessage || `Request failed with status ${status}.`
    };
  }

  // 2. No HTTP response received from server (CORS / Connection Refused / Offline / Network Timeout)
  const errMsg = (err && err.message) ? String(err.message) : '';
  const errCode = (err && err.code) ? String(err.code) : '';

  // Check for CORS explicitly
  if (
    errMsg.toLowerCase().includes('cors') ||
    (errCode === 'ERR_NETWORK' && typeof window !== 'undefined' && window.navigator.onLine && !err?.request?.status)
  ) {
    if (errMsg.toLowerCase().includes('cors')) {
      return {
        type: 'cors',
        message: 'CORS Error: Cross-Origin Request Blocked. The backend server rejected requests from this origin.'
      };
    }
  }

  // Check for Offline status
  if (typeof window !== 'undefined' && !window.navigator.onLine) {
    return {
      type: 'network',
      message: 'Network Error: You appear to be offline. Please check your internet connection.'
    };
  }

  // Network connection error
  return {
    type: 'network',
    message: 'Network Error: Unable to connect to backend server. Please check your internet connection or try again later.'
  };
}
