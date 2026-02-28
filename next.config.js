/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow images from Amazon and Flipkart CDNs
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazon.com',
      },
      {
        protocol: 'https',
        hostname: '**.amazon.in',
      },
      {
        protocol: 'https',
        hostname: '**.media-amazon.com',
      },
      {
        protocol: 'https',
        hostname: '**.flipkart.com',
      },
      {
        protocol: 'https',
        hostname: 'rukminim*.flixcart.com',
      },
    ],
  },
};

module.exports = nextConfig;
