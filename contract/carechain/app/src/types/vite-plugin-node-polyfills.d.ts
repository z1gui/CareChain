declare module 'vite-plugin-node-polyfills' {
  import type { PluginOption } from 'vite'

  export interface NodePolyfillsOptions {
    include?: string[]
    exclude?: string[]
    protocolImports?: boolean
    globals?: {
      Buffer?: boolean | 'build' | 'dev'
      global?: boolean | 'build' | 'dev'
      process?: boolean | 'build' | 'dev'
    }
    overrides?: Record<string, string>
  }

  export function nodePolyfills(options?: NodePolyfillsOptions): PluginOption
}
