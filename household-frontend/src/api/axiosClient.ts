import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getStoredToken = () => {
  // Primary key used by this app
  const token = localStorage.getItem('token');
  if (token && token !== 'undefined' && token !== 'null') return token;

  // Backward-compat for older builds/configs
  const legacy = localStorage.getItem('accessToken') || localStorage.getItem('authToken');
  if (legacy && legacy !== 'undefined' && legacy !== 'null') {
    localStorage.setItem('token', legacy);
    return legacy;
  }

  return null;
};

// Request interceptor to add bearer token
axiosClient.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      // Axios may represent headers as a plain object or AxiosHeaders.
      // Set it in a way that's resilient across versions.
      const headers = (config.headers ?? ({} as any)) as any;
      if (headers && typeof headers.set === 'function') {
        headers.set('Authorization', `Bearer ${token}`);
      } else {
        headers.Authorization = `Bearer ${token}`;
      }
      config.headers = headers;
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
    const status = error.response?.status;

    // If token is stale/invalid, stop noisy 401 loops by clearing auth state.
    // Let the user login again.
    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');

      if (typeof window !== 'undefined' && window.location?.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Build a normalized error object so UI code can always read the same fields
    const normalized = {
      // network-level error (no response) like CORS, no connection, timeout
      isNetworkError: !error.response,
      // HTTP status if available
      status,
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
