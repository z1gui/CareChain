import type { RequestInterceptor, ResponseInterceptor } from './types'
import { ApiError } from './errors'

export interface CreateHttpClientOptions {
  baseUrl: string
  getHeaders?: () => Promise<HeadersInit> | HeadersInit
  onUnauthorized?: () => Promise<void> | void
  requestInterceptors?: RequestInterceptor[]
  responseInterceptors?: ResponseInterceptor[]
}

export type HttpClient = ReturnType<typeof createHttpClient>

export function createHttpClient(options: CreateHttpClientOptions) {
  const {
    baseUrl,
    getHeaders,
    onUnauthorized,
    requestInterceptors = [],
    responseInterceptors = [],
  } = options

  return async function http<Data, ResponseData = ApiResponseData<Data>>(
    path: string,
    init: RequestInit = {},
  ): Promise<ResponseData> {
    let input: RequestInfo | URL = `${baseUrl}${path}`
    let finalInit: RequestInit = {
      ...init,
      headers: {
        'content-type': 'application/json',
        ...(await getHeaders?.()),
        ...(init.headers ?? {}),
      },
    }

    for (const interceptor of requestInterceptors) {
      ;[input, finalInit] = await interceptor(input, finalInit)
    }

    let response = await fetch(input, finalInit)

    for (const interceptor of responseInterceptors) {
      response = await interceptor(response)
    }

    if (response.status === 401) {
      await onUnauthorized?.()
    }

    if (!response.ok) {
      let payload: unknown
      try {
        payload = await response.json()
      }
      catch {
        payload = await response.text()
      }
      throw new ApiError(response.status, 'REQUEST_FAILED', payload)
    }

    if (response.status === 204) {
      return undefined as ResponseData
    }

    return response.json() as Promise<ResponseData>
  }
}
