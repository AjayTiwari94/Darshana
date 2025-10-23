const { api } = require('./src/lib/api');

async function testAPI() {
  try {
    console.log('Testing API call directly...');
    
    // Test the API utility directly
    const response = await api.post('/auth/login', {
      email: 'explorer@example.com',
      password: 'explorer123'
    });
    
    console.log('API call successful:', response);
  } catch (error) {
    console.error('Error during API test:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
  }
}

testAPI();