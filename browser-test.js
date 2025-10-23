// This simulates what happens in the browser environment
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

// Import the API module
const { api } = require('./src/lib/api');

// Test the login function
async function testBrowserLogin() {
  console.log('Testing browser-like login...');
  
  try {
    console.log('Calling api.post with /auth/login');
    const result = await api.post('/auth/login', {
      email: 'explorer@example.com',
      password: 'explorer123'
    });
    console.log('Login result:', result);
  } catch (error) {
    console.error('Login error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

testBrowserLogin();