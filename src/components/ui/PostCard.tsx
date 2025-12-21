import Link from 'next/link'
import StatusBadge from './StatusBadge'

interface PostCardProps {
    id: string
    title: string
    content: string
    categoryName: string | null
    urgency: string
    createdAt: string
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

    const excerpt = content.length > 150
        ? content.substring(0, 150) + '...'
        : content

    const showStatus = urgency === 'urgent' || urgency === 'deadline'

    return (
        <Link href={`/berita/${id}`} className="block group">
            <article className="card p-6">
                {/* Top: Badges */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                    {categoryName && (
                        <span className="badge badge-primary">{categoryName}</span>
                    )}
                    {showStatus && (
                        <StatusBadge status={urgency as 'urgent' | 'deadline' | 'general' | 'archive'} />
                    )}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-700 transition-colors">
                    {title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 line-clamp-3 mb-4 text-base leading-relaxed">
                    {excerpt}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <time className="text-sm text-gray-500">{formattedDate}</time>
                    <span className="text-sm font-medium text-purple-600 group-hover:text-purple-700 flex items-center gap-1">
                        Baca selengkapnya
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </span>
                </div>
            </article>
        </Link>
    )
}
