import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import CategoryBadge from '@/components/ui/CategoryBadge'
import AttachmentCard from '@/components/ui/AttachmentCard'
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
        return {
            title: 'Berita Tidak Ditemukan',
        }
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
        hour: '2-digit',
        minute: '2-digit',
    })

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Back navigation */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Kembali ke Beranda</span>
                    </Link>
                </div>
            </div>

            {/* Article */}
            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 fade-in">
                    {/* Header */}
                    <header className="mb-8">
                        {post.categories && (
                            <div className="mb-4">
                                <CategoryBadge name={post.categories.name} size="md" />
                            </div>
                        )}

                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4">
                            {post.title}
                        </h1>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <time>{formattedDate}</time>
                            </div>
                        </div>
                    </header>

                    {/* Content */}
                    <div className="prose prose-lg max-w-none mb-8">
                        {post.content.split('\n').map((paragraph, index) => (
                            paragraph.trim() && (
                                <p key={index} className="text-gray-700 leading-relaxed mb-4">
                                    {paragraph}
                                </p>
                            )
                        ))}
                    </div>

                    {/* Attachments */}
                    {post.attachments && post.attachments.length > 0 && (
                        <section className="border-t border-gray-200 pt-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                </svg>
                                Lampiran ({post.attachments.length})
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {post.attachments.map((attachment) => (
                                    <AttachmentCard key={attachment.id} attachment={attachment} />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </article>
        </div>
    )
}
