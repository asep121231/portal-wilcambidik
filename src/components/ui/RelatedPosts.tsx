import Link from 'next/link'

interface RelatedPost {
    id: string
    title: string
    created_at: string
    categories: { name: string } | null
}

interface RelatedPostsProps {
    posts: RelatedPost[]
}

// Category colors for thumbnails
const categoryColors: Record<string, string> = {
    'Surat Edaran': 'from-blue-500 to-cyan-400',
    'Pengumuman': 'from-purple-500 to-pink-400',
    'Undangan': 'from-pink-500 to-rose-400',
    'Laporan': 'from-green-500 to-emerald-400',
    'Kegiatan': 'from-orange-500 to-amber-400',
    'Umum': 'from-gray-500 to-slate-400',
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
    if (posts.length === 0) return null

    return (
        <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="flex items-center gap-3 text-xl font-bold text-gray-900 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                </div>
                <span>Berita Terkait</span>
            </h2>

            <div className="grid gap-4 md:grid-cols-3">
                {posts.map((post) => {
                    const categoryName = post.categories?.name || ''
                    const gradient = categoryColors[categoryName] || 'from-purple-500 to-pink-400'

                    return (
                        <Link
                            key={post.id}
                            href={`/berita/${post.id}`}
                            className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                        >
                            {/* Mini Thumbnail */}
                            <div className={`h-24 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                                <span className="text-3xl opacity-80">📰</span>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                {post.categories && (
                                    <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700 mb-2">
                                        {post.categories.name}
                                    </span>
                                )}
                                <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-purple-700 transition-colors text-sm">
                                    {post.title}
                                </h3>
                                <time className="block text-xs text-gray-500 mt-2">
                                    {new Date(post.created_at).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </time>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
