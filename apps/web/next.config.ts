import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: '../../',
  },
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
