import type { GetPostVO } from './types'
import type { HttpRequestInit } from '@/libs/http'
import { http } from '@/libs/http'

export async function getPosts(init?: HttpRequestInit) {
  return http<GetPostVO[]>('/posts', init)
}
