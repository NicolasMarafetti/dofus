import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dofusdb.fr',
        port: '',
        pathname: '/**',
        search: '',
      },
    ],
  }
};

export default nextConfig;
