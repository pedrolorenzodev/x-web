import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: import.meta.dirname },
  cacheComponents: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "pbs.twimg.com" }],
  },
  logging: {
    browserToTerminal: true,
  },
};

export default nextConfig;
