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
            color: 'bg-blue-500',
        },
        {
            label: 'Dipublikasi',
            value: stats.publishedPosts,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'bg-green-500',
        },
        {
            label: 'Kategori',
            value: stats.totalCategories,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
            ),
            color: 'bg-purple-500',
        },
    ]

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Selamat datang di Panel Admin</p>
                </div>
                <Link
                    href="/admin/posts/new"
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
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
                    <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center gap-4">
                            <div className={`${stat.color} p-3 rounded-lg text-white`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent posts */}
            <div className="bg-white rounded-xl border border-gray-200">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Berita Terbaru</h2>
                    <Link
                        href="/admin/posts"
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                        Lihat Semua
                    </Link>
                </div>

                {recentPosts.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        Belum ada berita
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {recentPosts.map((post: any) => (
                            <div key={post.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                                <div className="min-w-0 flex-1">
                                    <Link
                                        href={`/admin/posts/${post.id}/edit`}
                                        className="font-medium text-gray-900 hover:text-primary-600 truncate block"
                                    >
                                        {post.title}
                                    </Link>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {post.categories?.name || 'Tanpa Kategori'} • {new Date(post.created_at).toLocaleDateString('id-ID')}
                                    </p>
                                </div>
                                <span
                                    className={`ml-4 px-2 py-1 text-xs font-medium rounded-full ${post.status === 'published'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                        }`}
                                >
                                    {post.status === 'published' ? 'Publikasi' : 'Draft'}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
