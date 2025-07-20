import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "dev-cms.storage.c2.liara.space", // <-- add your Liara/S3 domain here
      // Add more domains if you host on production
    ],
  },
    /* config options here */
    turbopack: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
};

export default nextConfig;
