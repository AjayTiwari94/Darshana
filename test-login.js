const axios = require('axios');

// Test the login process
async function testLogin() {
  try {
    console.log('Testing login to backend directly...');
    
    // Test backend API directly
    const backendResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'explorer@example.com',
      password: 'explorer123'
    });
    
    console.log('Backend login successful:', backendResponse.data);
    
    // Test frontend API call
    console.log('\nTesting frontend API call...');
    const frontendResponse = await axios.post('http://localhost:3004/api/auth/login', {
      email: 'explorer@example.com',
      password: 'explorer123'
    });
    
    console.log('Frontend API call successful:', frontendResponse.data);
  } catch (error) {
    console.error('Error during login test:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
  }
}

testLogin();