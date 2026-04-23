export type RequestInterceptor = (
  input: RequestInfo | URL,
  init: RequestInit,
) => Promise<[RequestInfo | URL, RequestInit]> | [RequestInfo | URL, RequestInit]

export type ResponseInterceptor = (
  response: Response,
) => Promise<Response> | Response

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type QueryValue = string | number | boolean | null | undefined

export interface HttpRequestInit extends RequestInit {
  queries?: Record<string, QueryValue>
}
