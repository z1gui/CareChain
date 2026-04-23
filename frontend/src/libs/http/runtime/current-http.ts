import { isServer } from '@/utils'
import { createBrowserHttp } from './create-browser-http'
import { createServerHttp } from './create-server-http'

export function createHttp() {
  if (isServer()) {
    return createServerHttp()
  }

  return createBrowserHttp()
}

export const http = createHttp()
