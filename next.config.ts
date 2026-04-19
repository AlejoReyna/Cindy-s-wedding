import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  basePath: "/cindy_y_jorge",
  assetPrefix: "/cindy_y_jorge",
  async redirects() {
    return [
      {
        source: "/",
        destination: "/cindy_y_jorge",
        permanent: false,
        basePath: false,
      },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@assets': path.resolve(__dirname, 'assets'),
    };
    return config;
  },
};

export default nextConfig;
