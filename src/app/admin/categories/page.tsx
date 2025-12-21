import { getCategories } from '@/lib/actions/categories'
import CategoriesManager from './CategoriesManager'

export default async function AdminCategoriesPage() {
    const categories = await getCategories()

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Kelola Kategori</h1>
                <p className="text-gray-500 mt-1">Atur kategori untuk berita dan informasi</p>
            </div>

            <CategoriesManager initialCategories={categories} />
        </div>
    )
}
