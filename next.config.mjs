/** @type {import('next').NextConfig} */
const nextConfig = {
  // lets `next dev` serve the travel site at travel.localhost:3000 (see proxy.js)
  allowedDevOrigins: ['travel.localhost'],
};

export default nextConfig;
