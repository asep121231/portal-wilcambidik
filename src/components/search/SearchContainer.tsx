'use client'

import { useState, useCallback, useEffect, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import SearchBar from './SearchBar'
import SearchFilters from './SearchFilters'
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
}

export default function SearchContainer({ categories, initialPosts }: SearchContainerProps) {
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

    // Results
    const [posts, setPosts] = useState<SearchResult[]>(initialPosts)
    const [isSearching, setIsSearching] = useState(false)

    // Update URL and search
    const updateSearch = useCallback(async () => {
        setIsSearching(true)

        // Build URL params
        const params = new URLSearchParams()
        if (keyword) params.set('q', keyword)
        if (categoryId) params.set('category', categoryId)
        if (startDate) params.set('from', startDate)
        if (endDate) params.set('to', endDate)
        if (urgency) params.set('urgency', urgency)
        if (sortOrder !== 'desc') params.set('sort', sortOrder)

        // Update URL without reload
        const newUrl = params.toString() ? `/?${params.toString()}` : '/'
        startTransition(() => {
            router.push(newUrl, { scroll: false })
        })

        // Fetch results
        try {
            const results = await searchPosts({
                keyword: keyword || undefined,
                categoryId: categoryId || undefined,
                startDate: startDate || undefined,
                endDate: endDate || undefined,
                urgency: urgency || undefined,
                sortOrder
            })
            setPosts(results)
        } catch (error) {
            console.error('Search error:', error)
        } finally {
            setIsSearching(false)
        }
    }, [keyword, categoryId, startDate, endDate, urgency, sortOrder, router])

    // Trigger search when filters change
    useEffect(() => {
        updateSearch()
    }, [categoryId, startDate, endDate, urgency, sortOrder])

    // Handle keyword search (called from SearchBar with debounce)
    const handleKeywordSearch = useCallback((newKeyword: string) => {
        setKeyword(newKeyword)
        setIsSearching(true)
        searchPosts({
            keyword: newKeyword || undefined,
            categoryId: categoryId || undefined,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            urgency: urgency || undefined,
            sortOrder
        }).then((results) => {
            setPosts(results)
            setIsSearching(false)

            // Update URL
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
        router.push('/', { scroll: false })
        searchPosts({}).then(setPosts)
    }, [router])

    const selectedCategoryName = categories.find(c => c.id === categoryId)?.name

    return (
        <>
            {/* Hero Section with Search */}
            <section className="hero-gradient text-white py-10 md:py-16 relative">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-6 md:mb-8">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3">
                            Portal Informasi Kedinasan
                        </h1>
                        <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto">
                            Wilayah Cabang Dinas Pendidikan Bruno
                        </p>
                    </div>

                    {/* Search Bar */}
                    <SearchBar
                        initialValue={keyword}
                        onSearch={handleKeywordSearch}
                    />
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

            {/* Results Section */}
            <section className="py-6 md:py-10 bg-gray-50 min-h-[50vh]" id="info">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Results Header */}
                    <div className="flex items-center justify-between mb-5 md:mb-6">
                        <h2 className="text-lg md:text-xl font-bold text-gray-900">
                            {keyword ? `Hasil pencarian "${keyword}"` :
                                selectedCategoryName ? selectedCategoryName :
                                    'Informasi Terbaru'}
                        </h2>
                        <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                            {posts.length} informasi
                        </span>
                    </div>

                    {/* Loading State */}
                    {(isSearching || isPending) ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <PostCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : posts.length === 0 ? (
                        /* Empty State */
                        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-8 h-8 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Informasi tidak ditemukan
                            </h3>
                            <p className="text-sm text-gray-500 mb-5 max-w-sm mx-auto">
                                Coba ubah kata kunci atau filter pencarian Anda untuk menemukan informasi yang tepat.
                            </p>
                            <button
                                onClick={handleReset}
                                className="btn btn-secondary"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Reset pencarian
                            </button>
                        </div>
                    ) : (
                        /* Results Grid */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {posts.map((post) => (
                                <PostCard
                                    key={post.id}
                                    post={{
                                        id: post.id,
                                        title: post.title,
                                        content: post.content,
                                        category_id: post.category_id,
                                        status: post.status as 'draft' | 'published',
                                        urgency: (post.urgency || 'normal') as 'urgent' | 'normal',
                                        created_at: post.created_at,
                                        updated_at: post.updated_at,
                                        categories: post.category_name ? {
                                            id: post.category_id || '',
                                            name: post.category_name,
                                            created_at: ''
                                        } : null
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}
