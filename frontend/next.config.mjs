/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: { serverActions: { bodySizeLimit: '15mb', allowedOrigins: ['**.preview.emergentagent.com', '**.preview.emergentcf.cloud', 'localhost:3000'] } },
  serverExternalPackages: ['sharp', 'mongodb'],
  allowedDevOrigins: ['**.preview.emergentagent.com', '**.preview.emergentcf.cloud'],
  outputFileTracingRoot: import.meta.dirname,
};

export default nextConfig;
