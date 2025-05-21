import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api', // Assuming API is served at /api
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add authentication token to each request if available
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Home Content API
export const fetchIntro = async () => {
  const response = await api.get('/intro');
  return response.data;
};

export const updateIntro = async (introData) => {
  const response = await api.put('/intro/1', introData);
  return response.data;
};

export const fetchImages = async () => {
  const response = await api.get('/images');
  return response.data;
};

export const uploadImage = async (formData) => {
  const response = await api.post('/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const deleteImage = async (imageId) => {
  const response = await api.delete(`/images/${imageId}`);
  return response.data;
};

// Events API
export const fetchEvents = async (includeFormFields = true) => {
  const response = await api.get('/events', {
    params: { include_form_fields: includeFormFields }
  });
  return response.data;
};

export const fetchEvent = async (eventId) => {
  const response = await api.get(`/events/${eventId}`);
  return response.data;
};

export const createEvent = async (eventData) => {
  const response = await api.post('/events', eventData);
  return response.data;
};

export const updateEvent = async (eventId, eventData) => {
  const response = await api.put(`/events/${eventId}`, eventData);
  return response.data;
};

export const deleteEvent = async (eventId) => {
  const response = await api.delete(`/events/${eventId}`);
  return response.data;
};

// Registrations API
export const fetchRegistrations = async (eventId) => {
  const response = await api.get(`/events/${eventId}/registrations`);
  return response.data;
};

export const checkRegistration = async (eventId, email) => {
  try {
    const response = await api.get(`/events/${eventId}/check-registration`, {
      params: { email }
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null; // Not registered
    }
    throw error;
  }
};

export const createRegistration = async (eventId, registrationData) => {
  const response = await api.post(`/events/${eventId}/registrations`, registrationData);
  return response.data;
};

export const updateRegistrationStatus = async (registrationId, status) => {
  const response = await api.patch(`/registrations/${registrationId}`, { status });
  return response.data;
};

export const downloadRegistrationsExcel = async (eventId) => {
  const response = await api.get(`/events/${eventId}/registrations/excel`, {
    responseType: 'blob'
  });
  
  // Create a blob link to download
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `registrations-event-${eventId}.xlsx`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

// Team API
export const fetchTeamMembers = async () => {
  const response = await api.get('/team-members');
  return response.data;
};

export const createTeamMember = async (memberData) => {
  const response = await api.post('/team-members', memberData);
  return response.data;
};

export const updateTeamMember = async (memberId, memberData) => {
  const response = await api.put(`/team-members/${memberId}`, memberData);
  return response.data;
};

export const deleteTeamMember = async (memberId) => {
  const response = await api.delete(`/team-members/${memberId}`);
  return response.data;
};

// Contact API
export const fetchContactInfo = async () => {
  const response = await api.get('/contact-info');
  return response.data;
};

// Authentication API
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export default api;