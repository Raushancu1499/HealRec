// API Service for Frontend-Backend Communication

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Generic API request function
export const apiRequest = async (endpoint, options = {}) => {
    const {
          method = 'GET',
          headers = {},
          body = null,
          requiresAuth = true
    } = options;

    const config = {
          method,
          headers: {
                  ...headers
          }
    };

    // Add authentication token if required
    if (requiresAuth) {
          const token = localStorage.getItem('healrec_token');
          if (token) {
                  config.headers['Authorization'] = `Bearer ${token}`;
          }
    }

    // Handle JSON body
    if (body) {
          config.body = JSON.stringify(body);
          config.headers['Content-Type'] = 'application/json';
    }

    try {
          const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
          const data = await response.json();

      if (!response.ok) {
              throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
          console.error('API request error:', error);
          throw error;
    }
};
