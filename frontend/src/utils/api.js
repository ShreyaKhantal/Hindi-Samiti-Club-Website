import axios from 'axios';

// Configuration - Update these URLs to match your backend
const API_BASE_URL = 'http://localhost:5000'; // Your Flask backend URL
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
  const token = localStorage.getItem('authToken');
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
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===================== FIXED IMAGE URL PROCESSING =====================

/**
 * Convert relative image URL to absolute URL
 * @param {string} imageUrl - Relative image URL from database
 * @returns {string} - Absolute URL for frontend consumption
 */
export const getAbsoluteImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  console.log(`🔧 Processing image URL: ${imageUrl}`);
  
  // If already absolute URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    console.log(`   Already absolute: ${imageUrl}`);
    return imageUrl;
  }
  
  // If relative URL starting with /, prepend base URL
  if (imageUrl.startsWith('/')) {
    const absoluteUrl = `${API_BASE_URL}${imageUrl}`;
    console.log(`   Made absolute: ${absoluteUrl}`);
    return absoluteUrl;
  }
  
  // If just filename or relative path, prepend base URL with slash
  const absoluteUrl = `${API_BASE_URL}/${imageUrl}`;
  console.log(`   Added base URL: ${absoluteUrl}`);
  return absoluteUrl;
};

/**
 * Process team members data to fix image URLs
 * @param {Array} teamMembers - Team members array from API
 * @returns {Array} - Team members with corrected image URLs
 */
export const processTeamMembersImages = (teamMembers) => {
  console.log('🔄 Processing team members images...');
  
  return teamMembers.map(member => {
    const originalUrl = member.image_url;
    const processedUrl = getAbsoluteImageUrl(originalUrl);
    
    console.log(`👤 ${member.name}:`);
    console.log(`   Original: ${originalUrl || 'null'}`);
    console.log(`   Processed: ${processedUrl || 'null'}`);
    
    return {
      ...member,
      image_url: processedUrl
    };
  });
};

// ===================== FIXED PUBLIC APIs =====================

// Public Team Members with corrected image URLs
export const fetchPublicTeamMembers = async () => {
  try {
    console.log('📡 Fetching public team members...');
    const response = await api.get('/team-members');
    const teamMembers = response.data;
    
    console.log('📥 Raw team members from API:', teamMembers);
    
    // Process image URLs to make them absolute
    const processedTeamMembers = processTeamMembersImages(teamMembers);
    
    console.log('✅ Processed team members:', processedTeamMembers);
    
    return processedTeamMembers;
  } catch (error) {
    console.error('❌ Error fetching team members:', error);
    throw error;
  }
};

// ===================== FIXED ADMIN TEAM APIs =====================

export const fetchTeamMembers = async () => {
  try {
    console.log('📡 Fetching admin team members...');
    const response = await api.get('/admin/team');
    const teamMembers = response.data;
    
    console.log('📥 Raw admin team members from API:', teamMembers);
    
    // Process image URLs for admin side too
    const processedTeamMembers = processTeamMembersImages(teamMembers);
    
    console.log('✅ Processed admin team members:', processedTeamMembers);
    
    return processedTeamMembers;
  } catch (error) {
    console.error('❌ Error fetching admin team members:', error);
    throw error;
  }
};

// ===================== FIXED IMAGE DEBUGGING FUNCTION =====================

/**
 * Debug function to check if image URLs are accessible
 * @param {string} imageUrl - Image URL to test
 * @returns {Promise<boolean>} - Whether image is accessible
 */
export const testImageUrl = async (imageUrl) => {
  // First, make sure we're testing the absolute URL
  const absoluteUrl = getAbsoluteImageUrl(imageUrl);
  
  console.log(`🧪 Testing image URL:`);
  console.log(`   Original: ${imageUrl}`);
  console.log(`   Testing: ${absoluteUrl}`);
  
  try {
    const response = await fetch(absoluteUrl, { method: 'HEAD' });
    const success = response.ok;
    console.log(`   Result: ${success ? 'SUCCESS' : 'FAILED'} (${response.status})`);
    return success;
  } catch (error) {
    console.error(`   Network error:`, error);
    return false;
  }
};

// ===================== ALL YOUR OTHER API FUNCTIONS =====================
// (Keep all your existing functions unchanged)

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

// Auth APIs
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    if (response.data?.success && response.data?.access_token) {
      localStorage.setItem('authToken', response.data.access_token);
      return response.data;
    } else {
      throw new Error(response.data?.message || 'Login failed');
    }
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Login failed. Please try again.');
  }
};

export const verifyToken = async () => {
  const response = await api.get('/admin/verify-token');
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('authToken');
  window.location.href = '/login';
};

// Admin Content APIs
export const fetchIntro = async () => {
  const response = await api.get('/admin/intro');
  return response.data;
};

export const updateIntro = async (introData) => {
  const response = await api.put('/admin/intro', introData);
  return response.data;
};

export const fetchImages = async () => {
  const response = await api.get('/admin/images');
  return response.data;
};

export const uploadImage = async (formData) => {
  const response = await api.post('/admin/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const deleteImage = async (imageId) => {
  const response = await api.delete(`/admin/images/${imageId}`);
  return response.data;
};

// Admin Events APIs
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

// Admin Registration APIs
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

// Admin Team APIs
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

// Utility functions
export const isAuthenticated = () => {
  return localStorage.getItem('authToken') !== null;
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

export const clearAuthToken = () => {
  localStorage.removeItem('authToken');
};

export const getApiBaseUrl = () => {
  return API_BASE_URL;
};

export const viewScreenshot = async (registrationId) => {
  const token = localStorage.getItem('authToken');

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