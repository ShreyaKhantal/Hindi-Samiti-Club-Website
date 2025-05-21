import { login as apiLogin } from './api';

// Handle admin login
export const login = async (username, password) => {
  try {
    // Call the login API endpoint
    const response = await apiLogin({ username, password });
    
    // Store token in localStorage
    if (response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('authUser', JSON.stringify({
        username: response.username
      }));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
};

// Check if user is authenticated
export const checkAuth = async () => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    return false;
  }
  
  // You could verify the token with a backend call here
  // For now, we'll just check if it exists
  
  // Optional: Check token expiration if your token has that info
  // const tokenData = parseJwt(token);
  // if (tokenData.exp * 1000 < Date.now()) {
  //   logout();
  //   return false;
  // }
  
  return true;
};

// Parse JWT token (helper function)
export const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

// Get current authenticated user info
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('authUser');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

// Logout
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('authUser');
};

export default { login, checkAuth, getCurrentUser, logout };