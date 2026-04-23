import type { GetPostVO } from './types'
import { http } from '@/libs/http'

export async function getPosts(init?: RequestInit) {
  return http<GetPostVO[]>('/posts', init)
}
