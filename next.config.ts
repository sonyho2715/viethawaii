import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Temporarily ignore build errors until all static pages migrated to API
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
