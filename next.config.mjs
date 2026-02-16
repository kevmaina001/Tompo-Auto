/** @type {import('next').NextConfig} */
const nextConfig = {
  // Explicitly prevent noindex headers in production


  // Disable automatic trailing slash redirects to prevent redirect issues
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
