'use client'

import { useState, useCallback, useEffect, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import PostCardModern from '@/components/ui/PostCardModern'
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

    // Urgent posts for highlight section
    const urgentPosts = posts.filter(p => p.urgency === 'urgent' || p.urgency === 'deadline')
    const regularPosts = posts

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
            {/* Hero Section */}
            <section className="hero-gradient text-white py-12 md:py-16 relative">
                <div className="container-main relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
                            Portal Informasi Kedinasan
                        </h1>
                        <p className="text-blue-100 mb-6 text-sm md:text-base">
                            Wilayah Cabang Dinas Pendidikan Bruno
                        </p>

                        {/* Search Box */}
                        <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto">
                            <div className="search-box">
                                <svg className="w-5 h-5 text-gray-400 ml-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                </div>
            </section>

            {/* Category Filter */}
            <section className="bg-white border-b border-gray-100 sticky top-16 z-40">
                <div className="container-main py-3">
                    <div className="flex gap-2 overflow-x-auto hide-scrollbar" id="info">
                        <button
                            onClick={() => handleCategoryChange('')}
                            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full transition-all ${!categoryId
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Semua
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryChange(category.id)}
                                className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full transition-all ${categoryId === category.id
                                        ? 'bg-blue-600 text-white shadow-md'
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
                <div className="container-main">
                    {/* Urgent Posts Highlight */}
                    {urgentPosts.length > 0 && !categoryId && !keyword && (
                        <div className="mb-8">
                            <h2 className="section-title mb-4">Informasi Penting</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {urgentPosts.slice(0, 3).map((post) => (
                                    <PostCardModern
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
                        </div>
                    )}

                    {/* Posts Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="section-title">
                                {keyword ? `Hasil: "${keyword}"` : selectedCategoryName || 'Informasi Terbaru'}
                            </h2>
                            <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                                {posts.length} informasi
                            </span>
                        </div>

                        {(isSearching || isPending) ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <PostCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak Ada Hasil</h3>
                                <p className="text-gray-500 mb-4">Coba ubah kata kunci atau pilih kategori lain</p>
                                <button
                                    onClick={() => { setKeyword(''); setCategoryId(''); doSearch('', '') }}
                                    className="btn btn-secondary"
                                >
                                    Reset Pencarian
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {regularPosts.map((post) => (
                                        <PostCardModern
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
                                            className="btn btn-secondary min-w-[200px]"
                                        >
                                            {isLoadingMore ? (
                                                <>
                                                    <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                                                    Memuat...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                    Muat Lebih Banyak
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}
