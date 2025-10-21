/** @type {import('next').NextConfig} */

const runtimeCaching = [
  // ⚡ Next.js build assets (never change)
  {
    urlPattern: /^https:\/\/www\.tumendugui\.autos\/_next\/static\/.*/i,
    handler: "CacheFirst",
    options: {
      cacheName: "static-assets",
      expiration: { maxEntries: 100, maxAgeSeconds: 60 * 24 * 60 * 60 }, // 60 days
    },
  },
  // ⚡ Next.js image optimizer
  {
    urlPattern: /^https:\/\/www\.tumendugui\.autos\/_next\/image\/.*/i,
    handler: "CacheFirst",
    options: {
      cacheName: "next-image-cache",
      expiration: { maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 }, // 30 days
    },
  },
  // 🖼️ Static images from your domain
  {
    urlPattern:
      /^https:\/\/www\.tumendugui\.autos\/.*\.(png|jpg|jpeg|svg|gif|webp|avif)$/i,
    handler: "CacheFirst",
    options: {
      cacheName: "image-cache",
      expiration: { maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 },
    },
  },
  // 🧠 API routes — always live (no caching)
  {
    urlPattern: /^https:\/\/www\.tumendugui\.autos\/api\/.*/i,
    handler: "NetworkOnly",
    options: { cacheName: "api-network-only" },
  },
  // 🌐 SSR & HTML pages — prefer live, fallback to cache
  {
    urlPattern:
      /^https:\/\/www\.tumendugui\.autos\/(?!_next|static|api|.*\.(png|jpg|jpeg|svg|gif|webp|avif)$).*/i,
    handler: "NetworkFirst",
    options: {
      cacheName: "html-cache",
      networkTimeoutSeconds: 10,
      expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 }, // 1 hour
    },
  },
  // 🌍 External fonts (Google Fonts example)
  {
    urlPattern: /^https:\/\/fonts\.(gstatic|googleapis)\.com\/.*/i,
    handler: "CacheFirst",
    options: {
      cacheName: "google-fonts",
      expiration: { maxEntries: 30, maxAgeSeconds: 365 * 24 * 60 * 60 }, // 1 year
    },
  },
];

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // Disable SW in dev
  register: true,
  skipWaiting: true,
  runtimeCaching,
  buildExcludes: [/middleware-manifest\.json$/], // Prevent SW errors with Next middleware
  fallbacks: {
    document: "/offline.html", // Offline fallback page
  },
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
