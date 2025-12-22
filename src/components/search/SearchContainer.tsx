'use client'

import { useState, useEffect, useTransition, useCallback } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { searchPosts } from '@/lib/actions/search'
import { getCategories } from '@/lib/actions/categories'
import PostCard from '@/components/ui/PostCard'
import { PostCardSkeleton } from '@/components/ui/Loading'
import TypingText from '@/components/ui/TypingText'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
import FadeIn from '@/components/ui/FadeIn'
import AnimatedBackground from '@/components/ui/AnimatedBackground'

// Category emoji mapping
const categoryEmojis: Record<string, string> = {
    'Surat Edaran': '📋',
    'Pengumuman': '📢',
    'Undangan': '💌',
    'Laporan': '📊',
    'Kegiatan': '🎯',
    'Umum': '📌',
}

interface Post {
    id: string
    title: string
    content: string
    urgency: string
    created_at: string
    category_name: string | null
}

interface Category {
    id: string
    name: string
}

interface SearchContainerProps {
    initialPosts: Post[]
    initialTotal: number
}

const POSTS_PER_PAGE = 9

export default function SearchContainer({ initialPosts, initialTotal }: SearchContainerProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [isPending, startTransition] = useTransition()
    const [posts, setPosts] = useState<Post[]>(initialPosts)
    const [total, setTotal] = useState(initialTotal)
    const [categories, setCategories] = useState<Category[]>([])

    const currentSearch = searchParams.get('q') || ''
    const currentCategory = searchParams.get('category') || ''
    const currentPage = Number(searchParams.get('page')) || 1

    const [searchInput, setSearchInput] = useState(currentSearch)

    useEffect(() => {
        getCategories().then(setCategories)
    }, [])

    const createQueryString = useCallback((params: Record<string, string>) => {
        const newParams = new URLSearchParams(searchParams.toString())
        Object.entries(params).forEach(([key, value]) => {
            if (value) newParams.set(key, value)
            else newParams.delete(key)
        })
        return newParams.toString()
    }, [searchParams])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        startTransition(async () => {
            const qs = createQueryString({ q: searchInput, page: '' })
            router.push(`${pathname}?${qs}`)
            const { data: newPosts, total: newTotal } = await searchPosts({
                keyword: searchInput,
                categoryId: currentCategory,
                page: 1,
                limit: POSTS_PER_PAGE,
            })
            setPosts(newPosts)
            setTotal(newTotal)
        })
    }

    const handleCategoryChange = (categoryId: string) => {
        startTransition(async () => {
            const qs = createQueryString({ category: categoryId, page: '' })
            router.push(`${pathname}?${qs}`)
            const { data: newPosts, total: newTotal } = await searchPosts({
                keyword: currentSearch,
                categoryId: categoryId,
                page: 1,
                limit: POSTS_PER_PAGE,
            })
            setPosts(newPosts)
            setTotal(newTotal)
        })
    }

    const handlePageChange = (page: number) => {
        startTransition(async () => {
            const qs = createQueryString({ page: page.toString() })
            router.push(`${pathname}?${qs}`)
            const { data: newPosts, total: newTotal } = await searchPosts({
                keyword: currentSearch,
                categoryId: currentCategory,
                page,
                limit: POSTS_PER_PAGE,
            })
            setPosts(newPosts)
            setTotal(newTotal)
        })
    }

    const totalPages = Math.ceil(total / POSTS_PER_PAGE)

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            {/* Hero Section */}
            <section
                className="py-16 md:py-24 bg-white dark:bg-gray-800 relative overflow-hidden"
                style={{
                    backgroundImage: 'url(/images/hero-bg.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-white/40 dark:bg-gray-800/60" />

                {/* Animated particle background */}
                <AnimatedBackground />

                <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                        Portal Informasi{' '}
                        <TypingText
                            texts={['Kedinasan', 'Pendidikan', 'Bruno']}
                            className="gradient-text"
                        />
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
                        Pusat informasi resmi dari Wilayah Cabang Bidang Pendidikan Bruno.
                        Temukan pengumuman, berita, dan dokumen penting.
                    </p>

                    {/* Stats Counter */}
                    <div className="flex justify-center gap-8 md:gap-16 mb-10">
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-purple-600">
                                <AnimatedCounter end={total} suffix="+" />
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Informasi</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-pink-500">
                                <AnimatedCounter end={categories.length} />
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Kategori</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-purple-600">
                                <AnimatedCounter end={24} suffix="/7" />
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Akses</div>
                        </div>
                    </div>

                    {/* Search Box */}
                    <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                        <div className="flex items-center bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-full overflow-hidden focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-100 dark:focus-within:ring-purple-900 transition-all">
                            <svg className="ml-5 w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Cari informasi..."
                                className="flex-1 px-4 py-4 text-base border-none focus:outline-none bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400"
                            />
                            <button
                                type="submit"
                                className="m-1.5 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium rounded-full hover:opacity-90 transition-opacity"
                            >
                                Cari
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Content Section */}
            <section id="info" className="py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    {/* Section Title */}
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center mb-10">
                        Informasi Terbaru
                    </h2>

                    {/* Category Filters */}
                    <div className="flex flex-wrap justify-center gap-2 mb-10">
                        <button
                            onClick={() => handleCategoryChange('')}
                            className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all ${!currentCategory
                                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg'
                                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            Semua
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryChange(cat.id)}
                                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full transition-all ${currentCategory === cat.id
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg'
                                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <span>{categoryEmojis[cat.name] || '📁'}</span>
                                <span>{cat.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* Posts Grid */}
                    {isPending ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <PostCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada informasi</h3>
                            <p className="text-gray-500">Informasi yang Anda cari tidak ditemukan</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.map((post, index) => (
                                <FadeIn key={post.id} delay={index * 100}>
                                    <PostCard
                                        id={post.id}
                                        title={post.title}
                                        content={post.content}
                                        categoryName={post.category_name}
                                        urgency={post.urgency}
                                        createdAt={post.created_at}
                                    />
                                </FadeIn>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-12">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-full hover:bg-gray-50 disabled:opacity-40 transition-all"
                            >
                                Sebelumnya
                            </button>

                            <div className="flex items-center gap-1 px-4">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`w-10 h-10 rounded-full font-medium transition-colors ${page === currentPage
                                            ? 'bg-purple-600 text-white'
                                            : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-full hover:bg-gray-50 disabled:opacity-40 transition-all"
                            >
                                Selanjutnya
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
