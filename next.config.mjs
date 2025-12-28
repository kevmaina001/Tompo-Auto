/** @type {import('next').NextConfig} */
const nextConfig = {
  // Explicitly prevent noindex headers in production
  async headers() {
    const isProduction = process.env.VERCEL_ENV === 'production';

    // Only add noindex to preview/development, NEVER to production
    if (isProduction) {
      return []; // No headers modification in production
    }

    // Add noindex only to preview deployments
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

  // Disable automatic trailing slash redirects to prevent redirect issues
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
