import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    turbo: {
      rules: {
        css: {
          enable: true,
        },
      },
    },
  },
};

export default nextConfig;
