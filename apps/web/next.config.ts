import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@chenille/shared'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  async rewrites() {
    const backendUrl =
      process.env.INTERNAL_API_URL ||
      process.env.API_URL ||
      (process.env.NEXT_PUBLIC_API_URL
        ? process.env.NEXT_PUBLIC_API_URL.replace(/\/v1\/?$/, '/api')
        : 'http://localhost:4000/api');

    return {
      beforeFiles: [
        {
          source: '/api/v1/:path*',
          destination: `${backendUrl}/v1/:path*`,
        },
        {
          source: '/api/admin/:path*',
          destination: `${backendUrl}/admin/:path*`,
        },
        {
          source: '/api/health',
          destination: `${backendUrl}/health`,
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
