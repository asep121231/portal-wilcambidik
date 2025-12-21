'use client'

import { useState, useCallback, useEffect, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import SearchBar from './SearchBar'
import SearchFilters from './SearchFilters'
import PostCardCompact from '@/components/ui/PostCardCompact'
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

    // State from URL params
    const [keyword, setKeyword] = useState(searchParams.get('q') || '')
    const [categoryId, setCategoryId] = useState(searchParams.get('category') || '')
    const [startDate, setStartDate] = useState(searchParams.get('from') || '')
    const [endDate, setEndDate] = useState(searchParams.get('to') || '')
    const [urgency, setUrgency] = useState(searchParams.get('urgency') || '')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
        (searchParams.get('sort') as 'asc' | 'desc') || 'desc'
    )

    // Results & Pagination
    const [posts, setPosts] = useState<SearchResult[]>(initialPosts)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(initialHasMore)
    const [isSearching, setIsSearching] = useState(false)
    const [isLoadingMore, setIsLoadingMore] = useState(false)

    // Separate urgent and normal posts
    const urgentPosts = posts.filter(p => p.urgency === 'urgent' || p.urgency === 'deadline')
    const normalPosts = posts.filter(p => p.urgency !== 'urgent' && p.urgency !== 'deadline')

    const updateSearch = useCallback(async () => {
        setIsSearching(true)
        setPage(1)

        const params = new URLSearchParams()
        if (keyword) params.set('q', keyword)
        if (categoryId) params.set('category', categoryId)
        if (startDate) params.set('from', startDate)
        if (endDate) params.set('to', endDate)
        if (urgency) params.set('urgency', urgency)
        if (sortOrder !== 'desc') params.set('sort', sortOrder)

        const newUrl = params.toString() ? `/?${params.toString()}` : '/'
        startTransition(() => {
            router.push(newUrl, { scroll: false })
        })

        try {
            const response = await searchPosts({
                keyword: keyword || undefined,
                categoryId: categoryId || undefined,
                startDate: startDate || undefined,
                endDate: endDate || undefined,
                urgency: urgency || undefined,
                sortOrder,
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
    }, [keyword, categoryId, startDate, endDate, urgency, sortOrder, router])

    const loadMore = useCallback(async () => {
        if (isLoadingMore || !hasMore) return

        setIsLoadingMore(true)
        const nextPage = page + 1

        try {
            const response = await searchPosts({
                keyword: keyword || undefined,
                categoryId: categoryId || undefined,
                startDate: startDate || undefined,
                endDate: endDate || undefined,
                urgency: urgency || undefined,
                sortOrder,
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
    }, [page, hasMore, isLoadingMore, keyword, categoryId, startDate, endDate, urgency, sortOrder])

    useEffect(() => {
        updateSearch()
    }, [categoryId, startDate, endDate, urgency, sortOrder])

    const handleKeywordSearch = useCallback((newKeyword: string) => {
        setKeyword(newKeyword)
        setIsSearching(true)
        setPage(1)

        searchPosts({
            keyword: newKeyword || undefined,
            categoryId: categoryId || undefined,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            urgency: urgency || undefined,
            sortOrder,
            page: 1,
            limit: POSTS_PER_PAGE
        }).then((response) => {
            setPosts(response.data)
            setHasMore(response.hasMore)
            setIsSearching(false)

            const params = new URLSearchParams()
            if (newKeyword) params.set('q', newKeyword)
            if (categoryId) params.set('category', categoryId)
            if (startDate) params.set('from', startDate)
            if (endDate) params.set('to', endDate)
            if (urgency) params.set('urgency', urgency)
            if (sortOrder !== 'desc') params.set('sort', sortOrder)
            const newUrl = params.toString() ? `/?${params.toString()}` : '/'
            router.push(newUrl, { scroll: false })
        })
    }, [categoryId, startDate, endDate, urgency, sortOrder, router])

    const handleReset = useCallback(() => {
        setKeyword('')
        setCategoryId('')
        setStartDate('')
        setEndDate('')
        setUrgency('')
        setSortOrder('desc')
        setPage(1)
        router.push('/', { scroll: false })
        searchPosts({ page: 1, limit: POSTS_PER_PAGE }).then((response) => {
            setPosts(response.data)
            setHasMore(response.hasMore)
        })
    }, [router])

    const selectedCategoryName = categories.find(c => c.id === categoryId)?.name

    const mapPost = (post: SearchResult) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        category_id: post.category_id,
        status: post.status as 'draft' | 'published',
        urgency: (post.urgency || 'general') as 'urgent' | 'deadline' | 'general' | 'archive',
        created_at: post.created_at,
        updated_at: post.updated_at,
        categories: post.category_name ? {
            id: post.category_id || '',
            name: post.category_name,
            created_at: ''
        } : null
    })

    return (
        <>
            {/* Hero Section - Government Style */}
            <section className="gov-hero py-12 md:py-16">
                <div className="container-gov">
                    <div className="max-w-3xl mx-auto md:mx-0">
                        {/* Title */}
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#0F172A] mb-2 text-center md:text-left">
                            Portal Informasi Kedinasan
                        </h1>
                        <p className="text-[#475569] mb-6 text-center md:text-left">
                            Wilayah Cabang Dinas Pendidikan Bruno
                        </p>

                        {/* Search Box */}
                        <div className="max-w-2xl mx-auto md:mx-0">
                            <SearchBar initialValue={keyword} onSearch={handleKeywordSearch} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Filters */}
            <SearchFilters
                categories={categories}
                selectedCategory={categoryId}
                startDate={startDate}
                endDate={endDate}
                urgency={urgency}
                sortOrder={sortOrder}
                onCategoryChange={setCategoryId}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onUrgencyChange={setUrgency}
                onSortOrderChange={setSortOrder}
                onReset={handleReset}
            />

            {/* Main Content */}
            <section className="gov-section bg-white" id="info">
                <div className="container-gov">

                    {(isSearching || isPending) ? (
                        <div className="space-y-4 max-w-4xl">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <PostCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-16 max-w-md mx-auto">
                            <div className="w-16 h-16 bg-[#F8FAFC] rounded-full mx-auto mb-4 flex items-center justify-center">
                                <svg className="w-8 h-8 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Informasi tidak ditemukan</h3>
                            <p className="text-[#475569] text-sm mb-4">Coba ubah kata kunci atau filter pencarian.</p>
                            <button onClick={handleReset} className="btn btn-outline">
                                Reset pencarian
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Section Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="section-title">
                                    {keyword ? `Hasil: "${keyword}"` : selectedCategoryName || 'Informasi Terbaru'}
                                </h2>
                                <span className="text-sm text-[#475569]">
                                    {posts.length} informasi
                                </span>
                            </div>

                            {/* Urgent Banner */}
                            {!urgency && urgentPosts.length > 0 && (
                                <div className="mb-6 p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-lg">
                                    <div className="flex items-center gap-2 mb-3">
                                        <svg className="w-5 h-5 text-[#DC2626]" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <span className="font-semibold text-[#DC2626] text-sm">Informasi Penting</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                        {urgentPosts.slice(0, 3).map((post) => (
                                            <a
                                                key={post.id}
                                                href={`/berita/${post.id}`}
                                                className="block p-3 bg-white rounded-md hover:bg-[#FEF2F2] transition-colors border border-[#FECACA]"
                                            >
                                                <span className="text-sm font-medium text-[#0F172A] line-clamp-1">{post.title}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Posts List */}
                            <div className="space-y-3 max-w-4xl">
                                {(urgency === 'urgent' || urgency === 'deadline' ? urgentPosts : urgency === 'general' || urgency === 'archive' ? normalPosts : posts).map((post) => (
                                    <PostCardCompact key={post.id} post={mapPost(post)} />
                                ))}
                            </div>

                            {/* Load More Button */}
                            {hasMore && (
                                <div className="pt-8 text-center">
                                    <button
                                        onClick={loadMore}
                                        disabled={isLoadingMore}
                                        className="btn btn-secondary min-w-[200px]"
                                    >
                                        {isLoadingMore ? (
                                            <>
                                                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                Memuat...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                                Muat lebih banyak
                                            </>
                                        )}
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
