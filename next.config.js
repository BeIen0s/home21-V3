/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  
  // Development-specific configuration
  ...(process.env.NODE_ENV === 'development' && {
    reactStrictMode: true,
    swcMinify: false, // Disable SWC minification in dev for better debugging
  }),
  
  // Image optimization - disabled for static export
  images: {
    unoptimized: true,
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
  },

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Redirects - removed problematic dashboard redirect

  // Headers removed - handled by netlify.toml for static export

  // Webpack configuration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Fix for webpack hot-update 404 issues
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    
    // Ensure proper handling of static files
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    return config;
  },
};

module.exports = nextConfig;