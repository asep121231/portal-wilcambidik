import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import StatusBadge from '@/components/ui/StatusBadge'
import ShareButton from '@/components/ui/ShareButton'
import CopyLinkButton from '@/components/ui/CopyLinkButton'
import ReadingTime from '@/components/ui/ReadingTime'
import RelatedPosts from '@/components/ui/RelatedPosts'
import ViewTracker from '@/components/ui/ViewTracker'
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

async function getRelatedPosts(categoryId: string | null, currentPostId: string) {
    if (!categoryId) return []

    const supabase = await createClient()

    const { data } = await supabase
        .from('posts')
        .select('id, title, created_at, categories(name)')
        .eq('category_id', categoryId)
        .eq('status', 'published')
        .neq('id', currentPostId)
        .order('created_at', { ascending: false })
        .limit(3)

    return data || []
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

// Helper function for file icons
function getFileIcon(fileName: string) {
    const ext = fileName.split('.').pop()?.toLowerCase()
    if (ext === 'pdf') return { icon: '📄', bg: 'bg-red-50' }
    if (['doc', 'docx'].includes(ext || '')) return { icon: '📝', bg: 'bg-blue-50' }
    if (['xls', 'xlsx'].includes(ext || '')) return { icon: '📊', bg: 'bg-green-50' }
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) return { icon: '🖼️', bg: 'bg-purple-50' }
    return { icon: '📎', bg: 'bg-gray-50' }
}

export default async function PostPage({ params }: PostPageProps) {
    const { id } = await params
    const post = await getPost(id)

    if (!post) {
        notFound()
    }

    // Get related posts from same category
    const relatedPosts = await getRelatedPosts(post.category_id, post.id)

    const formattedDate = new Date(post.created_at).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    const showStatus = post.urgency === 'urgent' || post.urgency === 'deadline'

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50/50 to-gray-50">
            {/* Track View */}
            <ViewTracker postId={post.id} />

            {/* Hero Header */}
            <div className="bg-gradient-to-r from-purple-600 to-orange-500 pt-8 pb-24">
                <div className="max-w-4xl mx-auto px-4 lg:px-8">
                    {/* Back Button */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8 group"
                    >
                        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="font-medium">Kembali ke Beranda</span>
                    </Link>

                    {/* Badges */}
                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                        {post.categories && (
                            <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                                {post.categories.name}
                            </span>
                        )}
                        {showStatus && (
                            <StatusBadge status={post.urgency as 'urgent' | 'deadline' | 'general' | 'archive'} />
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
                        {post.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 flex-wrap text-white/70">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <time className="text-sm">{formattedDate}</time>
                        </div>

                        {/* Reading Time */}
                        <ReadingTime content={post.content} />

                        {post.attachments && post.attachments.length > 0 && (
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                </svg>
                                <span className="text-sm">{post.attachments.length} Lampiran</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Card */}
            <article className="max-w-4xl mx-auto px-4 lg:px-8 -mt-16 pb-16">
                <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden">
                    {/* Content Body */}
                    <div className="p-6 md:p-10">
                        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                            {post.content}
                        </div>
                    </div>

                    {/* Attachments Section */}
                    {post.attachments && post.attachments.length > 0 && (
                        <div className="border-t border-gray-100 bg-gray-50/50 p-6 md:p-10">
                            <h2 className="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-6">
                                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                    </svg>
                                </div>
                                <span>Lampiran ({post.attachments.length})</span>
                            </h2>

                            <div className="grid gap-3 md:grid-cols-2">
                                {post.attachments.map((att) => {
                                    const fileStyle = getFileIcon(att.file_name)
                                    return (
                                        <a
                                            key={att.id}
                                            href={att.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-center gap-4 p-4 bg-white border border-gray-200 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-100/50 rounded-xl transition-all"
                                        >
                                            <div className={`w-12 h-12 ${fileStyle.bg} rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
                                                {fileStyle.icon}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-gray-900 truncate group-hover:text-purple-700 transition-colors">
                                                    {att.file_name}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    Klik untuk mengunduh
                                                </p>
                                            </div>
                                            <div className="w-10 h-10 bg-purple-100 group-hover:bg-purple-600 rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
                                                <svg className="w-5 h-5 text-purple-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                            </div>
                                        </a>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Share & Copy Section */}
                <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
                    <span className="text-sm text-gray-500">Bagikan:</span>
                    <ShareButton title={post.title} />
                    <CopyLinkButton />
                </div>

                {/* Related Posts */}
                <RelatedPosts posts={relatedPosts} />
            </article>
        </div>
    )
}
