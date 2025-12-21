import Link from 'next/link'
import type { PostWithCategory } from '@/types/database'
import CategoryBadge from './CategoryBadge'
import StatusBadge from './StatusBadge'

interface PostCardCompactProps {
    post: PostWithCategory
}

export default function PostCardCompact({ post }: PostCardCompactProps) {
    const formattedDate = new Date(post.created_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })

    const excerpt = post.content.length > 100
        ? post.content.substring(0, 100) + '...'
        : post.content

    // Status can be urgent, deadline, general, or archive
    const status = (post.urgency || 'general') as 'urgent' | 'deadline' | 'general' | 'archive'
    const showStatusBadge = status !== 'general'

    return (
        <Link href={`/berita/${post.id}`} className="block group">
            <article className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                {/* Top row: Badges + Date */}
                <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        {post.categories && (
                            <CategoryBadge name={post.categories.name} size="sm" />
                        )}
                        {showStatusBadge && (
                            <StatusBadge status={status} size="sm" />
                        )}
                    </div>
                    <time className="text-xs text-gray-500 flex-shrink-0">{formattedDate}</time>
                </div>

                {/* Title */}
                <h3 className="text-base md:text-lg font-semibold text-gray-900 line-clamp-2 mb-1.5 group-hover:text-[#1E40AF] transition-colors">
                    {post.title}
                </h3>

                {/* Summary */}
                <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
                    {excerpt}
                </p>

                {/* Action */}
                <div className="flex items-center text-sm font-medium text-[#2563EB] group-hover:text-[#1E40AF] transition-colors">
                    Baca selengkapnya
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </article>
        </Link>
    )
}
