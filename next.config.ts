import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  logging: {
    browserToTerminal: true,
  },
};

export default nextConfig;
