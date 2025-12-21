import Link from 'next/link'
import CategoryBadge from './CategoryBadge'
import type { PostWithCategory } from '@/types/database'

interface PostCardProps {
    post: PostWithCategory
}

export default function PostCard({ post }: PostCardProps) {
    const formattedDate = new Date(post.created_at).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    // Get excerpt from content (first 150 characters)
    const excerpt = post.content.length > 150
        ? post.content.substring(0, 150) + '...'
        : post.content

    return (
        <Link href={`/berita/${post.id}`}>
            <article className="bg-white rounded-xl border border-gray-200 p-6 card-hover">
                <div className="flex flex-col gap-3">
                    {/* Category & Date */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        {post.categories && <CategoryBadge name={post.categories.name} />}
                        <time className="text-sm text-gray-500">{formattedDate}</time>
                    </div>

                    {/* Title */}
                    <h2 className="text-lg font-semibold text-gray-900 line-clamp-2 hover:text-primary-600 transition-colors">
                        {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                        {excerpt}
                    </p>

                    {/* Read more */}
                    <div className="flex items-center gap-2 text-primary-600 text-sm font-medium mt-2">
                        <span>Baca selengkapnya</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </article>
        </Link>
    )
}
