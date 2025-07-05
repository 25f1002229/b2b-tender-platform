/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'export', // This enables static export and generates the 'out' directory on build
};

module.exports = nextConfig;
