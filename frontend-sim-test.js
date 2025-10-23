// Simulate the frontend environment more accurately
global.window = {
  localStorage: {
    getItem: (key) => {
      if (key === 'auth-storage') {
        return null; // No stored auth data
      }
      return null;
    },
    setItem: (key, value) => {},
    removeItem: (key) => {}
  }
};

global.document = {};

// Set the environment variable
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:5000';

// Simulate the API calls
async function testFrontendApi() {
  console.log('Testing frontend API calls...');
  
  try {
    // Dynamically import the API module with correct path
    const apiModule = require('./.next/server/pages/src/lib/api.js');
    const { api } = apiModule;
    
    console.log('Calling api.post with /api/auth/login');
    const result = await api.post('/api/auth/login', {
      email: 'explorer@example.com',
      password: 'explorer123'
    });
    console.log('Login result:', result);
    console.log('SUCCESS: Frontend API call is working correctly!');
  } catch (error) {
    console.error('Login error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    console.log('FAILED: Frontend API call is not working correctly.');
  }
}

testFrontendApi();