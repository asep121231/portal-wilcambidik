import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

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
        categories: categoriesResult.count || 0,
    }
}

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
    const stats = await getStats()
    const recentPosts = await getRecentPosts()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-sm text-gray-500">Selamat datang di Panel Admin</p>
                </div>
                <Link
                    href="/admin/posts/new"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Berita
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Dipublikasi</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.publishedPosts}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Kategori</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.categories}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Posts */}
            <div className="bg-white rounded-xl border border-gray-200">
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900">Berita Terbaru</h2>
                    <Link href="/admin/posts" className="text-sm text-blue-600 hover:text-blue-700">
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
