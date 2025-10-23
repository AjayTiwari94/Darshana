const axios = require('axios');

// Simulate the API client configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Test the URL construction
console.log('Base URL:', apiClient.defaults.baseURL);

// Test a request to see what URL is actually being called
apiClient.interceptors.request.use(
  (config) => {
    console.log('Request URL:', config.baseURL + config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Test the API functions
const api = {
  post: (url, data) => apiClient.post(url, data).then((res) => res.data),
};

// Test the auth login call
console.log('\nTesting auth login call...');
api.post('/auth/login', { email: 'test@example.com', password: 'password' })
  .then(response => console.log('Success:', response))
  .catch(error => console.log('Error:', error.message));