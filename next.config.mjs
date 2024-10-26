/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'media.crafto.app',
          },
          {
            protocol: 'https',
            hostname: 'upload.wikimedia.org',
          }
        ],
      },
};

export default nextConfig;
