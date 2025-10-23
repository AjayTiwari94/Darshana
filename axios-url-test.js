const axios = require('axios');

// Create an axios instance with a baseURL
const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('Base URL:', apiClient.defaults.baseURL);

// Add a request interceptor to log the actual URL being called
apiClient.interceptors.request.use(
  (config) => {
    console.log('Actual URL being called:', config.url);
    console.log('Base URL in config:', config.baseURL);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Test different URL patterns
console.log('\nTesting URL construction:');

// Test 1: Relative path (should use baseURL)
console.log('\n1. Relative path (no leading slash):');
apiClient.get('auth/login')
  .then(response => console.log('Success'))
  .catch(error => console.log('Error:', error.message));

// Test 2: Path starting with / (treated as absolute)
console.log('\n2. Absolute path (leading slash):');
apiClient.get('/auth/login')
  .then(response => console.log('Success'))
  .catch(error => console.log('Error:', error.message));