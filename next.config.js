/** @type {import('next').NextConfig} */

// ⚠️ No caching rules — all requests go to network.
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // still disable in dev
  register: true,
  skipWaiting: true,
  runtimeCaching: [], // 🚫 no cache rules at all
  buildExcludes: [/middleware-manifest\.json$/],
});

const nextConfig = withPWA({
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  images: {
    unoptimized: true,
    domains: ["www.tumendugui.autos"],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
});

module.exports = nextConfig;
