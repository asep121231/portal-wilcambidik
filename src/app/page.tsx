import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import SearchContainer from '@/components/search/SearchContainer'
import { PostCardSkeleton } from '@/components/ui/Loading'
import type { Category } from '@/types/database'
import { searchPosts, SearchResult } from '@/lib/actions/search'

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
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data as Category[]
}

async function getInitialPosts(params: {
  keyword?: string
  categoryId?: string
  startDate?: string
  endDate?: string
  urgency?: string
  sortOrder?: 'asc' | 'desc'
}): Promise<SearchResult[]> {
  return searchPosts(params)
}

function LoadingState() {
  return (
    <>
      {/* Hero Skeleton */}
      <section className="hero-gradient text-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Portal Informasi Kedinasan
            </h1>
            <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto">
              Wilayah Cabang Dinas Pendidikan Bruno
            </p>
          </div>
          <div className="max-w-2xl mx-auto h-14 bg-white/10 rounded-xl animate-pulse" />
        </div>
      </section>

      {/* Filter Skeleton */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 w-24 bg-gray-200 rounded-full animate-pulse" />
          ))}
        </div>
      </div>

      {/* Posts Skeleton */}
      <section className="py-8 md:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
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

  const [categories, initialPosts] = await Promise.all([
    getCategories(),
    getInitialPosts({
      keyword: params.q,
      categoryId: params.category,
      startDate: params.from,
      endDate: params.to,
      urgency: params.urgency,
      sortOrder: (params.sort as 'asc' | 'desc') || 'desc'
    })
  ])

  return (
    <Suspense fallback={<LoadingState />}>
      <SearchContainer
        categories={categories}
        initialPosts={initialPosts}
      />
    </Suspense>
  )
}
