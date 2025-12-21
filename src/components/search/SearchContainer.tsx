'use client'

import { useState, useCallback, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import PostCard from '@/components/ui/PostCard'
import { PostCardSkeleton } from '@/components/ui/Loading'
import { searchPosts, SearchResult } from '@/lib/actions/search'

interface Category {
    id: string
    name: string
}

interface SearchContainerProps {
    categories: Category[]
    initialPosts: SearchResult[]
    initialHasMore?: boolean
}

const POSTS_PER_PAGE = 10

export default function SearchContainer({ categories, initialPosts, initialHasMore = false }: SearchContainerProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    const [keyword, setKeyword] = useState(searchParams.get('q') || '')
    const [categoryId, setCategoryId] = useState(searchParams.get('category') || '')
    const [posts, setPosts] = useState<SearchResult[]>(initialPosts)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(initialHasMore)
    const [isSearching, setIsSearching] = useState(false)
    const [isLoadingMore, setIsLoadingMore] = useState(false)

    const doSearch = useCallback(async (searchKeyword: string, searchCategoryId: string) => {
        setIsSearching(true)
        setPage(1)

        const params = new URLSearchParams()
        if (searchKeyword) params.set('q', searchKeyword)
        if (searchCategoryId) params.set('category', searchCategoryId)
        const newUrl = params.toString() ? `/?${params.toString()}` : '/'

        startTransition(() => {
            router.push(newUrl, { scroll: false })
        })

        try {
            const response = await searchPosts({
                keyword: searchKeyword || undefined,
                categoryId: searchCategoryId || undefined,
                page: 1,
                limit: POSTS_PER_PAGE
            })
            setPosts(response.data)
            setHasMore(response.hasMore)
        } catch (error) {
            console.error('Search error:', error)
        } finally {
            setIsSearching(false)
        }
    }, [router])

    const loadMore = useCallback(async () => {
        if (isLoadingMore || !hasMore) return
        setIsLoadingMore(true)
        const nextPage = page + 1

        try {
            const response = await searchPosts({
                keyword: keyword || undefined,
                categoryId: categoryId || undefined,
                page: nextPage,
                limit: POSTS_PER_PAGE
            })
            setPosts(prev => [...prev, ...response.data])
            setHasMore(response.hasMore)
            setPage(nextPage)
        } catch (error) {
            console.error('Load more error:', error)
        } finally {
            setIsLoadingMore(false)
        }
    }, [page, hasMore, isLoadingMore, keyword, categoryId])

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        doSearch(keyword, categoryId)
    }

    const handleCategoryChange = (newCategoryId: string) => {
        setCategoryId(newCategoryId)
        doSearch(keyword, newCategoryId)
    }

    const selectedCategoryName = categories.find(c => c.id === categoryId)?.name

    return (
        <>
            {/* Hero Section - Soft Background */}
            <section className="bg-blue-50 py-10 md:py-14">
                <div className="container-gov text-center">
                    <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                        Portal Informasi Kedinasan
                    </h1>
                    <p className="text-sm text-gray-600 mb-6">
                        Wilayah Cabang Dinas Pendidikan Bruno
                    </p>

                    {/* Search Box */}
                    <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto">
                        <div className="search-box">
                            <svg className="w-4 h-4 text-gray-400 ml-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="Cari informasi kedinasan..."
                            />
                            <button type="submit">Cari</button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Category Filter */}
            <section className="bg-white border-b border-gray-200 sticky top-16 z-40">
                <div className="container-gov py-3">
                    <div className="flex gap-2 overflow-x-auto hide-scrollbar" id="info">
                        <button
                            onClick={() => handleCategoryChange('')}
                            className={`flex-shrink-0 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${!categoryId
                                    ? 'bg-blue-800 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Semua
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryChange(category.id)}
                                className={`flex-shrink-0 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${categoryId === category.id
                                        ? 'bg-blue-800 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-8 md:py-10">
                <div className="container-gov">
                    {/* Section Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="section-title">
                            {keyword ? `Hasil: "${keyword}"` : selectedCategoryName || 'Informasi Terbaru'}
                        </h2>
                        <span className="text-xs text-gray-500">
                            {posts.length} informasi
                        </span>
                    </div>

                    {/* Posts Grid */}
                    {(isSearching || isPending) ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <PostCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600 mb-4">Tidak ada informasi ditemukan.</p>
                            <button
                                onClick={() => { setKeyword(''); setCategoryId(''); doSearch('', '') }}
                                className="btn btn-outline"
                            >
                                Reset Pencarian
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {posts.map((post) => (
                                    <PostCard
                                        key={post.id}
                                        id={post.id}
                                        title={post.title}
                                        content={post.content}
                                        categoryName={post.category_name}
                                        urgency={post.urgency}
                                        createdAt={post.created_at}
                                    />
                                ))}
                            </div>

                            {/* Load More */}
                            {hasMore && (
                                <div className="mt-8 text-center">
                                    <button
                                        onClick={loadMore}
                                        disabled={isLoadingMore}
                                        className="btn btn-secondary"
                                    >
                                        {isLoadingMore ? 'Memuat...' : 'Muat Lebih Banyak'}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </>
    )
}
