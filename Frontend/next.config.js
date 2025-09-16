/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'api.darshana.com'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    NEXT_PUBLIC_AI_SERVICE_URL: process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8000',
  },
}

module.exports = nextConfig