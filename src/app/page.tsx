import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import SearchContainer from '@/components/search/SearchContainer'
import { PostCardSkeleton } from '@/components/ui/Loading'
import type { Category } from '@/types/database'
import { searchPosts } from '@/lib/actions/search'

// ISR: Revalidate every 5 minutes (300 seconds)
export const revalidate = 300

interface HomePageProps {
  searchParams: Promise<{
    q?: string
    category?: string
    from?: string
    to?: string
    urgency?: string
    sort?: string
  }>
}

async function getCategories() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('id, name')
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data as Category[]
}

function LoadingState() {
  return (
    <>
      {/* Hero Skeleton */}
      <section className="hero-gradient text-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="h-10 w-72 bg-white/20 rounded-lg animate-pulse" />
            <div className="h-5 w-48 bg-white/15 rounded animate-pulse" />
            <div className="w-full max-w-xl h-12 bg-white/15 rounded-xl animate-pulse mt-2" />
          </div>
        </div>
      </section>

      {/* Filter Skeleton */}
      <div className="bg-white border-b border-gray-100 py-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-2 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 w-24 bg-gray-200 rounded-full animate-pulse flex-shrink-0" />
          ))}
        </div>
      </div>

      {/* Posts Skeleton */}
      <section className="py-6 md:py-8 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams

  const [categories, response] = await Promise.all([
    getCategories(),
    searchPosts({
      keyword: params.q,
      categoryId: params.category,
      startDate: params.from,
      endDate: params.to,
      urgency: params.urgency,
      sortOrder: (params.sort as 'asc' | 'desc') || 'desc',
      page: 1,
      limit: 10
    })
  ])

  return (
    <Suspense fallback={<LoadingState />}>
      <SearchContainer
        categories={categories}
        initialPosts={response.data}
        initialHasMore={response.hasMore}
      />
    </Suspense>
  )
}
