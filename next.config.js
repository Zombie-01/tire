/** @type {import('next').NextConfig} */

// ⚠️ No caching rules — all requests go to network.
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // still disable in dev
  register: true,
  skipWaiting: true,
  clientsClaim: true,
  runtimeCaching: [], // 🚫 no cache rules at all
  buildExcludes: [/middleware-manifest\.json$/],
});

const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    serverActions: true,
    runtime: "nodejs", // good for supabase/server auth
  },
  images: {
    unoptimized: true,
    domains: ["www.tumendugui.autos"],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // 🔑 ADD THIS WEBPACK CONFIGURATION 🔑
  webpack: (config, { isServer }) => {
    // 1. Suppress the Supabase/Realtime-JS Critical Dependency Warning
    // This warning is harmless but clutters the console.
    config.ignoreWarnings = [
      {
        module:
          /node_modules\/@supabase\/realtime-js\/dist\/main\/RealtimeClient.js/,
        message:
          /Critical dependency: the request of a dependency is an expression/,
      },
      ...(config.ignoreWarnings || []), // Keep existing ignore warnings
    ];

    // 2. Optionally, for server components, you can mark the package as external
    // This is often a good practice when dealing with server-side packages that cause bundling issues.
    if (isServer) {
      config.externals.push({
        "@supabase/realtime-js": "commonjs @supabase/realtime-js",
      });
    }

    // Important: return the modified config
    return config;
  },
  // ____________________________________
};

module.exports = withPWA(nextConfig);
