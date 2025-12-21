import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import PostCard from '@/components/ui/PostCard'
import { PostCardSkeleton } from '@/components/ui/Loading'
import type { PostWithCategory, Category } from '@/types/database'

interface HomePageProps {
  searchParams: Promise<{ category?: string; page?: string }>
}

async function getPosts(categoryId?: string) {
  const supabase = await createClient()

  let query = supabase
    .from('posts')
    .select(`
      *,
      categories (*)
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  const { data, error } = await query.limit(20)

  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }

  return data as PostWithCategory[]
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

function PostsGrid({ posts }: { posts: PostWithCategory[] }) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="w-16 h-16 mx-auto text-gray-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-600 mb-2">
          Belum ada informasi
        </h3>
        <p className="text-gray-500">
          Informasi kedinasan akan ditampilkan di sini.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}

function PostsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams
  const categorySlug = params.category

  const [posts, categories] = await Promise.all([
    getPosts(categorySlug),
    getCategories(),
  ])

  const selectedCategory = categories.find(
    (cat) => cat.name.toLowerCase().replace(/\s+/g, '-') === categorySlug
  )

  return (
    <>
      {/* Hero Section */}
      <section className="hero-gradient text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Portal Informasi Kedinasan
            </h1>
            <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto">
              Wilayah Cabang Dinas Pendidikan Bruno
            </p>
            <p className="mt-4 text-primary-200 max-w-xl mx-auto">
              Akses cepat dan terpusat untuk semua informasi kedinasan satuan
              pendidikan Sekolah Dasar.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-4 overflow-x-auto">
            <a
              href="/"
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${!categorySlug
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              Semua
            </a>
            {categories.map((category) => {
              const slug = category.name.toLowerCase().replace(/\s+/g, '-')
              const isActive = categorySlug === slug
              return (
                <a
                  key={category.id}
                  href={`/?category=${slug}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${isActive
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {category.name}
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section className="py-8 md:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              {selectedCategory
                ? selectedCategory.name
                : 'Informasi Terbaru'}
            </h2>
            <span className="text-sm text-gray-500">
              {posts.length} informasi
            </span>
          </div>

          <Suspense fallback={<PostsLoading />}>
            <PostsGrid posts={posts} />
          </Suspense>
        </div>
      </section>
    </>
  )
}
