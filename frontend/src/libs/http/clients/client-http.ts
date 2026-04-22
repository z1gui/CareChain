import { createHttpClient } from '../core'
import { sharedConfig } from './shared-config'

export function clientHttp() {
  return createHttpClient({
    ...sharedConfig,
    onUnauthorized: () => {
      // window.location.href = '/login'
    },
  })
}
