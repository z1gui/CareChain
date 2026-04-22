export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    public payload?: unknown,
  ) {
    super(code)
  }
}

export type RequestInterceptor = (
  input: RequestInfo | URL,
  init: RequestInit,
) => Promise<[RequestInfo | URL, RequestInit]> | [RequestInfo | URL, RequestInit]

export type ResponseInterceptor = (
  response: Response,
) => Promise<Response> | Response
