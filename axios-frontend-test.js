// Test the axios configuration that matches our frontend
const axios = require('axios');

// Set the environment variable (simulating NEXT_PUBLIC_API_URL)
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:5000';

// Create an axios instance with the same configuration as our frontend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add logging to see what URLs are being called
apiClient.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.baseURL + (config.url.startsWith('/') ? config.url : '/' + config.url));
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API functions with URL normalization (same as our frontend)
const api = {
  post: (url, data) => {
    // Ensure URL doesn't start with / when using baseURL
    const normalizedUrl = url.startsWith('/') ? url.substring(1) : url;
    console.log('Normalized URL:', normalizedUrl);
    return apiClient.post(normalizedUrl, data).then((res) => res.data);
  },
};

// Test the login with the correct path
async function testLogin() {
  console.log('Testing frontend-like login...');
  
  try {
    const result = await api.post('/api/auth/login', {
      email: 'explorer@example.com',
      password: 'explorer123'
    });
    console.log('SUCCESS: Login worked correctly!');
    console.log('Response:', result);
  } catch (error) {
    console.error('FAILED: Login failed');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testLogin();