import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { getDashboardStats, getPopularPosts, getDailyStats } from '@/lib/actions/analytics'

async function getRecentPosts() {
    const supabase = await createClient()

    const { data } = await supabase
        .from('posts')
        .select('id, title, status, created_at, categories(name)')
        .order('created_at', { ascending: false })
        .limit(5)

    return data || []
}

export default async function AdminDashboardPage() {
    const [stats, recentPosts, popularPosts, dailyStats] = await Promise.all([
        getDashboardStats(),
        getRecentPosts(),
        getPopularPosts(5),
        getDailyStats(7),
    ])

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-sm text-gray-500">Statistik dan ringkasan portal</p>
                </div>
                <Link
                    href="/admin/posts/new"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-colors shadow-lg"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Berita
                </Link>
            </div>

            {/* Stats Cards - Row 1 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Berita</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Views (30 hari)</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Push Subscribers</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.pushSubscribers}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email Subscribers</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.emailSubscribers}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Views Chart */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h2 className="font-semibold text-gray-900 mb-4">Views 7 Hari Terakhir</h2>
                    <div className="h-48 flex items-end gap-2">
                        {dailyStats.map((day, i) => {
                            const maxCount = Math.max(...dailyStats.map(d => d.count), 1)
                            const height = (day.count / maxCount) * 100
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                    <div
                                        className="w-full bg-gradient-to-t from-purple-600 to-pink-500 rounded-t-md transition-all"
                                        style={{ height: `${Math.max(height, 4)}%` }}
                                    />
                                    <span className="text-xs text-gray-500">
                                        {new Date(day.date).toLocaleDateString('id-ID', { weekday: 'short' })}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Popular Posts */}
                <div className="bg-white rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between p-5 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-900">Berita Populer</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {popularPosts.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 text-sm">
                                Belum ada data views
                            </div>
                        ) : (
                            popularPosts.map((post, index) => (
                                <div key={post.id} className="p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <span className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-medium">
                                            {index + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                                        </div>
                                        <span className="text-sm text-gray-500">{post.views} views</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Posts */}
            <div className="bg-white rounded-xl border border-gray-200">
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900">Berita Terbaru</h2>
                    <Link href="/admin/posts" className="text-sm text-purple-600 hover:text-purple-700">
                        Lihat Semua
                    </Link>
                </div>
                <div className="divide-y divide-gray-100">
                    {recentPosts.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-sm">
                            Belum ada berita
                        </div>
                    ) : (
                        recentPosts.map((post) => (
                            <div key={post.id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-sm font-medium text-gray-900 truncate">
                                            {post.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {post.categories?.name || 'Tanpa Kategori'} • {new Date(post.created_at).toLocaleDateString('id-ID')}
                                        </p>
                                    </div>
                                    <span className={`flex-shrink-0 px-2.5 py-1 text-xs font-medium rounded-full ${post.status === 'published'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {post.status === 'published' ? 'Publikasi' : 'Draft'}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
