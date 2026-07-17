import axios from 'axios';
import { toast } from 'react-hot-toast';

// Setup api url connection fallback
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Global Axios Instance preconfigured with base url.
 */
const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Request Interceptor: Automatically injects JWT Bearer token into headers if stored.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('crm-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor: Catches 401 sessions expiration and network connectivity failures.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 1. Check for global network error (no response received)
    if (!error.response) {
      return Promise.reject(error);
    }

    const { status } = error.response;

    // 2. Handle unauthorized/expired token credentials
    if (status === 401) {
      localStorage.removeItem('crm-token');
      // Force page redirection to clean up auth paths
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
