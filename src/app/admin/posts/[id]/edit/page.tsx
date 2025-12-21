import { notFound } from 'next/navigation'
import PostForm from '../../PostForm'
import { getPost } from '@/lib/actions/posts'
import { getCategories } from '@/lib/actions/categories'

interface EditPostPageProps {
    params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: EditPostPageProps) {
    const { id } = await params

    const [post, categories] = await Promise.all([
        getPost(id),
        getCategories(),
    ])

    if (!post) {
        notFound()
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Berita</h1>
                <p className="text-gray-500 mt-1">Perbarui informasi berita</p>
            </div>

            <PostForm categories={categories} post={post} />
        </div>
    )
}
