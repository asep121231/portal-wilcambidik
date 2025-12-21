import Link from 'next/link'
import type { PostWithCategory } from '@/types/database'
import CategoryBadge from './CategoryBadge'

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

    const isUrgent = post.urgency === 'urgent'

    return (
        <Link href={`/berita/${post.id}`} className="block group">
            <article className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                {/* Top row: Badge + Date */}
                <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        {post.categories && (
                            <CategoryBadge name={post.categories.name} size="sm" />
                        )}
                        {isUrgent && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Penting
                            </span>
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
