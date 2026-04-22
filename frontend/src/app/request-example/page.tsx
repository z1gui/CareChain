import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getPostsQuery } from '@/apis/posts/queries'
import { PostList } from '@/app/request-example/post-list'
import { getQueryClient } from '@/libs/query-client'

export default async function RequestExamplePage() {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(getPostsQuery())

  // const data = await queryClient.fetchQuery(getPostsQuery())

  // console.log(data)

  return (
    <div className="pt-16">
      <div className="max-w-360 mx-auto lg:p-10">
        <h1>Request Example Page</h1>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <PostList />
        </HydrationBoundary>
      </div>
    </div>
  )
}
