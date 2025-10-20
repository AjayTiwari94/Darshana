const axios = require('axios');

async function testAI() {
  try {
    const response = await axios.post('http://localhost:5001/api/ai/chat', {
      message: 'Hello Narad, tell me about Indian history',
      sessionId: 'test-session-123',
      context: {}
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('AI Response:', response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testAI();