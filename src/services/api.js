import axios from 'axios';

// Resolve API base URL: prioritize VITE_API_BASE_URL, fallback to live Render URL
const defaultProdUrl = 'https://startup-crm-lite-1eb3.onrender.com';
const envUrl = import.meta.env.VITE_API_BASE_URL;
const rawUrl = (envUrl && envUrl.trim() !== '') ? envUrl : defaultProdUrl;

// Format baseURL: remove trailing slashes and ensure /api suffix is stripped so /api routes do not duplicate
let baseURL = rawUrl.trim().replace(/\/+$/, '');
if (baseURL.endsWith('/api')) {
  baseURL = baseURL.slice(0, -4);
}

/**
 * Global Axios Instance preconfigured with base url.
 */
const api = axios.create({
  baseURL,
  timeout: 30000,
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
