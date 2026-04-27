// API Service for Frontend-Backend Communication

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
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
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  // Add body for non-GET requests
  if (body && method !== 'GET') {
    if (body instanceof FormData) {
      // Let browser set Content-Type with boundary for multipart
      config.body = body;
    } else {
      config.headers['Content-Type'] = 'application/json';
      config.body = JSON.stringify(body);
    }
  } else {
    config.headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle different response types
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API functions
export const authAPI = {
  login: async (email, password) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password },
      requiresAuth: false
    });
    
    if (response.success) {
      localStorage.setItem('healrec_token', response.data.token);
      localStorage.setItem('healrec_user', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  register: async (userData) => {
    return await apiRequest('/auth/register', {
      method: 'POST',
      body: userData,
      requiresAuth: false
    });
  },

  getProfile: async () => {
    return await apiRequest('/auth/me');
  },

  updateProfile: async (profileData) => {
    return await apiRequest('/auth/profile', {
      method: 'PUT',
      body: profileData
    });
  },

  forgotPassword: async (email) => {
    return await apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: { email },
      requiresAuth: false
    });
  },

  resetPassword: async (token, password) => {
    return await apiRequest('/auth/reset-password', {
      method: 'POST',
      body: { token, password },
      requiresAuth: false
    });
  }
};

// Health Tracking API functions
export const healthAPI = {
  getMetrics: async () => {
    return await apiRequest('/health/metrics');
  },

  addMetric: async (metricData) => {
    return await apiRequest('/health/metrics', {
      method: 'POST',
      body: metricData
    });
  },

  getTrends: async (period = 'week', metric = 'all') => {
    return await apiRequest(`/health/trends?period=${period}&metric=${metric}`);
  },

  getPredictions: async () => {
    return await apiRequest('/health/predictions');
  },

  getDevices: async () => {
    return await apiRequest('/health/devices');
  },

  syncDevice: async (deviceId, deviceType, data) => {
    return await apiRequest('/health/devices/sync', {
      method: 'POST',
      body: { deviceId, deviceType, data }
    });
  }
};

// Medications API functions
export const medicationsAPI = {
  getMedications: async (page = 1, limit = 10, status = 'all', search = '') => {
    const params = new URLSearchParams({
      page,
      limit,
      status,
      search
    });
    return await apiRequest(`/medications?${params}`);
  },

  addMedication: async (medicationData) => {
    return await apiRequest('/medications', {
      method: 'POST',
      body: medicationData
    });
  },

  updateMedication: async (id, medicationData) => {
    return await apiRequest(`/medications/${id}`, {
      method: 'PUT',
      body: medicationData
    });
  },

  deleteMedication: async (id) => {
    return await apiRequest(`/medications/${id}`, {
      method: 'DELETE'
    });
  },

  takeMedication: async (id) => {
    return await apiRequest(`/medications/${id}/take`, {
      method: 'POST'
    });
  }
};

// Appointments API functions
export const appointmentAPI = {
  getAppointments: async (status = 'upcoming', page = 1, limit = 10) => {
    const params = new URLSearchParams({
      status,
      page,
      limit
    });
    return await apiRequest(`/appointments?${params}`);
  },

  scheduleAppointment: async (appointmentData) => {
    return await apiRequest('/appointments', {
      method: 'POST',
      body: appointmentData
    });
  },

  updateAppointment: async (id, appointmentData) => {
    return await apiRequest(`/appointments/${id}`, {
      method: 'PUT',
      body: appointmentData
    });
  },

  cancelAppointment: async (id) => {
    return await apiRequest(`/appointments/${id}`, {
      method: 'DELETE'
    });
  },

  getAvailableSlots: async (doctorId, date, specialty) => {
    const params = new URLSearchParams({
      doctorId,
      date,
      specialty
    });
    return await apiRequest(`/appointments/available-slots?${params}`);
  },

  joinVideoCall: async (id) => {
    return await apiRequest(`/appointments/${id}/join-video`, {
      method: 'POST'
    });
  }
};

// Reports API functions
export const reportAPI = {
  getReports: async (page = 1, limit = 10, status = 'all', search = '', type = '') => {
    const params = new URLSearchParams({
      page,
      limit,
      status,
      search,
      type
    });
    return await apiRequest(`/reports?${params}`);
  },

  uploadReport: async (reportData) => {
    const formData = new FormData();
    Object.keys(reportData).forEach(key => {
      if (key !== 'file') {
        formData.append(key, reportData[key]);
      }
    });
    if (reportData.file) {
      formData.append('file', reportData.file);
    }

    return await apiRequest('/reports', {
      method: 'POST',
      body: formData
    });
  },

  getReport: async (id) => {
    return await apiRequest(`/reports/${id}`);
  },

  updateReport: async (id, reportData) => {
    return await apiRequest(`/reports/${id}`, {
      method: 'PUT',
      body: reportData
    });
  },

  deleteReport: async (id) => {
    return await apiRequest(`/reports/${id}`, {
      method: 'DELETE'
    });
  },

  getReportTypes: async () => {
    return await apiRequest('/reports/types');
  },

  shareReport: async (id, shareData) => {
    return await apiRequest(`/reports/${id}/share`, {
      method: 'POST',
      body: shareData
    });
  }
};

// Telemedicine API functions
export const telemedicineAPI = {
  getDoctors: async (specialty = '', search = '', page = 1, limit = 10) => {
    const params = new URLSearchParams({
      specialty,
      search,
      page,
      limit
    });
    return await apiRequest(`/telemedicine/doctors?${params}`);
  },

  getConsultations: async (status = 'all', page = 1, limit = 10) => {
    const params = new URLSearchParams({
      status,
      page,
      limit
    });
    return await apiRequest(`/telemedicine/consultations?${params}`);
  },

  scheduleConsultation: async (consultationData) => {
    return await apiRequest('/telemedicine/consultations', {
      method: 'POST',
      body: consultationData
    });
  },

  joinVideoRoom: async (roomId) => {
    return await apiRequest(`/telemedicine/rooms/${roomId}/join`, {
      method: 'POST'
    });
  },

  endConsultation: async (roomId, data) => {
    return await apiRequest(`/telemedicine/rooms/${roomId}/end`, {
      method: 'POST',
      body: data
    });
  },

  getSpecialties: async () => {
    return await apiRequest('/telemedicine/specialties');
  },

  sendPrescription: async (consultationId, prescriptionData) => {
    return await apiRequest('/telemedicine/prescriptions', {
      method: 'POST',
      body: {
        consultationId,
        medications: prescriptionData.medications,
        pharmacy: prescriptionData.pharmacy,
        notes: prescriptionData.notes
      }
    });
  }
};

// Emergency API functions
export const emergencyAPI = {
  triggerSOS: async (location, emergencyType, notes) => {
    return await apiRequest('/emergency/sos', {
      method: 'POST',
      body: { location, emergencyType, notes }
    });
  },

  getContacts: async () => {
    return await apiRequest('/emergency/contacts');
  },

  addContact: async (contactData) => {
    return await apiRequest('/emergency/contacts', {
      method: 'POST',
      body: contactData
    });
  },

  getMedicalInfo: async () => {
    return await apiRequest('/emergency/medical-info');
  },

  getHospitals: async (latitude, longitude, radius = 10) => {
    const params = new URLSearchParams({
      latitude,
      longitude,
      radius
    });
    return await apiRequest(`/emergency/hospitals?${params}`);
  },

  getProtocols: async () => {
    return await apiRequest('/emergency/protocols');
  },

  testAlert: async (contactId, message) => {
    return await apiRequest('/emergency/test-alert', {
      method: 'POST',
      body: { contactId, message }
    });
  },

  getLocation: async () => {
    return await apiRequest('/emergency/location');
  }
};

// Family Management API functions
export const familyAPI = {
  getMembers: async () => {
    return await apiRequest('/family/members');
  },

  inviteMember: async (inviteData) => {
    return await apiRequest('/family/invite', {
      method: 'POST',
      body: inviteData
    });
  },

  getInvites: async () => {
    return await apiRequest('/family/invites');
  },

  updatePermissions: async (memberId, permissions) => {
    return await apiRequest(`/family/members/${memberId}/permissions`, {
      method: 'PUT',
      body: { permissions }
    });
  },

  getActivities: async (page = 1, limit = 10, member = '') => {
    const params = new URLSearchParams({
      page,
      limit,
      member
    });
    return await apiRequest(`/family/activities?${params}`);
  },

  logActivity: async (activityData) => {
    return await apiRequest('/family/activities', {
      method: 'POST',
      body: activityData
    });
  },

  getHealthAlerts: async () => {
    return await apiRequest('/family/health-alerts');
  },

  removeMember: async (memberId) => {
    return await apiRequest(`/family/members/${memberId}`, {
      method: 'DELETE'
    });
  },

  shareData: async (memberId, shareData) => {
    return await apiRequest(`/family/members/${memberId}/share-data`, {
      method: 'POST',
      body: shareData
    });
  }
};

// Lab Portal API functions
export const labAPI = {
  getReports: async (page = 1, limit = 10, status = 'all', search = '') => {
    const params = new URLSearchParams({
      page,
      limit,
      status,
      search
    });
    return await apiRequest(`/lab/reports?${params}`);
  },

  uploadReport: async (reportData) => {
    const formData = new FormData();
    Object.keys(reportData).forEach(key => {
      if (key !== 'file') {
        formData.append(key, reportData[key]);
      }
    });
    if (reportData.file) {
      formData.append('file', reportData.file);
    }

    return await apiRequest('/lab/reports', {
      method: 'POST',
      body: formData
    });
  },

  getReport: async (id) => {
    return await apiRequest(`/lab/reports/${id}`);
  },

  updateReport: async (id, reportData) => {
    return await apiRequest(`/lab/reports/${id}`, {
      method: 'PUT',
      body: reportData
    });
  },

  getPatients: async (page = 1, limit = 10, search = '') => {
    const params = new URLSearchParams({
      page,
      limit,
      search
    });
    return await apiRequest(`/lab/patients?${params}`);
  },

  orderTest: async (testData) => {
    return await apiRequest('/lab/tests', {
      method: 'POST',
      body: testData
    });
  },

  getTests: async (status = 'all', page = 1, limit = 10) => {
    const params = new URLSearchParams({
      status,
      page,
      limit
    });
    return await apiRequest(`/lab/tests?${params}`);
  },

  getTestTypes: async () => {
    return await apiRequest('/lab/test-types');
  },

  addTestResults: async (testId, resultsData) => {
    return await apiRequest('/lab/results', {
      method: 'POST',
      body: {
        testId,
        results: resultsData.results,
        status: resultsData.status,
        notes: resultsData.notes
      }
    });
  },

  getStatistics: async (period = 'month') => {
    return await apiRequest(`/lab/statistics?period=${period}`);
  }
};

// Utility functions
export const apiUtils = {
  // Handle API errors consistently
  handleError: (error, customMessage = '') => {
    const message = error.message || customMessage || 'An error occurred';
    console.error('API Error:', error);
    
    // Show user-friendly error message
    if (error.status === 401) {
      return 'Your session has expired. Please log in again.';
    } else if (error.status === 403) {
      return 'You do not have permission to perform this action.';
    } else if (error.status === 404) {
      return 'The requested resource was not found.';
    } else if (error.status >= 500) {
      return 'Server error. Please try again later.';
    }
    
    return message;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('healrec_token');
    const user = localStorage.getItem('healrec_user');
    return !!(token && user);
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('healrec_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Clear authentication
  logout: () => {
    localStorage.removeItem('healrec_token');
    localStorage.removeItem('healrec_user');
  },

  // Format date for display
  formatDate: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  // Format time for display
  formatTime: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};

export default {
  apiRequest,
  authAPI,
  healthAPI,
  medicationsAPI,
  appointmentAPI,
  reportAPI,
  telemedicineAPI,
  emergencyAPI,
  familyAPI,
  labAPI,
  apiUtils
};
