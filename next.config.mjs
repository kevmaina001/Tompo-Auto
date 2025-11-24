/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    // Only add noindex header on preview deployments, not production
    const isProduction = process.env.VERCEL_ENV === 'production';

    if (isProduction) {
      return [];
    }

    // For preview/development, add noindex
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
