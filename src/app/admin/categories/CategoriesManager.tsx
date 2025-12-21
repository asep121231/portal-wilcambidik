'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCategory, updateCategory, deleteCategory } from '@/lib/actions/categories'

interface Category {
    id: string
    name: string
}

interface CategoriesManagerProps {
    initialCategories: Category[]
}

export default function CategoriesManager({ initialCategories }: CategoriesManagerProps) {
    const router = useRouter()
    const [categories, setCategories] = useState(initialCategories)
    const [newName, setNewName] = useState('')
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editingName, setEditingName] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newName.trim()) return
        setIsLoading(true)

        const result = await createCategory(newName.trim())
        if (result.data) {
            setCategories([...categories, result.data])
            setNewName('')
        }

        setIsLoading(false)
        router.refresh()
    }

    const handleUpdate = async (id: string) => {
        if (!editingName.trim()) return
        setIsLoading(true)

        await updateCategory(id, editingName.trim())
        setCategories(categories.map(c => c.id === id ? { ...c, name: editingName.trim() } : c))
        setEditingId(null)

        setIsLoading(false)
        router.refresh()
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Hapus kategori ini?')) return
        setIsLoading(true)

        await deleteCategory(id)
        setCategories(categories.filter(c => c.id !== id))

        setIsLoading(false)
        router.refresh()
    }

    return (
        <div className="space-y-4">
            {/* Add Form */}
            <form onSubmit={handleCreate} className="flex gap-2">
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Nama kategori baru"
                    className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    disabled={isLoading || !newName.trim()}
                    className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50"
                >
                    Tambah
                </button>
            </form>

            {/* List */}
            <div className="divide-y divide-gray-100">
                {categories.length === 0 ? (
                    <p className="py-8 text-center text-gray-500 text-sm">Belum ada kategori</p>
                ) : (
                    categories.map((category) => (
                        <div key={category.id} className="py-3 flex items-center justify-between gap-4">
                            {editingId === category.id ? (
                                <div className="flex-1 flex gap-2">
                                    <input
                                        type="text"
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                        className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        autoFocus
                                    />
                                    <button
                                        onClick={() => handleUpdate(category.id)}
                                        disabled={isLoading}
                                        className="px-3 py-2 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700"
                                    >
                                        Simpan
                                    </button>
                                    <button
                                        onClick={() => setEditingId(null)}
                                        className="px-3 py-2 bg-gray-100 text-gray-600 text-xs rounded-lg hover:bg-gray-200"
                                    >
                                        Batal
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <span className="text-sm text-gray-900">{category.name}</span>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => { setEditingId(category.id); setEditingName(category.name) }}
                                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category.id)}
                                            disabled={isLoading}
                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
