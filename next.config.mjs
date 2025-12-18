/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed headers configuration to prevent any noindex headers
  // Vercel will handle preview deployment indexing automatically

  // Disable automatic trailing slash redirects to prevent redirect issues
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
