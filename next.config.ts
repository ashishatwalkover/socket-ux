import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    preloadEntriesOnStart: false,
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
