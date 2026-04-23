import { createHttpClient } from '../core'
import { baseConfig } from './base-config'

export function createBrowserHttp() {
  return createHttpClient({
    ...baseConfig,
    onUnauthorized: () => {
      // window.location.href = '/login'
    },
  })
}
