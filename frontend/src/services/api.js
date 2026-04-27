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

      if (requiresAuth) {
              const token = localStorage.getItem('healrec_token');
              if (token) {
                        config.headers['Authorization'] = `Bearer ${token}`;
              }
      }

      if (body) {
              config.body = JSON.stringify(body);
              config.headers['Content-Type'] = 'application/json';
      }

      try {
              const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
              const data = await response.json();
              if (!response.ok) throw new Error(data.message || 'API request failed');
              return data;
      } catch (error) {
              console.error('API request error:', error);
              throw error;
      }
};

export const authAPI = {
      login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: credentials, requiresAuth: false }),
      register: (userData) => apiRequest('/auth/register', { method: 'POST', body: userData, requiresAuth: false }),
      getProfile: () => apiRequest('/auth/profile'),
      updateProfile: (data) => apiRequest('/auth/profile', { method: 'PUT', body: data })
};

export const medicationsAPI = {
      getAll: () => apiRequest('/medications'),
      getById: (id) => apiRequest(`/medications/${id}`),
      create: (data) => apiRequest('/medications', { method: 'POST', body: data }),
      update: (id, data) => apiRequest(`/medications/${id}`, { method: 'PUT', body: data }),
      delete: (id) => apiRequest(`/medications/${id}`, { method: 'DELETE' })
};

export const appointmentsAPI = {
      getAll: () => apiRequest('/appointments'),
      getById: (id) => apiRequest(`/appointments/${id}`),
      create: (data) => apiRequest('/appointments', { method: 'POST', body: data }),
      update: (id, data) => apiRequest(`/appointments/${id}`, { method: 'PUT', body: data }),
      delete: (id) => apiRequest(`/appointments/${id}`, { method: 'DELETE' })
};

export const reportsAPI = {
      getAll: () => apiRequest('/reports'),
      getById: (id) => apiRequest(`/reports/${id}`),
      upload: (formData) => {
              const token = localStorage.getItem('healrec_token');
              return fetch(`${API_BASE_URL}/reports/upload`, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${token}` },
                        body: formData
              }).then(res => res.json());
      },
      delete: (id) => apiRequest(`/reports/${id}`, { method: 'DELETE' })
};

export const healthAPI = {
      getSummary: () => apiRequest('/health/summary'),
      updateMetrics: (data) => apiRequest('/health/metrics', { method: 'POST', body: data }),
      getHistory: (metric) => apiRequest(`/health/history/${metric}`)
};

export const telemedicineAPI = {
      getAvailableDoctors: () => apiRequest('/telemedicine/doctors'),
      bookAppointment: (data) => apiRequest('/telemedicine/book', { method: 'POST', body: data }),
      getMeetings: () => apiRequest('/telemedicine/meetings')
};

export const emergencyAPI = {
      getContacts: () => apiRequest('/emergency/contacts'),
      updateContacts: (data) => apiRequest('/emergency/contacts', { method: 'PUT', body: data }),
      triggerAlert: (data) => apiRequest('/emergency/alert', { method: 'POST', body: data })
};

export const familyAPI = {
      getMembers: () => apiRequest('/family/members'),
      addMember: (data) => apiRequest('/family/members', { method: 'POST', body: data }),
      updateMember: (id, data) => apiRequest(`/family/members/${id}`, { method: 'PUT', body: data }),
      deleteMember: (id) => apiRequest(`/family/members/${id}`, { method: 'DELETE' })
};

export const labAPI = {
      getTests: () => apiRequest('/lab/tests'),
      bookTest: (data) => apiRequest('/lab/book', { method: 'POST', body: data }),
      getResults: () => apiRequest('/lab/results')
};

export const apiUtils = {
      formatDate: (date) => new Date(date).toLocaleDateString(),
      formatCurrency: (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
};

