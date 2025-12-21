import Link from 'next/link'
import StatusBadge from './StatusBadge'

interface PostCardModernProps {
    id: string
    title: string
    content: string
    categoryName: string | null
    urgency: string
    createdAt: string
}

export default function PostCardModern({
    id,
    title,
    content,
    categoryName,
    urgency,
    createdAt
}: PostCardModernProps) {
    const formattedDate = new Date(createdAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })

    const excerpt = content.length > 150
        ? content.substring(0, 150) + '...'
        : content

    const isUrgent = urgency === 'urgent'
    const isDeadline = urgency === 'deadline'

    return (
        <Link href={`/berita/${id}`} className="block group">
            <article className={`card p-5 ${isUrgent ? 'card-urgent' : isDeadline ? 'card-deadline' : ''}`}>
                {/* Badges Row */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {categoryName && (
                        <span className="badge badge-primary">
                            {categoryName}
                        </span>
                    )}
                    {(isUrgent || isDeadline) && (
                        <StatusBadge
                            status={urgency as 'urgent' | 'deadline' | 'general' | 'archive'}
                            size="sm"
                        />
                    )}
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
                    {excerpt}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <time className="text-xs text-gray-500 flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formattedDate}
                    </time>
                    <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700 flex items-center gap-1">
                        Baca
                        <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </span>
                </div>
            </article>
        </Link>
    )
}
