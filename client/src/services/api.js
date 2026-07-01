import axios from 'axios';

// Create an instance of axios with base configurations
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Crucial to allow HTTP-only cookies to be sent/received
});

// Interceptor to handle responses globally (e.g. logouts on 401s)
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // If the backend returns a 401 Unauthorized, we know the session has expired
    if (error.response && error.response.status === 401) {
      // Clear any client side local state if required, and redirect to login
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        window.location.href = '/login?expired=true';
      }
    }
    
    // Normalize errors to return the message from the backend if available
    const message = error.response?.data?.message || 'Something went wrong. Please try again.';
    return Promise.reject({
      message,
      status: error.response?.status,
      data: error.response?.data,
      originalError: error,
    });
  }
);

export default api;
