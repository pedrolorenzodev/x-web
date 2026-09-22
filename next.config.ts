import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: import.meta.dirname },
  cacheComponents: true,
  logging: {
    browserToTerminal: true,
  },
};

export default nextConfig;
