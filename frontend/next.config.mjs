/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: 'http://localhost:3001/:path*',
      },
      {
        source: '/api/backend/emails/ai/:path*',
        destination: 'http://localhost:3001/emails/ai/:path*',
      },
    ];
  },
};

export default nextConfig;
