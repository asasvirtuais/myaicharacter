import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['asasvirtuais', 'asasvirtuais-firebase', 'asasvirtuais-characters', 'asasvirtuais-gemini'],
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
}

export default nextConfig
