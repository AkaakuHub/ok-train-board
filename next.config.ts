import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: "http://ok-train-api.akaaku.net/api/:path*",
      },
    ];
  },
};

export default nextConfig;
