import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import SearchContainer from '@/components/search/SearchContainer'
import { PostCardSkeleton } from '@/components/ui/Loading'
import type { Category } from '@/types/database'
import { searchPosts } from '@/lib/actions/search'

// ISR: Revalidate every 5 minutes
export const revalidate = 300

interface HomePageProps {
  searchParams: Promise<{
    q?: string
    category?: string
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
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
      </div>
      <div className="h-10 bg-gray-200 rounded animate-pulse mb-4" />
      <div className="flex gap-2 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams

  const [categories, response] = await Promise.all([
    getCategories(),
    searchPosts({
      keyword: params.q,
      categoryId: params.category,
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
