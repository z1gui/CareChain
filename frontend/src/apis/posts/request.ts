import type { GetPostVO } from './types'
import type { HttpClient } from '@/libs/http'
import { clientHttp } from '@/libs/http'

export function getPosts(http: HttpClient = clientHttp()) {
  return http<GetPostVO[]>('/posts')
}
