'use client'

import { useState, useCallback, useEffect, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import SearchBar from './SearchBar'
import SearchFilters from './SearchFilters'
import PostCard from '@/components/ui/PostCard'
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

    // Separate urgent and normal posts
    const urgentPosts = posts.filter(p => p.urgency === 'urgent')
    const normalPosts = posts.filter(p => p.urgency !== 'urgent')

    // Update URL and search
    const updateSearch = useCallback(async () => {
        setIsSearching(true)

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

    useEffect(() => {
        updateSearch()
    }, [categoryId, startDate, endDate, urgency, sortOrder])

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

    const mapPost = (post: SearchResult) => ({
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
    })

    return (
        <>
            {/* Hero Section */}
            <section className="hero-gradient text-white py-12 md:py-16 relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col items-center justify-center text-center gap-4">
                        {/* Title */}
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mx-auto">
                            Portal Informasi Kedinasan
                        </h1>

                        {/* Subtitle */}
                        <p className="text-sm md:text-base text-blue-100 mx-auto">
                            Wilayah Cabang Dinas Pendidikan Bruno
                        </p>

                        {/* Search Box */}
                        <div className="w-full max-w-xl mx-auto mt-2">
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
            <section className="py-6 md:py-8 bg-gray-50 min-h-[60vh]" id="info">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                    {(isSearching || isPending) ? (
                        <div className="space-y-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <PostCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : posts.length === 0 ? (
                        /* Empty State */
                        <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                            <div className="w-14 h-14 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h3 className="text-base font-semibold text-gray-900 mb-1">Informasi tidak ditemukan</h3>
                            <p className="text-sm text-gray-500 mb-4">Coba ubah kata kunci atau filter pencarian.</p>
                            <button onClick={handleReset} className="btn btn-secondary text-sm">
                                Reset pencarian
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-gray-900">
                                    {keyword ? `Hasil: "${keyword}"` : selectedCategoryName || 'Informasi Terbaru'}
                                </h2>
                                <span className="text-xs text-gray-500 bg-white px-2.5 py-1 rounded-full shadow-sm">
                                    {posts.length} info
                                </span>
                            </div>

                            {/* Urgent Posts Banner (Mobile) */}
                            {!urgency && urgentPosts.length > 0 && (
                                <div className="lg:hidden bg-red-50 rounded-xl p-4 border border-red-100 mb-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-7 h-7 bg-red-100 rounded-full flex items-center justify-center">
                                            <svg className="w-3.5 h-3.5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <h3 className="font-bold text-red-900 text-sm">Informasi Penting</h3>
                                    </div>
                                    <div className="space-y-2">
                                        {urgentPosts.slice(0, 3).map((post) => (
                                            <a key={post.id} href={`/berita/${post.id}`} className="block p-3 bg-white rounded-lg">
                                                <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{post.title}</h4>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Desktop: 2 or 3 Column Layout */}
                            <div className={`grid grid-cols-1 gap-6 ${!urgency && urgentPosts.length > 0 ? 'lg:grid-cols-3' : ''}`}>
                                {/* Main Column - Posts */}
                                <div className={`space-y-3 ${!urgency && urgentPosts.length > 0 ? 'lg:col-span-2' : ''}`}>
                                    {(urgency === 'urgent' ? urgentPosts : urgency === 'normal' ? normalPosts : posts).map((post) => (
                                        <PostCardCompact key={post.id} post={mapPost(post)} />
                                    ))}
                                </div>

                                {/* Desktop Sidebar - Urgent Posts */}
                                {!urgency && urgentPosts.length > 0 && (
                                    <div className="hidden lg:block lg:col-span-1">
                                        <div className="bg-red-50 rounded-2xl p-4 border border-red-100 sticky top-32">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <h3 className="font-bold text-red-900 text-sm">Informasi Penting</h3>
                                            </div>
                                            <div className="space-y-2">
                                                {urgentPosts.slice(0, 5).map((post) => (
                                                    <a
                                                        key={post.id}
                                                        href={`/berita/${post.id}`}
                                                        className="block p-3 bg-white rounded-xl hover:shadow-sm transition-shadow"
                                                    >
                                                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                                                            {post.title}
                                                        </h4>
                                                        <time className="text-xs text-gray-500">
                                                            {new Date(post.created_at).toLocaleDateString('id-ID', {
                                                                day: 'numeric', month: 'short'
                                                            })}
                                                        </time>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </section>
        </>
    )
}
