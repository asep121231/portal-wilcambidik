import Link from 'next/link'

interface PostCardProps {
    id: string
    title: string
    content: string
    categoryName: string | null
    urgency: string
    createdAt: string
}

// Category thumbnail colors and patterns
const categoryThumbnails: Record<string, { gradient: string; icon: string }> = {
    'Surat Edaran': { gradient: 'from-blue-500 to-cyan-400', icon: '📋' },
    'Pengumuman': { gradient: 'from-purple-500 to-pink-400', icon: '📢' },
    'Undangan': { gradient: 'from-pink-500 to-rose-400', icon: '💌' },
    'Laporan': { gradient: 'from-green-500 to-emerald-400', icon: '📊' },
    'Kegiatan': { gradient: 'from-orange-500 to-amber-400', icon: '🎯' },
    'Umum': { gradient: 'from-gray-500 to-slate-400', icon: '📌' },
}

export default function PostCard({
    id,
    title,
    content,
    categoryName,
    urgency,
    createdAt
}: PostCardProps) {
    const formattedDate = new Date(createdAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })

    const excerpt = content.length > 120
        ? content.substring(0, 120) + '...'
        : content

    const urgencyBadge = {
        urgent: { label: 'MENDESAK', bg: 'bg-red-100', text: 'text-red-700' },
        deadline: { label: 'BATAS WAKTU', bg: 'bg-amber-100', text: 'text-amber-700' },
        general: null,
        archive: null,
    }[urgency]

    const thumbnail = categoryThumbnails[categoryName || ''] || { gradient: 'from-purple-500 to-pink-400', icon: '📄' }

    return (
        <Link href={`/berita/${id}`} className="block group">
            <article className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-gray-900/50 hover:-translate-y-1 transition-all duration-300">
                {/* Thumbnail */}
                <div className={`relative h-36 bg-gradient-to-br ${thumbnail.gradient} flex items-center justify-center overflow-hidden`}>
                    {/* Pattern overlay */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }} />
                    </div>

                    {/* Icon */}
                    <span className="text-6xl filter drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                        {thumbnail.icon}
                    </span>

                    {/* Urgency badge on thumbnail */}
                    {urgencyBadge && (
                        <span className={`absolute top-3 right-3 px-3 py-1 text-xs font-bold rounded-full shadow-lg ${urgencyBadge.bg} ${urgencyBadge.text}`}>
                            {urgencyBadge.label}
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="p-5">
                    {/* Category Badge */}
                    {categoryName && (
                        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 uppercase tracking-wide mb-3">
                            {categoryName}
                        </span>
                    )}

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
                        {title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2 text-sm leading-relaxed mb-4">
                        {excerpt}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                        <time className="text-xs text-gray-500 dark:text-gray-500">{formattedDate}</time>
                        <span className="text-xs font-medium text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 flex items-center gap-1">
                            Baca
                            <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    )
}
