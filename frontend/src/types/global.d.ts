import type { QueryKey, UnusedSkipTokenOptions } from '@tanstack/react-query'

declare global {
  type Nullable<T> = null | undefined | T

  namespace NodeJS {
    interface ProcessEnv {
      // Base url
      NEXT_PUBLIC_API_BASE_URL: string
    }
  }

  type QueryOptions = UnusedSkipTokenOptions & {
    extraQueryKey?: QueryKey
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
