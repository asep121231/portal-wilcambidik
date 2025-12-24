import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostAdmin } from '@/lib/actions/posts'
import { getCategories } from '@/lib/actions/categories'
import PostForm from '../../PostForm'

interface EditPostPageProps {
    params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: EditPostPageProps) {
    const { id } = await params
    const [post, categories] = await Promise.all([
        getPostAdmin(id),
        getCategories()
    ])

    if (!post) {
        notFound()
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/posts"
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Edit Berita</h1>
                    <p className="text-sm text-gray-500 truncate max-w-md">{post.title}</p>
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <PostForm
                    categories={categories}
                    existingPost={{
                        id: post.id,
                        title: post.title,
                        content: post.content,
                        category_id: post.category_id,
                        status: post.status,
                        urgency: post.urgency,
                        attachments: post.attachments || []
                    }}
                />
            </div>
        </div>
    )
}
