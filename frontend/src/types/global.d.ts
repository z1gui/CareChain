import type { HttpClient } from '@/libs/http'
import type { DefaultError, QueryKey, UnusedSkipTokenOptions } from '@tanstack/react-query'

declare global {
  type Nullable<T> = null | undefined | T

  namespace NodeJS {
    interface ProcessEnv {
      // Base url
      NEXT_PUBLIC_API_BASE_URL: string
    }
  }

  type QueryOptions<
    TQueryFn extends (...args: any[]) => any,
    TError = DefaultError,
    TData = Awaited<ReturnType<TQueryFn>>,
    TQueryKey extends QueryKey = QueryKey,
  > = Omit<
    UnusedSkipTokenOptions<Awaited<ReturnType<TQueryFn>>, TError, TData, TQueryKey>,
    'queryFn'
  > & {
    extraQueryKey?: QueryKey
    init?: RequestInit
  }

  interface ApiResponseData<Data> {
    success: boolean
    message: string
    data: Data | null
    error: {
      code: string
      details: string
    } | null
  }

  interface NFTMetadata {
    name: string
    description: string
    image: string
    attributes?: Record<string, any>[]
  }
}

export {}
