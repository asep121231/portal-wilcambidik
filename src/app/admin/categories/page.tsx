import { getCategories } from '@/lib/actions/categories'
import CategoriesManager from './CategoriesManager'

export default async function AdminCategoriesPage() {
    const categories = await getCategories()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-xl font-bold text-gray-900">Kelola Kategori</h1>
                <p className="text-sm text-gray-500">{categories.length} kategori tersedia</p>
            </div>

            {/* Manager */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
                <CategoriesManager initialCategories={categories} />
            </div>
        </div>
    )
}
