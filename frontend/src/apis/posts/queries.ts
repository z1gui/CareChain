import { queryOptions } from '@tanstack/react-query'
import { getPosts } from './request'

export function getPostsQuery(options?: QueryOptions) {
  return queryOptions({
    queryKey: ['getPosts', ...options?.extraQueryKey || []],
    queryFn: () => getPosts(),
    ...options,
  })
}
