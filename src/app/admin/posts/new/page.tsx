import PostForm from '../PostForm'
import { getCategories } from '@/lib/actions/categories'

export default async function NewPostPage() {
    const categories = await getCategories()

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Tambah Berita Baru</h1>
                <p className="text-gray-500 mt-1">Buat berita atau informasi kedinasan baru</p>
            </div>

            <PostForm categories={categories} />
        </div>
    )
}
