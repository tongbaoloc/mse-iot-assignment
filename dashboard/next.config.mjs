/** @type {import('next').NextConfig} */

const nextConfig = {
  webpack(config, { isServer }) {
    // Exclude Node.js core modules for client-side builds
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        os: false,
        tls: false,
        // Add any other Node.js core modules you need to exclude
      };
    }

    return config;
  },
};

export default nextConfig;
