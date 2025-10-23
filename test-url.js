// Simple test to check what URL would be generated
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const url = `${API_BASE_URL}/auth/login`;
console.log('Generated URL:', url);