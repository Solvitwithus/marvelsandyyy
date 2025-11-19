// next.config.ts
import withPWA from "next-pwa";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // optional: force webpack
  experimental: { forceSwcTransforms: true },
  // optional: avoid warnings
  turbopack: {},
};

const isProd = process.env.NODE_ENV === "production";

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: !isProd,
  // Keep nextConfig separate, don't spread it into pwa object
  ...nextConfig,
});
