import { forceUpdateActivity } from './auth';

// API configuration for different environments
const getApiBaseUrl = () => {
  // In production, use environment variable if provided
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // For development, check if we're on localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5001';
  }

  // Default fallback for ibsdo.com - use HTTPS reverse proxy
  return 'https://ibsdo.com/true-visions-api';
};

export const API_BASE_URL = getApiBaseUrl();

// Get auth headers with token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Handle unauthorized responses (401) - redirect to login
const handleUnauthorized = (response) => {
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('sessionTimeout');
    localStorage.removeItem('lastActivity');
    window.location.href = 'https://ibsdo.com/true-visions-pms/';
    return true;
  }
  return false;
};

// Helper function for making API requests with authentication
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, defaultOptions);

    // Update activity on every API call (user is actively using the system)
    // Skip for login endpoint to avoid issues before auth is established
    if (!endpoint.includes('/login')) {
      forceUpdateActivity();
    }

    // Check for unauthorized and redirect to login
    if (handleUnauthorized(response)) {
      throw new Error('Unauthorized - redirecting to login');
    }

    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Convenience methods for common HTTP methods
export const apiGet = async (endpoint) => {
  const response = await apiRequest(endpoint, { method: 'GET' });
  return response.json();
};

export const apiPost = async (endpoint, data) => {
  const response = await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return response.json();
};

export const apiPut = async (endpoint, data) => {
  const response = await apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  return response.json();
};

export const apiDelete = async (endpoint) => {
  const response = await apiRequest(endpoint, { method: 'DELETE' });
  return response.json();
};

export default API_BASE_URL;