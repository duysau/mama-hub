import type { NextConfig } from "next";

const FINANCE_URL = process.env.FINANCE_APP_URL || "http://localhost:3001";
const BABY_URL = process.env.BABY_APP_URL || "http://localhost:3002";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/finance",
        destination: `${FINANCE_URL}/finance`,
      },
      {
        source: "/finance/:path*",
        destination: `${FINANCE_URL}/finance/:path*`,
      },
      {
        source: "/baby",
        destination: `${BABY_URL}/baby`,
      },
      {
        source: "/baby/:path*",
        destination: `${BABY_URL}/baby/:path*`,
      },
    ];
  },
};

export default nextConfig;
