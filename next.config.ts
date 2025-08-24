import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "dev-cms.storage.c2.liara.space", // <-- add your Liara/S3 domain here
      // Add more domains if you host on production
    ],
  },
  eslint: {
    // Allow build to proceed even if ESLint errors exist (useful when stripping styles or merging dashboards)
    ignoreDuringBuilds: true,
  },
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: { and: [/\.(js|ts)x?$/] },
      use: [
        {
          loader: '@svgr/webpack',
          options: { icon: true },
        },
      ],
    });
    return config;
  },
};

export default nextConfig;
