import Link from 'next/link'
import type { PostWithCategory } from '@/types/database'
import CategoryBadge from './CategoryBadge'

interface PostCardProps {
    post: PostWithCategory
}

export default function PostCard({ post }: PostCardProps) {
    const formattedDate = new Date(post.created_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })

    // Get excerpt from content
    const excerpt = post.content.length > 120
        ? post.content.substring(0, 120) + '...'
        : post.content

    const isUrgent = post.urgency === 'urgent'

    return (
        <Link href={`/berita/${post.id}`} className="block group">
            <article className="card h-full p-5 flex flex-col">
                {/* Header with badges */}
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex flex-wrap gap-2">
                        {post.categories && (
                            <CategoryBadge name={post.categories.name} size="sm" />
                        )}
                        {isUrgent && (
                            <span className="badge badge-urgent">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Penting
                            </span>
                        )}
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#1E40AF] transition-colors">
                    {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3 flex-1">
                    {excerpt}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <time className="text-xs text-gray-500 flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formattedDate}
                    </time>

                    <span className="text-xs font-medium text-[#2563EB] group-hover:text-[#1E40AF] flex items-center gap-1 transition-colors">
                        Selengkapnya
                        <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </span>
                </div>
            </article>
        </Link>
    )
}
