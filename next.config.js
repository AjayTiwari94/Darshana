console.log("✅ next.config.js is loaded");

/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  // Clean webpack cache on development
  cleanDistDir: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.darshana.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'imgcld.yatra.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  },
  // Add webpack configuration to handle cache issues and path aliases
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
    
    // Ensure path aliases are properly resolved
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/pages': path.resolve(__dirname, 'src/pages'),
      '@/utils': path.resolve(__dirname, 'src/utils'),
      '@/hooks': path.resolve(__dirname, 'src/hooks'),
      '@/types': path.resolve(__dirname, 'src/types'),
      '@/store': path.resolve(__dirname, 'src/store'),
      '@/lib': path.resolve(__dirname, 'src/lib'),
      '@/lib/api': path.resolve(__dirname, 'src/lib/api'),
    };
    config.resolve.modules = [
      path.resolve(__dirname, 'src'),
      'node_modules',
    ];

    
    return config;
  },
}

module.exports = nextConfig