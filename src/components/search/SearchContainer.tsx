'use client'

import { useState, useEffect, useTransition, useCallback } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { searchPosts } from '@/lib/actions/search'
import { getPostsWithThumbnails } from '@/lib/actions/posts'
import { getCategories } from '@/lib/actions/categories'
import { getSchoolStats } from '@/lib/actions/schools'
import { getActivities } from '@/lib/actions/gallery'
import PostCard from '@/components/ui/PostCard'
import { PostCardSkeleton } from '@/components/ui/Loading'
import TypingText from '@/components/ui/TypingText'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
import FadeIn from '@/components/ui/FadeIn'
import AnimatedBackground from '@/components/ui/AnimatedBackground'
import HeroSlider from '@/components/ui/HeroSlider'

// Category emoji mapping
const categoryEmojis: Record<string, string> = {
    'Surat Edaran': '📋',
    'Pengumuman': '📢',
    'Undangan': '💌',
    'Laporan': '📊',
    'Kegiatan': '🎯',
    'Umum': '📌',
}

// Quick Links data
const quickLinks = [
    {
        title: 'Dokumen',
        description: 'Unduh berkas dan dokumen penting',
        href: '/dokumen',
        icon: '📄',
        color: 'from-blue-500 to-blue-600',
    },
    {
        title: 'Data Sekolah',
        description: 'Statistik dan informasi sekolah',
        href: '/data-sekolah',
        icon: '🏫',
        color: 'from-green-500 to-green-600',
    },
    {
        title: 'Galeri Kegiatan',
        description: 'Dokumentasi foto kegiatan',
        href: '/galeri',
        icon: '📸',
        color: 'from-purple-500 to-purple-600',
    },
    {
        title: 'Berita',
        description: 'Informasi dan pengumuman terbaru',
        href: '/#info',
        icon: '📰',
        color: 'from-orange-500 to-orange-600',
    },
]

interface Post {
    id: string
    title: string
    content: string
    urgency: string
    created_at: string
    category_name: string | null
    thumbnail_url?: string | null
    attachment_count?: number
}

interface Category {
    id: string
    name: string
}

interface SchoolStats {
    totalSchools: number
    totalStudents: number
    totalTeachers: number
    byLevel: { name: string; count: number; students: number; teachers: number }[]
}

interface Activity {
    id: string
    title: string
    activity_date: string
    activity_photos?: { id: string; photo_url: string }[]
}

interface SliderPhoto {
    id: string
    photo_url: string
    activity_title: string
    activity_date: string
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
    const [schoolStats, setSchoolStats] = useState<SchoolStats | null>(null)
    const [recentActivities, setRecentActivities] = useState<Activity[]>([])
    const [sliderPhotos, setSliderPhotos] = useState<SliderPhoto[]>([])

    const currentSearch = searchParams.get('q') || ''
    const currentCategory = searchParams.get('category') || ''
    const currentPage = Number(searchParams.get('page')) || 1

    const [searchInput, setSearchInput] = useState(currentSearch)

    useEffect(() => {
        getCategories().then(setCategories)
        getSchoolStats().then((data) => {
            // Process data to match our interface
            const stats = data.stats || []
            const totalSchools = stats.reduce((acc: number, s: { count: number }) => acc + (s.count || 0), 0)
            const totalStudents = stats.reduce((acc: number, s: { totalPd: number }) => acc + (s.totalPd || 0), 0)
            const totalTeachers = stats.reduce((acc: number, s: { totalGuru: number }) => acc + (s.totalGuru || 0), 0)
            const byLevel = stats.map((s: { name: string; count: number; totalPd: number; totalGuru: number }) => ({
                name: s.name,
                count: s.count || 0,
                students: s.totalPd || 0,
                teachers: s.totalGuru || 0
            }))
            setSchoolStats({ totalSchools, totalStudents, totalTeachers, byLevel })
        })
        getActivities(undefined, true).then((activities) => {
            // Filter activities that have photos
            const withPhotos = activities.filter(a => a.activity_photos && a.activity_photos.length > 0)
            setRecentActivities(withPhotos.slice(0, 4))

            // Prepare slider photos - get all photos from activities
            const allPhotos: SliderPhoto[] = []
            withPhotos.forEach(activity => {
                if (activity.activity_photos) {
                    activity.activity_photos.forEach(photo => {
                        allPhotos.push({
                            id: photo.id,
                            photo_url: photo.photo_url,
                            activity_title: activity.title,
                            activity_date: activity.activity_date
                        })
                    })
                }
            })
            setSliderPhotos(allPhotos.slice(0, 8)) // Limit to 8 photos for slider
        })
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
            // For keyword search, use searchPosts (no thumbnail needed for search results)
            // But for filtered results, use getPostsWithThumbnails
            if (searchInput) {
                const { data: newPosts, total: newTotal } = await searchPosts({
                    keyword: searchInput,
                    categoryId: currentCategory,
                    page: 1,
                    limit: POSTS_PER_PAGE,
                })
                setPosts(newPosts)
                setTotal(newTotal)
            } else {
                const { posts: newPosts, total: newTotal } = await getPostsWithThumbnails({
                    categoryId: currentCategory,
                    page: 1,
                    limit: POSTS_PER_PAGE,
                })
                setPosts(newPosts)
                setTotal(newTotal)
            }
        })
    }

    const handleCategoryChange = (categoryId: string) => {
        startTransition(async () => {
            const qs = createQueryString({ category: categoryId, page: '' })
            router.push(`${pathname}?${qs}`)
            const { posts: newPosts, total: newTotal } = await getPostsWithThumbnails({
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
            const { posts: newPosts, total: newTotal } = await getPostsWithThumbnails({
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
                            <div className="text-3xl md:text-4xl font-bold text-orange-500">
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
                                className="m-1.5 px-6 py-3 bg-gradient-to-r from-purple-600 to-orange-500 text-white font-medium rounded-full hover:opacity-90 transition-opacity"
                            >
                                Cari
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Photo Slider Section */}
            {sliderPhotos.length > 0 && (
                <section className="py-8 bg-gray-50 dark:bg-gray-900">
                    <div className="max-w-7xl mx-auto px-4 lg:px-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center mb-6">
                            📸 Dokumentasi Kegiatan
                        </h2>
                        <HeroSlider photos={sliderPhotos} />
                    </div>
                </section>
            )}

            {/* Quick Links Section */}
            <section className="py-12 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
                        🚀 Akses Cepat
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {quickLinks.map((link, index) => (
                            <FadeIn key={link.href} delay={index * 100}>
                                <Link
                                    href={link.href}
                                    className="group block p-6 bg-gray-50 dark:bg-gray-700 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-600"
                                >
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${link.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                                        {link.icon}
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                        {link.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {link.description}
                                    </p>
                                </Link>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Organization Structure Section */}
            <section className="py-12 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-4xl mx-auto px-4 lg:px-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center mb-2">
                        👥 Struktur Organisasi
                    </h2>
                    <p className="text-center text-gray-500 dark:text-gray-400 mb-10">
                        Wilcambidik Bruno, Kecamatan Bruno, Kabupaten Purworejo
                    </p>

                    {/* Leader - Top Center */}
                    <FadeIn delay={0}>
                        <div className="flex justify-center mb-8">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-orange-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity" />
                                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-700 shadow-lg">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-orange-500 p-1 mb-4 shadow-lg">
                                            <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                                                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">AK</span>
                                            </div>
                                        </div>
                                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-600 to-orange-500 rounded-full text-white text-xs font-medium mb-2">
                                            👑 Korwilcambidik Bruno
                                        </div>
                                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">AKHMADI, S.Pd., M.M.Pd</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>

                    {/* Connecting Line */}
                    <div className="hidden md:flex justify-center mb-6">
                        <div className="w-px h-8 bg-gradient-to-b from-purple-400 to-blue-400" />
                    </div>

                    {/* Pengawas - 2 columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                        {/* Pengawas 1 */}
                        <FadeIn delay={100}>
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 p-0.5 flex-shrink-0">
                                        <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                                            <span className="text-base font-bold text-blue-600">NW</span>
                                        </div>
                                    </div>
                                    <div className="min-w-0">
                                        <div className="inline-flex px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 rounded text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Pengawas</div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">NGESTI WAHYUNI, S.Pd.SD.</h3>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>

                        {/* Pengawas 2 */}
                        <FadeIn delay={200}>
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 p-0.5 flex-shrink-0">
                                        <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                                            <span className="text-base font-bold text-blue-600">UU</span>
                                        </div>
                                    </div>
                                    <div className="min-w-0">
                                        <div className="inline-flex px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 rounded text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Pengawas</div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">UMI ULFATULJANAH, S.Pd.SD.</h3>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    </div>

                    {/* Tenaga Teknis - Below Pengawas */}
                    <FadeIn delay={300}>
                        <div className="flex justify-center mt-4">
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-green-300 dark:hover:border-green-600 transition-all max-w-xs w-full">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 p-0.5 flex-shrink-0">
                                        <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                                            <span className="text-base font-bold text-green-600">JP</span>
                                        </div>
                                    </div>
                                    <div className="min-w-0">
                                        <div className="inline-flex px-2 py-0.5 bg-green-100 dark:bg-green-900/50 rounded text-xs text-green-600 dark:text-green-400 font-medium mb-1">Tenaga Teknis</div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">JUPRI</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* School Statistics Section */}
            {schoolStats && schoolStats.totalSchools > 0 && (
                <section className="py-12 bg-gradient-to-r from-purple-600 to-orange-500">
                    <div className="max-w-7xl mx-auto px-4 lg:px-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">
                            🏫 Statistik Sekolah Kecamatan Bruno
                        </h2>
                        <p className="text-white/80 text-center mb-8">Data sekolah di bawah koordinasi Wilcambidik Bruno</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                                    <AnimatedCounter end={schoolStats.totalSchools} />
                                </div>
                                <div className="text-white/80">Total Sekolah</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                                    <AnimatedCounter end={schoolStats.totalStudents} />
                                </div>
                                <div className="text-white/80">Peserta Didik</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                                    <AnimatedCounter end={schoolStats.totalTeachers} />
                                </div>
                                <div className="text-white/80">Guru</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                                    <AnimatedCounter end={schoolStats.byLevel?.length || 0} />
                                </div>
                                <div className="text-white/80">Jenjang</div>
                            </div>
                        </div>

                        {schoolStats.byLevel && schoolStats.byLevel.length > 0 && (
                            <div className="mt-6 flex flex-wrap justify-center gap-3">
                                {schoolStats.byLevel.map((level) => (
                                    <div key={level.name} className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
                                        {level.name}: {level.count} sekolah
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="text-center mt-6">
                            <Link
                                href="/data-sekolah"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 font-medium rounded-full hover:shadow-lg transition-all"
                            >
                                Lihat Detail Data Sekolah
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Recent Gallery Section */}
            {recentActivities.length > 0 && (
                <section className="py-12 bg-white dark:bg-gray-800">
                    <div className="max-w-7xl mx-auto px-4 lg:px-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                📸 Galeri Kegiatan Terbaru
                            </h2>
                            <Link
                                href="/galeri"
                                className="hidden md:flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                            >
                                Lihat Semua
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {recentActivities.map((activity, index) => (
                                <FadeIn key={activity.id} delay={index * 100}>
                                    <Link
                                        href="/galeri"
                                        className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700"
                                    >
                                        {activity.activity_photos && activity.activity_photos[0] && (
                                            <Image
                                                src={activity.activity_photos[0].photo_url}
                                                alt={activity.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                                            <p className="text-white text-sm font-medium line-clamp-2">
                                                {activity.title}
                                            </p>
                                        </div>
                                    </Link>
                                </FadeIn>
                            ))}
                        </div>

                        <div className="text-center mt-6 md:hidden">
                            <Link
                                href="/galeri"
                                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                            >
                                Lihat Semua Galeri
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Content Section */}
            <section id="info" className="py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    {/* Section Title */}
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center mb-10">
                        📰 Informasi Terbaru
                    </h2>

                    {/* Category Filters */}
                    <div className="flex flex-wrap justify-center gap-2 mb-10">
                        <button
                            onClick={() => handleCategoryChange('')}
                            className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all ${!currentCategory
                                ? 'bg-gradient-to-r from-purple-600 to-orange-500 text-white shadow-lg'
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
                                    ? 'bg-gradient-to-r from-purple-600 to-orange-500 text-white shadow-lg'
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
                                        thumbnailUrl={post.thumbnail_url}
                                        attachmentCount={post.attachment_count}
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

