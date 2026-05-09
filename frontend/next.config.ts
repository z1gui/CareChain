import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { NextConfig } from 'next'

// Monorepo 根目录另有 package-lock.json 时，Turbopack 会误判根为上级目录，
// 从而在 CareChain/ 下解析 tailwindcss 失败。锁定为 frontend 包根目录。
const turbopackRoot = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  reactStrictMode: false,
  redirects: async () => [],
  images: {
    remotePatterns: [],
  },
  turbopack: {
    root: turbopackRoot,
  },
}

export default nextConfig
