import { Suspense } from 'react'
import SearchContainer from '@/components/search/SearchContainer'
import { PostCardSkeleton } from '@/components/ui/Loading'
import { getPostsWithThumbnails } from '@/lib/actions/posts'

// ISR: Revalidate every 5 minutes
export const revalidate = 300

interface HomePageProps {
  searchParams: Promise<{
    q?: string
    category?: string
    page?: string
  }>
}

function LoadingState() {
  return (
    <div>
      {/* Hero Skeleton */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-main text-center">
          <div className="h-16 w-3/4 mx-auto bg-gray-200 rounded animate-pulse mb-6" />
          <div className="h-6 w-1/2 mx-auto bg-gray-100 rounded animate-pulse mb-10" />
          <div className="h-14 max-w-2xl mx-auto bg-gray-100 rounded-full animate-pulse" />
        </div>
      </section>
      {/* Content Skeleton */}
      <section className="py-16 md:py-24">
        <div className="container-main">
          <div className="h-10 w-64 mx-auto bg-gray-200 rounded animate-pulse mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams

  const response = await getPostsWithThumbnails({
    categoryId: params.category,
    page: Number(params.page) || 1,
    limit: 9
  })

  return (
    <Suspense fallback={<LoadingState />}>
      <SearchContainer
        initialPosts={response.posts}
        initialTotal={response.total}
      />
    </Suspense>
  )
}

