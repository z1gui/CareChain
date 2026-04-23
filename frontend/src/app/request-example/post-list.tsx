'use client'

import { useQuery } from '@tanstack/react-query'
import { getPostsQuery } from '@/apis/posts/queries'
import { Button } from '@/components/ui/button'

export function PostList() {
  const { data, isLoading, refetch } = useQuery({
    ...getPostsQuery({
      extraQueryKey: [1],
      init: {
        queries: {
          userId: 1,
        },
      },
    }),
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Button onClick={() => refetch()}>Refresh</Button>
      <pre className="whitespace-pre-wrap">{data && JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
