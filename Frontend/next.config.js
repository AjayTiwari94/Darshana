/** @type {import('next').NextConfig} */
const nextConfig = {
  // Clean webpack cache on development
  cleanDistDir: true,
  images: {
    domains: [
      'localhost', 
      'api.darshana.com',
      'images.unsplash.com',
      'imgcld.yatra.com'
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  },
  // Add webpack configuration to handle cache issues
  webpack: (config, { isServer, dev }) => {
    if (dev) {
      // Clear cache in development
      config.cache = {
        type: 'filesystem',
        version: '1.0',
        buildDependencies: {
          config: [__filename],
        },
      };
    }
    return config;
  },
}

module.exports = nextConfig