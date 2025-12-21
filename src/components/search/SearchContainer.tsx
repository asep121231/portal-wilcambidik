'use client'

import { useState, useCallback, useEffect, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import PostCardSimple from '@/components/ui/PostCardSimple'
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

    // State
    const [keyword, setKeyword] = useState(searchParams.get('q') || '')
    const [categoryId, setCategoryId] = useState(searchParams.get('category') || '')
    const [posts, setPosts] = useState<SearchResult[]>(initialPosts)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(initialHasMore)
    const [isSearching, setIsSearching] = useState(false)
    const [isLoadingMore, setIsLoadingMore] = useState(false)

    // Search function
    const doSearch = useCallback(async (searchKeyword: string, searchCategoryId: string, resetPage = true) => {
        setIsSearching(true)
        if (resetPage) setPage(1)

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

    // Load more
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

    // Handle category change
    const handleCategoryChange = useCallback((newCategoryId: string) => {
        setCategoryId(newCategoryId)
        doSearch(keyword, newCategoryId)
    }, [keyword, doSearch])

    // Handle search submit
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        doSearch(keyword, categoryId)
    }

    const selectedCategoryName = categories.find(c => c.id === categoryId)?.name

    return (
        <div className="max-w-5xl mx-auto px-4 py-6">
            {/* Page Title */}
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900">Portal Informasi Kedinasan</h1>
                <p className="text-sm text-gray-500">Wilayah Cabang Dinas Pendidikan Bruno</p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="mb-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Cari informasi..."
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                    >
                        Cari
                    </button>
                </div>
            </form>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6" id="info">
                <button
                    onClick={() => handleCategoryChange('')}
                    className={`px-3 py-1.5 text-sm rounded-md border ${!categoryId
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                        }`}
                >
                    Semua
                </button>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => handleCategoryChange(category.id)}
                        className={`px-3 py-1.5 text-sm rounded-md border ${categoryId === category.id
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                            }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                <h2 className="text-base font-medium text-gray-900">
                    {keyword ? `Hasil: "${keyword}"` : selectedCategoryName || 'Informasi Terbaru'}
                </h2>
                <span className="text-sm text-gray-500">{posts.length} hasil</span>
            </div>

            {/* Posts List */}
            {(isSearching || isPending) ? (
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <PostCardSkeleton key={i} />
                    ))}
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">Tidak ada informasi ditemukan.</p>
                    <button
                        onClick={() => {
                            setKeyword('')
                            setCategoryId('')
                            doSearch('', '')
                        }}
                        className="mt-2 text-sm text-blue-600 hover:underline"
                    >
                        Reset pencarian
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {posts.map((post) => (
                        <PostCardSimple
                            key={post.id}
                            id={post.id}
                            title={post.title}
                            content={post.content}
                            categoryName={post.category_name}
                            urgency={post.urgency}
                            createdAt={post.created_at}
                        />
                    ))}

                    {/* Load More */}
                    {hasMore && (
                        <div className="pt-4 text-center">
                            <button
                                onClick={loadMore}
                                disabled={isLoadingMore}
                                className="px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 disabled:opacity-50"
                            >
                                {isLoadingMore ? 'Memuat...' : 'Muat lebih banyak'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
