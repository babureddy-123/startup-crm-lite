import api from './api';

/**
 * Lead Service helper object managing lead pipelines API requests.
 */
const leadService = {
  /**
   * Fetches matching leads list from database based on filters and pagination.
   *
   * @param {Object} [params] - Query parameters (status, search, page, limit).
   * @returns {Promise<Object>} Axios unwrapped response data payload.
   */
  getLeads: async (params) => {
    const response = await api.get('/api/leads', { params });
    return response.data;
  },

  /**
   * Creates a new lead document.
   *
   * @param {Object} leadData - Lead data object.
   * @returns {Promise<Object>} Axios unwrapped response data payload.
   */
  createLead: async (leadData) => {
    const response = await api.post('/api/leads', leadData);
    return response.data;
  },

  /**
   * Updates an existing lead's fields by id.
   *
   * @param {string} id - Lead MongoDB ObjectId.
   * @param {Object} leadData - Updated lead data fields.
   * @returns {Promise<Object>} Axios unwrapped response data payload.
   */
  updateLead: async (id, leadData) => {
    const response = await api.put(`/api/leads/${id}`, leadData);
    return response.data;
  },

  /**
   * Performs quick patch status transitions on a lead.
   *
   * @param {string} id - Lead MongoDB ObjectId.
   * @param {string} status - Target status string.
   * @returns {Promise<Object>} Axios unwrapped response data payload.
   */
  updateLeadStatus: async (id, status) => {
    const response = await api.patch(`/api/leads/${id}/status`, { status });
    return response.data;
  },

  /**
   * Deletes a lead by id.
   *
   * @param {string} id - Lead MongoDB ObjectId.
   * @returns {Promise<Object>} Axios unwrapped response data payload.
   */
  deleteLead: async (id) => {
    const response = await api.delete(`/api/leads/${id}`);
    return response.data;
  },

  /**
   * Retrieves dashboard aggregated lead statistics summaries.
   *
   * @returns {Promise<Object>} Axios unwrapped response data payload.
   */
  getLeadStats: async () => {
    const response = await api.get('/api/leads/stats/summary');
    return response.data;
  },

  /**
   * Retrieves monthly leads creation statistics for trend charts.
   *
   * @returns {Promise<Object>} Axios unwrapped response data payload.
   */
  getMonthlyStats: async () => {
    const response = await api.get('/api/leads/stats/monthly');
    return response.data;
  }
};

export default leadService;
