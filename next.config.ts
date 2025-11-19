import withPWA from "next-pwa";
import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // any other Next.js config options here
};

export default withPWA({
  ...nextConfig, // spread your Next.js config
  pwa: {
    dest: "public",     
    register: true,     
    skipWaiting: true,  
    disable: !isProd,   
  },
});
