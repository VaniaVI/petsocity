import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
      {
        protocol: "https",
        hostname: "ae-pic-a1.aliexpress-media.com",
      },
      {
        protocol: "https",
        hostname: "www.superzoo.cl",
      },
      {
        protocol: "https",
        hostname: "www.moxypetbox.cl",
      },
      {
        protocol: "https",
        hostname: "ae01.alicdn.com",
      },
    ],
  },
};

export default nextConfig;