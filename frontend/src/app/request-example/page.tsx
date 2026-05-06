import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getPostsQuery } from '@/apis/posts/queries'
import { PostList } from '@/app/request-example/post-list'
import { getQueryClient } from '@/libs/query-client'

export default async function RequestExamplePage() {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({
    ...getPostsQuery({
      extraQueryKey: [1],
      init: {
        queries: {
          userId: 1,
        },
      },
    }),
  })

  const data = await queryClient.fetchQuery(getPostsQuery())

  return (
    <div className="pt-16">
      <div className="max-w-360 mx-auto lg:p-10">
        <h1>Request Example Page</h1>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <h2>SSR: Hydration</h2>
          <PostList />
          <div className="border divide-accent my-5" />
          <h2>SSR: Data</h2>
          <pre className="whitespace-pre-wrap">{data && JSON.stringify(data, null, 2)}</pre>
        </HydrationBoundary>
      </div>
    </div>
  )
}
