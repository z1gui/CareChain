import { createHttpClient } from '../core'
import { baseConfig } from './base-config'

export function createServerHttp() {
  return createHttpClient({
    ...baseConfig,
    getHeaders: async () => {
      // const cookieStore = await cookies()
      return {
        // cookie: cookieStore.toString(),
      }
    },
  })
}
