import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    staticGenerationRetryCount: 3,    // reintenta hasta 3 veces si la API falla
    staticGenerationMaxConcurrency: 4, // limita páginas paralelas por worker
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'rickandmortyapi.com',
        pathname: "/api/character/avatar/**",

      },
    ],
  },
};


export default nextConfig;
