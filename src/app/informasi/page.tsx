'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getPostsWithThumbnails, type PostWithThumbnail } from '@/lib/actions/posts'
import { getCategories } from '@/lib/actions/categories'
import { PostCardSkeleton } from '@/components/ui/Loading'

interface Category {
    id: string
    name: string
    icon?: string | null
    created_at?: string
}

export default function InformasiPage() {
    const [posts, setPosts] = useState<PostWithThumbnail[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>('')
    const [isLoading, setIsLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const postsPerPage = 9

    useEffect(() => {
        async function fetchData() {
            const [cats] = await Promise.all([getCategories()])
            setCategories(cats)
        }
        fetchData()
    }, [])

    useEffect(() => {
        async function fetchPosts() {
            setIsLoading(true)
            const result = await getPostsWithThumbnails({
                categoryId: selectedCategory || undefined,
                page: currentPage,
                limit: postsPerPage,
            })
            setPosts(result.posts)
            setTotalPages(Math.max(1, Math.ceil(result.total / postsPerPage)))
            setIsLoading(false)
        }
        fetchPosts()
    }, [selectedCategory, currentPage])

    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategory(categoryId)
        setCurrentPage(1)
    }

    // Category icons mapping
    const getCategoryIcon = (name: string) => {
        const icons: Record<string, string> = {
            'Informasi Umum': '📋',
            'Pengumuman': '📢',
            'Surat Edaran': '📜',
            'Undangan': '💌',
            'Laporan': '📊',
        }
        return icons[name] || '📄'
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50/50 to-gray-50 dark:from-gray-900 dark:to-gray-800">
            {/* Hero Header */}
            <div className="bg-gradient-to-r from-purple-600 to-orange-500 pt-8 pb-16">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-white/70 text-sm mb-6">
                        <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
                        <span>/</span>
                        <span className="text-white">Informasi</span>
                    </nav>

                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        📋 Informasi Kedinasan
                    </h1>
                    <p className="text-white/80 text-lg max-w-2xl">
                        Temukan semua informasi, pengumuman, surat edaran, dan dokumen penting dari Wilcambidik Bruno.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 lg:px-8 -mt-8 pb-16">
                {/* Filter Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50 p-6 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center">
                            <span className="text-xl">🏷️</span>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filter Kategori</h2>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => handleCategoryChange('')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === ''
                                ? 'bg-gradient-to-r from-purple-600 to-orange-500 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                }`}
                        >
                            Semua
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryChange(cat.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${selectedCategory === cat.id
                                    ? 'bg-gradient-to-r from-purple-600 to-orange-500 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                    }`}
                            >
                                <span>{getCategoryIcon(cat.name)}</span>
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Posts Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <PostCardSkeleton key={i} />
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Tidak Ada Informasi
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            {selectedCategory
                                ? 'Belum ada informasi untuk kategori ini.'
                                : 'Belum ada informasi yang dipublikasikan.'
                            }
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/berita/${post.id}`}
                                    className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                                >
                                    {/* Card Header with Image or Gradient */}
                                    <div className="h-40 relative overflow-hidden">
                                        {post.thumbnail_url ? (
                                            <Image
                                                src={post.thumbnail_url}
                                                alt={post.title}
                                                fill
                                                className="object-cover transition-transform group-hover:scale-105"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-orange-400 flex items-center justify-center">
                                                <span className="text-6xl opacity-30">📰</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                                        {/* Urgency Badge */}
                                        <div className="absolute top-3 left-3 flex gap-2">
                                            {post.urgency === 'urgent' && (
                                                <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full shadow-lg">
                                                    🔴 MENDESAK
                                                </span>
                                            )}
                                            {post.urgency === 'deadline' && (
                                                <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full shadow-lg">
                                                    ⏰ BATAS WAKTU
                                                </span>
                                            )}
                                        </div>

                                        {/* Attachment indicator */}
                                        {post.attachment_count > 0 && (
                                            <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 text-xs font-medium rounded-full shadow-lg flex items-center gap-1">
                                                📎 {post.attachment_count}
                                            </div>
                                        )}
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-5">
                                        {post.category_name && (
                                            <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full mb-3">
                                                {post.category_name}
                                            </span>
                                        )}

                                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2 mb-2">
                                            {post.title}
                                        </h3>

                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                                            {post.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
                                        </p>

                                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                                            <time className="text-xs text-gray-400">
                                                {new Date(post.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </time>
                                            <span className="text-purple-600 dark:text-purple-400 text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                                                Baca <span>→</span>
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-10">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    ← Sebelumnya
                                </button>

                                <div className="flex items-center gap-1">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`w-10 h-10 rounded-lg font-medium transition-all ${currentPage === i + 1
                                                ? 'bg-gradient-to-r from-purple-600 to-orange-500 text-white'
                                                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Selanjutnya →
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Stats Info */}
                <div className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    {!isLoading && (
                        <p>
                            Menampilkan {posts.length} dari {totalPages * postsPerPage > posts.length ? (currentPage - 1) * postsPerPage + posts.length : totalPages * postsPerPage} informasi
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
