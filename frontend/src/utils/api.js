import axios from 'axios';

// Configuration - Update these URLs to match your backend
const API_BASE_URL = 'http://localhost:5000'; // Change this to your Flask backend URL
const API_ENDPOINT = '/api';

// Axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}${API_ENDPOINT}`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Automatically attach token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken'); // Must match saved key
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, remove from localStorage
      localStorage.removeItem('authToken');
      // Optionally redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===================== PUBLIC APIs (No Authentication Required) =====================

// Public Intro
export const fetchPublicIntro = async () => {
  const response = await api.get('/intro');
  return response.data;
};

// Public Images
export const fetchPublicImages = async () => {
  const response = await api.get('/images');
  return response.data;
};

// Public Team Members
export const fetchPublicTeamMembers = async () => {
  const response = await api.get('/team-members');
  return response.data;
};

// Public Events
export const fetchPublicEvents = async (includeFormFields = false) => {
  const response = await api.get('/events', {
    params: { include_form_fields: includeFormFields }
  });
  return response.data;
};

// Public Event Details
export const fetchPublicEventDetails = async (eventId) => {
  const response = await api.get(`/events/${eventId}`);
  return response.data;
};

// ===================== AUTH APIs =====================

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);

    // Check if login was successful and token exists
    if (response.data?.success && response.data?.access_token) {
      localStorage.setItem('authToken', response.data.access_token);
      return response.data;
    } else {
      throw new Error(response.data?.message || 'Login failed');
    }
  } catch (error) {
    // Handle different error scenarios
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Login failed. Please try again.');
  }
};

// Verify Token
export const verifyToken = async () => {
  const response = await api.get('/admin/verify-token');
  return response.data;
};

// Logout (client-side only since there's no server logout endpoint)
export const logout = () => {
  localStorage.removeItem('authToken');
  window.location.href = '/login';
};

// ===================== ADMIN HOME CONTENT APIs =====================

// Intro
export const fetchIntro = async () => {
  const response = await api.get('/admin/intro');
  return response.data;
};

export const updateIntro = async (introData) => {
  const response = await api.put('/admin/intro', introData);
  return response.data;
};

// Images
export const fetchImages = async () => {
  const response = await api.get('/admin/images');
  return response.data;
};

export const uploadImage = async (formData) => {
  // For file uploads, we need to override the default Content-Type
  const response = await api.post('/admin/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const deleteImage = async (imageId) => {
  const response = await api.delete(`/admin/images/${imageId}`);
  return response.data;
};

// ===================== ADMIN EVENTS APIs =====================

export const fetchEvents = async () => {
  const response = await api.get('/admin/events');
  return response.data;
};

export const createEvent = async (eventData) => {
  const response = await api.post('/admin/events', eventData);
  return response.data;
};

export const updateEvent = async (eventId, eventData) => {
  const response = await api.put(`/admin/events/${eventId}`, eventData);
  return response.data;
};

export const deleteEvent = async (eventId) => {
  const response = await api.delete(`/admin/events/${eventId}`);
  return response.data;
};

// ===================== ADMIN REGISTRATION APIs =====================

export const fetchRegistrations = async (eventId) => {
  const response = await api.get(`/admin/registrations/${eventId}`);
  return response.data;
};

export const updateRegistrationStatus = async (registrationId, status) => {
  const response = await api.put(`/admin/registrations/${registrationId}/status`, { status });
  return response.data;
};

export const downloadRegistrationsExcel = async (eventId) => {
  try {
    const response = await api.get(`/admin/registrations/${eventId}/download`, {
      responseType: 'blob'
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Default to CSV extension
    let filename = `registrations_event_${eventId}_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.csv`;
    
    const contentDisposition = response.headers['content-disposition'];
    if (contentDisposition) {
      const matches = /filename="([^"]*)"/.exec(contentDisposition);
      if (matches != null && matches[1]) {
        filename = matches[1];
      }
    }
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return { success: true, message: 'Download started' };
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};

// ===================== ADMIN TEAM APIs =====================

export const fetchTeamMembers = async () => {
  const response = await api.get('/admin/team');
  return response.data;
};

export const createTeamMember = async (memberData) => {
  const response = await api.post('/admin/team', memberData);
  return response.data;
};

export const updateTeamMember = async (memberId, memberData) => {
  const response = await api.put(`/admin/team/${memberId}`, memberData);
  return response.data;
};

export const deleteTeamMember = async (memberId) => {
  const response = await api.delete(`/admin/team/${memberId}`);
  return response.data;
};

// ===================== UTILITY FUNCTIONS =====================

// Check if user is authenticated
export const isAuthenticated = () => {
  return localStorage.getItem('authToken') !== null;
};

// Get current auth token
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Set auth token manually (useful for testing or external auth flows)
export const setAuthToken = (token) => {
  localStorage.setAuthToken('authToken', token);
};

// Clear auth token manually
export const clearAuthToken = () => {
  localStorage.removeItem('authToken');
};

// Get API base URL (useful for constructing image URLs)
export const getApiBaseUrl = () => {
  return API_BASE_URL;
};

export const viewScreenshot = async (registrationId) => {
  const token = localStorage.getItem('authToken'); // or 'adminToken' if that's your storage key

  if (!token) {
    throw new Error('You are not authorized to view the screenshot.');
  }

  const response = await fetch(`${API_BASE_URL}/api/admin/registrations/${registrationId}/screenshot`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to load screenshot');
  }

  const blob = await response.blob();
  const imageUrl = URL.createObjectURL(blob);
  return imageUrl;
};


export default api;