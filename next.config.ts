import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack configuration (Next.js 16+ default bundler)
  turbopack: {
    resolveAlias: {
      buffer: "buffer",
    },
  },
  // Webpack configuration (fallback for production builds)
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      buffer: require.resolve("buffer/"),
    };
    return config;
  },
};

export default nextConfig;
