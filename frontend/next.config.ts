import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: false,
  redirects: async () => [],
  images: {
    remotePatterns: [],
  },
  turbopack: {},
}

export default nextConfig
