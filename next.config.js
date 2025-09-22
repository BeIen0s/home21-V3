/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Static export for Netlify
  trailingSlash: true,
  
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
    // Custom webpack config
    return config;
  },
};

module.exports = nextConfig;