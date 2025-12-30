import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add bearer token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to normalize errors for the UI
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Build a normalized error object so UI code can always read the same fields
    const normalized = {
      // network-level error (no response) like CORS, no connection, timeout
      isNetworkError: !error.response,
      // HTTP status if available
      status: error.response?.status,
      // Prefer server-provided message, fall back to axios message
      message:
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Unknown error',
      // any additional data from the server
      data: error.response?.data,
      // keep the original error for debugging when needed
      originalError: error,
    };

    // Log for development; this keeps network/CORS errors visible
    // eslint-disable-next-line no-console
    console.error('API error:', normalized);

    // Do NOT auto-redirect on 401 here. Let UI decide how to handle auth issues.
    return Promise.reject(normalized);
  }
);

export default axiosClient;
