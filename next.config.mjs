import withPlugins from 'next-compose-plugins';
import path from 'path'; // <-- Add this import

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(process.cwd(), 'src'), // Use process.cwd() for __dirname in ESM
    };
    return config;
  },
};

export default nextConfig;
