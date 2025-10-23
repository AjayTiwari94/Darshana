const axios = require('axios');

// Create an axios instance with a baseURL
const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('Base URL:', apiClient.defaults.baseURL);

// Test different URL patterns
console.log('\nTesting URL construction:');

// Test 1: Relative path (should use baseURL)
apiClient.get('auth/login')
  .then(response => console.log('Relative path result:', response.config.url))
  .catch(error => console.log('Relative path error:', error.message));

// Test 2: Path starting with / (treated as absolute)
apiClient.get('/auth/login')
  .then(response => console.log('Absolute path result:', response.config.url))
  .catch(error => console.log('Absolute path error:', error.message));

// Test 3: Full URL (should ignore baseURL)
apiClient.get('http://localhost:5000/auth/login')
  .then(response => console.log('Full URL result:', response.config.url))
  .catch(error => console.log('Full URL error:', error.message));