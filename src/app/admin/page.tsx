import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

async function getStats() {
    const supabase = await createClient()

    const [postsResult, publishedResult, categoriesResult] = await Promise.all([
        supabase.from('posts').select('id', { count: 'exact', head: true }),
        supabase.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
    ])

    return {
        totalPosts: postsResult.count || 0,
        publishedPosts: publishedResult.count || 0,
        totalCategories: categoriesResult.count || 0,
    }
}

async function getRecentPosts() {
    const supabase = await createClient()

    const { data } = await supabase
        .from('posts')
        .select(`
      id,
      title,
      status,
      urgency,
      created_at,
      categories (name)
    `)
        .order('created_at', { ascending: false })
        .limit(5)

    return data || []
}

export default async function AdminDashboardPage() {
    const [stats, recentPosts] = await Promise.all([
        getStats(),
        getRecentPosts(),
    ])

    const statCards = [
        {
            label: 'Total Berita',
            value: stats.totalPosts,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
            ),
            color: 'bg-[#1E40AF]',
        },
        {
            label: 'Dipublikasi',
            value: stats.publishedPosts,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'bg-green-600',
        },
        {
            label: 'Kategori',
            value: stats.totalCategories,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
            ),
            color: 'bg-purple-600',
        },
    ]

    const getUrgencyBadge = (urgency: string) => {
        switch (urgency) {
            case 'urgent':
                return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700 border border-red-200">Mendesak</span>
            case 'deadline':
                return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">Batas Waktu</span>
            default:
                return null
        }
    }

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Selamat datang di Panel Admin</p>
                </div>
                <Link
                    href="/admin/posts/new"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Tambah Berita</span>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {statCards.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className={`${stat.color} p-3.5 rounded-xl text-white shadow-lg`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Link
                    href="/admin/posts"
                    className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#2563EB] hover:shadow-md transition-all group"
                >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-[#1E40AF] group-hover:bg-[#1E40AF] group-hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Kelola Berita</span>
                </Link>
                <Link
                    href="/admin/categories"
                    className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-400 hover:shadow-md transition-all group"
                >
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Kategori</span>
                </Link>
                <Link
                    href="/admin/posts/new"
                    className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-green-400 hover:shadow-md transition-all group"
                >
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Tulis Berita</span>
                </Link>
                <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-orange-400 hover:shadow-md transition-all group"
                >
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Lihat Portal</span>
                </Link>
            </div>

            {/* Recent posts */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Berita Terbaru</h2>
                    <Link
                        href="/admin/posts"
                        className="text-sm text-[#2563EB] hover:text-[#1E40AF] font-medium flex items-center gap-1"
                    >
                        Lihat Semua
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {recentPosts.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 mb-4">Belum ada berita</p>
                        <Link
                            href="/admin/posts/new"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1E40AF] text-white rounded-lg font-medium text-sm hover:bg-[#1D4ED8]"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Buat Berita Pertama
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {recentPosts.map((post: any) => (
                            <div key={post.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Link
                                            href={`/admin/posts/${post.id}/edit`}
                                            className="font-semibold text-gray-900 hover:text-[#2563EB] truncate"
                                        >
                                            {post.title}
                                        </Link>
                                        {getUrgencyBadge(post.urgency)}
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        {post.categories?.name || 'Tanpa Kategori'} • {new Date(post.created_at).toLocaleDateString('id-ID')}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <span
                                        className={`px-3 py-1 text-xs font-semibold rounded-full ${post.status === 'published'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                            }`}
                                    >
                                        {post.status === 'published' ? 'Publikasi' : 'Draft'}
                                    </span>
                                    <Link
                                        href={`/admin/posts/${post.id}/edit`}
                                        className="p-2 text-gray-400 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
