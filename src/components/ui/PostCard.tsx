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
        month: 'short',
        year: 'numeric',
    })

    const excerpt = content.length > 120
        ? content.substring(0, 120) + '...'
        : content

    const showStatus = urgency === 'urgent' || urgency === 'deadline'

    return (
        <Link href={`/berita/${id}`} className="block">
            <article className="card p-4">
                {/* Top: Badges */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {categoryName && (
                        <span className="badge badge-primary">{categoryName}</span>
                    )}
                    {showStatus && (
                        <StatusBadge status={urgency as 'urgent' | 'deadline' | 'general' | 'archive'} />
                    )}
                </div>

                {/* Title */}
                <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 leading-snug">
                    {title}
                </h3>

                {/* Excerpt */}
                <p className="text-xs text-gray-600 line-clamp-2 mb-3 leading-relaxed">
                    {excerpt}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs">
                    <time className="text-gray-500">{formattedDate}</time>
                    <span className="text-blue-700 font-medium">Baca →</span>
                </div>
            </article>
        </Link>
    )
}
