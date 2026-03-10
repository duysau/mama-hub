import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/finance",
        destination: "http://localhost:3001/finance",
      },
      {
        source: "/finance/:path*",
        destination: "http://localhost:3001/finance/:path*",
      },
      {
        source: "/baby",
        destination: "http://localhost:3002/baby",
      },
      {
        source: "/baby/:path*",
        destination: "http://localhost:3002/baby/:path*",
      },
    ];
  },
};

export default nextConfig;
