import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['asasvirtuais', 'asasvirtuais-firebase', 'asasvirtuais-characters', 'asasvirtuais-gemini'],
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
}

export default nextConfig;
