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

    const excerpt = post.content.length > 120
        ? post.content.substring(0, 120) + '...'
        : post.content

    const status = (post.urgency || 'general') as 'urgent' | 'deadline' | 'general' | 'archive'
    const showStatusBadge = status === 'urgent' || status === 'deadline'

    return (
        <Link href={`/berita/${post.id}`} className="block group">
            <article className="gov-card">
                {/* Top: Badges */}
                <div className="flex items-center gap-2 flex-wrap mb-2">
                    {post.categories && (
                        <span className="badge badge-primary">{post.categories.name}</span>
                    )}
                    {showStatusBadge && (
                        <StatusBadge status={status} size="sm" />
                    )}
                    <span className="text-xs text-[#94A3B8] ml-auto">{formattedDate}</span>
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-[#0F172A] line-clamp-2 mb-1.5 group-hover:text-[#2563EB] transition-colors">
                    {post.title}
                </h3>

                {/* Summary */}
                <p className="text-sm text-[#475569] line-clamp-2 mb-3">
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
