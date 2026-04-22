import { createHttpClient } from '../core'
import { sharedConfig } from './shared-config'

export async function serverHttp() {
  return createHttpClient({
    ...sharedConfig,
    getHeaders: async () => {
      // const cookieStore = await cookies()
      return {
        // cookie: cookieStore.toString(),
      }
    },
  })
}
