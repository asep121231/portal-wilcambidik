import Link from 'next/link'
import StatusBadge from './StatusBadge'

interface PostCardSimpleProps {
    id: string
    title: string
    content: string
    categoryName: string | null
    urgency: string
    createdAt: string
}

export default function PostCardSimple({
    id,
    title,
    content,
    categoryName,
    urgency,
    createdAt
}: PostCardSimpleProps) {
    const formattedDate = new Date(createdAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })

    const excerpt = content.length > 120
        ? content.substring(0, 120) + '...'
        : content

    const showStatusBadge = urgency === 'urgent' || urgency === 'deadline'

    return (
        <Link href={`/berita/${id}`} className="block">
            <article className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors bg-white">
                {/* Title */}
                <h3 className="text-base font-medium text-gray-900 mb-1 line-clamp-2">
                    {title}
                </h3>

                {/* Meta */}
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <time>{formattedDate}</time>
                    {categoryName && (
                        <>
                            <span>•</span>
                            <span>{categoryName}</span>
                        </>
                    )}
                    {showStatusBadge && (
                        <>
                            <span>•</span>
                            <StatusBadge
                                status={urgency as 'urgent' | 'deadline' | 'general' | 'archive'}
                                size="sm"
                            />
                        </>
                    )}
                </div>

                {/* Excerpt */}
                <p className="text-sm text-gray-600 line-clamp-2">
                    {excerpt}
                </p>

                {/* Read More */}
                <span className="inline-block mt-2 text-sm text-blue-600 hover:underline">
                    Baca selengkapnya →
                </span>
            </article>
        </Link>
    )
}
