import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// If missing in production, we do not fallback to localhost to prevent Vercel DNS_HOSTNAME_RESOLVED_PRIVATE errors.
const FINANCE_URL = process.env.FINANCE_APP_URL || (isDev ? "http://localhost:3001" : "");
const BABY_URL = process.env.BABY_APP_URL || (isDev ? "http://localhost:3002" : "");

if (!isDev) {
  if (!FINANCE_URL) console.warn("⚠️ WARNING: FINANCE_APP_URL is not set for production. The /finance route will not be proxied.");
  if (!BABY_URL) console.warn("⚠️ WARNING: BABY_APP_URL is not set for production. The /baby route will not be proxied.");
}

const nextConfig: NextConfig = {
  async rewrites() {
    const rewrites = [];

    if (FINANCE_URL) {
      rewrites.push(
        { source: "/finance", destination: `${FINANCE_URL}/finance` },
        { source: "/finance/:path*", destination: `${FINANCE_URL}/finance/:path*` }
      );
    }

    if (BABY_URL) {
      rewrites.push(
        { source: "/baby", destination: `${BABY_URL}/baby` },
        { source: "/baby/:path*", destination: `${BABY_URL}/baby/:path*` }
      );
    }

    return rewrites;
  },
};

export default nextConfig;
