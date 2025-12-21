import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import CategoryBadge from '@/components/ui/CategoryBadge'
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

function getFileIcon(fileType: string) {
    if (fileType.includes('pdf')) {
        return (
            <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zm-3 9.5c0 .83-.67 1.5-1.5 1.5H7v2H5.5v-6H9c.83 0 1.5.67 1.5 1.5v1zm5 3c0 .83-.67 1.5-1.5 1.5h-2.5v-6H14c.83 0 1.5.67 1.5 1.5v3zm4-3c0 .28-.22.5-.5.5H17v1h1.5v1H17v2h-1.5v-6h3c.28 0 .5.22.5.5v1z" />
            </svg>
        )
    }
    if (fileType.includes('word') || fileType.includes('doc')) {
        return (
            <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM7 17h2l1.5-5 1.5 5h2l2-8h-2l-1 4.5L11.5 9h-1l-1.5 4.5-1-4.5H6l2 8z" />
            </svg>
        )
    }
    if (fileType.includes('excel') || fileType.includes('sheet') || fileType.includes('xls')) {
        return (
            <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM7 17l2.5-3.5L7 10h2l1.5 2 1.5-2h2l-2.5 3.5L14 17h-2l-1.5-2-1.5 2H7z" />
            </svg>
        )
    }
    if (fileType.includes('image') || fileType.includes('jpg') || fileType.includes('png')) {
        return (
            <svg className="w-8 h-8 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
            </svg>
        )
    }
    return (
        <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4z" />
        </svg>
    )
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
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                </svg>
                                Lampiran ({post.attachments.length})
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {post.attachments.map((attachment) => (
                                    <a
                                        key={attachment.id}
                                        href={attachment.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 hover:border-primary-300 transition-colors"
                                    >
                                        {getFileIcon(attachment.file_type)}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 truncate">
                                                {attachment.file_name}
                                            </p>
                                            <p className="text-sm text-gray-500 uppercase">
                                                {attachment.file_type.split('/').pop()}
                                            </p>
                                        </div>
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                    </a>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </article>
        </div>
    )
}
