// Test the fixed API implementation
const axios = require('axios');

// Simulate the fixed API implementation
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add a request interceptor to log the actual URL being called
apiClient.interceptors.request.use(
  (config) => {
    console.log('Actual URL being called:', config.baseURL + config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Fixed API functions with URL normalization
const api = {
  get: (url) => {
    // Ensure URL doesn't start with / when using baseURL
    const normalizedUrl = url.startsWith('/') ? url.substring(1) : url;
    console.log('Making GET request to normalized URL:', normalizedUrl);
    return apiClient.get(normalizedUrl).then((res) => res.data);
  },
  post: (url, data) => {
    // Ensure URL doesn't start with / when using baseURL
    const normalizedUrl = url.startsWith('/') ? url.substring(1) : url;
    console.log('Making POST request to normalized URL:', normalizedUrl);
    return apiClient.post(normalizedUrl, data).then((res) => res.data);
  },
  put: (url, data) => {
    // Ensure URL doesn't start with / when using baseURL
    const normalizedUrl = url.startsWith('/') ? url.substring(1) : url;
    console.log('Making PUT request to normalized URL:', normalizedUrl);
    return apiClient.put(normalizedUrl, data).then((res) => res.data);
  },
  delete: (url) => {
    // Ensure URL doesn't start with / when using baseURL
    const normalizedUrl = url.startsWith('/') ? url.substring(1) : url;
    console.log('Making DELETE request to normalized URL:', normalizedUrl);
    return apiClient.delete(normalizedUrl).then((res) => res.data);
  },
};

// Test the auth login call with the fixed implementation
console.log('Testing fixed auth login call...');
api.post('/auth/login', { email: 'explorer@example.com', password: 'explorer123' })
  .then(response => console.log('Success:', response))
  .catch(error => console.log('Error:', error.message));