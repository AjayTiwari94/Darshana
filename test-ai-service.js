// Test script to verify AI service is working
// Run with: node test-ai-service.js

const https = require('https');
const http = require('http');

// Configuration
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'https://your-ai-service-url.railway.app';
const TEST_MESSAGE = 'Hello, can you tell me about the Taj Mahal?';

console.log('🧪 Testing AI Service...');
console.log('📍 AI Service URL:', AI_SERVICE_URL);
console.log('💬 Test Message:', TEST_MESSAGE);
console.log('');

// Test health endpoint
async function testHealth() {
  return new Promise((resolve, reject) => {
    const url = new URL(`${AI_SERVICE_URL}/health`);
    const client = url.protocol === 'https:' ? https : http;
    
    const req = client.request(url, { method: 'GET' }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('✅ Health Check:', result);
          resolve(result);
        } catch (e) {
          console.log('❌ Health Check Failed:', data);
          reject(e);
        }
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Health Check Error:', err.message);
      reject(err);
    });
    
    req.setTimeout(10000, () => {
      console.log('❌ Health Check Timeout');
      req.destroy();
      reject(new Error('Timeout'));
    });
    
    req.end();
  });
}

// Test chat endpoint
async function testChat() {
  return new Promise((resolve, reject) => {
    const url = new URL(`${AI_SERVICE_URL}/api/ai/chat`);
    const client = url.protocol === 'https:' ? https : http;
    
    const postData = JSON.stringify({
      message: TEST_MESSAGE,
      session_id: 'test-session',
      context: {}
    });
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = client.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('✅ Chat Response:', {
            status: res.statusCode,
            hasResponse: !!result.response,
            responseLength: result.response?.length || 0,
            suggestions: result.suggestions?.length || 0
          });
          console.log('💬 AI Response:', result.response?.substring(0, 100) + '...');
          resolve(result);
        } catch (e) {
          console.log('❌ Chat Failed:', data);
          reject(e);
        }
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Chat Error:', err.message);
      reject(err);
    });
    
    req.setTimeout(30000, () => {
      console.log('❌ Chat Timeout');
      req.destroy();
      reject(new Error('Timeout'));
    });
    
    req.write(postData);
    req.end();
  });
}

// Run tests
async function runTests() {
  try {
    console.log('🔍 Testing Health Endpoint...');
    await testHealth();
    console.log('');
    
    console.log('💬 Testing Chat Endpoint...');
    await testChat();
    console.log('');
    
    console.log('🎉 All tests passed! AI service is working correctly.');
  } catch (error) {
    console.log('');
    console.log('❌ Tests failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Check if AI service is deployed on Railway');
    console.log('2. Verify GEMINI_API_KEY is set in Railway environment variables');
    console.log('3. Check Railway logs for any errors');
    console.log('4. Ensure CORS is configured correctly');
    process.exit(1);
  }
}

runTests();
