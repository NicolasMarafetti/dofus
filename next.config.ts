import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    disableStaticImages: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dofusdb.fr',
        port: '',
        pathname: '/**',
        search: '',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // Optionnel : ignore les erreurs ESLint pendant le build
  },
};

export default nextConfig;
