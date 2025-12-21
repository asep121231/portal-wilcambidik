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
        // Trigger search immediately after keyword changes
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
            <section className="py-8 md:py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Results Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                            {keyword ? `Hasil pencarian "${keyword}"` :
                                selectedCategoryName ? selectedCategoryName :
                                    'Informasi Terbaru'}
                        </h2>
                        <span className="text-sm text-gray-500">
                            {posts.length} informasi
                        </span>
                    </div>

                    {/* Loading State */}
                    {(isSearching || isPending) ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <PostCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : posts.length === 0 ? (
                        /* Empty State */
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
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-600 mb-2">
                                Informasi tidak ditemukan
                            </h3>
                            <p className="text-gray-500 mb-4">
                                Coba ubah kata kunci atau filter pencarian Anda.
                            </p>
                            <button
                                onClick={handleReset}
                                className="text-primary-600 hover:text-primary-700 font-medium"
                            >
                                Reset pencarian
                            </button>
                        </div>
                    ) : (
                        /* Results Grid */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
