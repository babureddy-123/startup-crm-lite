import api from './api';

/**
 * Auth Service helper object managing authentication routes communication.
 */
const authService = {
  /**
   * Registers a new user account profile.
   *
   * @param {string} name - User's display name.
   * @param {string} email - Account email address.
   * @param {string} password - Security password.
   * @returns {Promise<Object>} Axios unwrapped response data payload.
   */
  register: async (name, email, password) => {
    const response = await api.post('/api/auth/register', { name, email, password });
    return response.data;
  },

  /**
   * Logs in an existing user.
   *
   * @param {string} email - Account email address.
   * @param {string} password - Security password.
   * @returns {Promise<Object>} Axios unwrapped response data payload.
   */
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  /**
   * Clears active authentication tokens from localStorage.
   */
  logout: () => {
    localStorage.removeItem('crm-token');
  },

  /**
   * Fetches active user session profile data.
   *
   * @returns {Promise<Object>} Axios unwrapped response data payload.
   */
  getProfile: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  /**
   * Updates user name or password configurations.
   *
   * @param {Object} data - Update data fields (name, currentPassword, newPassword).
   * @returns {Promise<Object>} Axios unwrapped response data payload.
   */
  updateProfile: async (data) => {
    const response = await api.put('/api/auth/profile', data);
    return response.data;
  }
};

export default authService;
