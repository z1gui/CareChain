import type { HttpRequestInit, RequestInterceptor, ResponseInterceptor } from './types'
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
    init: HttpRequestInit = {},
  ): Promise<ResponseData> {
    const { queries, ...requestInit } = init
    const searchParams = new URLSearchParams()

    for (const [key, value] of Object.entries(queries ?? {})) {
      if (value === null || value === undefined) {
        continue
      }

      searchParams.set(key, String(value))
    }

    const queryString = searchParams.toString()

    let input: RequestInfo | URL = `${baseUrl}${path}${queryString ? `?${queryString}` : ''}`
    let finalInit: RequestInit = {
      ...requestInit,
      headers: {
        'content-type': 'application/json',
        ...(await getHeaders?.()),
        ...(requestInit.headers ?? {}),
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
