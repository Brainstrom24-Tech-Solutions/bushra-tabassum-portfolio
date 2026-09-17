/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  // Keep development caches separate from the production exporter.
  distDir: process.env.NODE_ENV === 'production' ? 'out' : (process.env.NEXT_DEV_DIRECTORY || '.next-dev'),
  images: { unoptimized: true },
};
export default nextConfig;
