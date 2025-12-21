import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import StatusBadge from '@/components/ui/StatusBadge'
import type { PostDetail } from '@/types/database'
import type { Metadata } from 'next'

interface PostPageProps {
    params: Promise<{ id: string }>
}

async function getPost(id: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('posts')
        .select(`
      *,
      categories (*),
      attachments (*)
    `)
        .eq('id', id)
        .eq('status', 'published')
        .single()

    if (error || !data) {
        return null
    }

    return data as PostDetail
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
    const { id } = await params
    const post = await getPost(id)

    if (!post) {
        return { title: 'Berita Tidak Ditemukan' }
    }

    return {
        title: post.title,
        description: post.content.substring(0, 160),
    }
}

export default async function PostPage({ params }: PostPageProps) {
    const { id } = await params
    const post = await getPost(id)

    if (!post) {
        notFound()
    }

    const formattedDate = new Date(post.created_at).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    const showStatus = post.urgency === 'urgent' || post.urgency === 'deadline'

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Back navigation */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-3xl mx-auto px-4 py-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali
                    </Link>
                </div>
            </div>

            {/* Content */}
            <article className="max-w-3xl mx-auto px-4 py-8">
                <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
                    {/* Header */}
                    <header className="mb-6">
                        {/* Badges */}
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                            {post.categories && (
                                <span className="badge badge-primary">{post.categories.name}</span>
                            )}
                            {showStatus && (
                                <StatusBadge status={post.urgency as 'urgent' | 'deadline' | 'general' | 'archive'} />
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-tight">
                            {post.title}
                        </h1>

                        {/* Meta */}
                        <time className="text-sm text-gray-500">{formattedDate}</time>
                    </header>

                    {/* Body */}
                    <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                        {post.content}
                    </div>

                    {/* Attachments */}
                    {post.attachments && post.attachments.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <h2 className="text-sm font-medium text-gray-900 mb-4">
                                Lampiran ({post.attachments.length})
                            </h2>
                            <div className="space-y-2">
                                {post.attachments.map((att) => (
                                    <a
                                        key={att.id}
                                        href={att.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                        <div className="min-w-0 flex-1">
                                            <span className="text-sm text-gray-700 truncate block">{att.file_name}</span>
                                        </div>
                                        <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </article>
        </div>
    )
}
