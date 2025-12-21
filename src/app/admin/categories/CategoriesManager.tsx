'use client'

import { useState } from 'react'
import { createCategory, updateCategory, deleteCategory } from '@/lib/actions/categories'
import type { Category } from '@/types/database'

interface CategoriesManagerProps {
    initialCategories: Category[]
}

export default function CategoriesManager({ initialCategories }: CategoriesManagerProps) {
    const [categories, setCategories] = useState(initialCategories)
    const [newName, setNewName] = useState('')
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editingName, setEditingName] = useState('')
    const [isCreating, setIsCreating] = useState(false)
    const [isDeleting, setIsDeleting] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault()
        if (!newName.trim()) return

        setIsCreating(true)
        setError(null)

        const formData = new FormData()
        formData.append('name', newName)

        const result = await createCategory(formData)

        if (result.error) {
            setError(result.error)
        } else if (result.data) {
            setCategories([...categories, result.data])
            setNewName('')
        }

        setIsCreating(false)
    }

    async function handleUpdate(id: string) {
        if (!editingName.trim()) return

        setError(null)

        const formData = new FormData()
        formData.append('name', editingName)

        const result = await updateCategory(id, formData)

        if (result.error) {
            setError(result.error)
        } else if (result.data) {
            setCategories(categories.map((c) => (c.id === id ? result.data : c)))
            setEditingId(null)
            setEditingName('')
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Apakah Anda yakin ingin menghapus kategori ini?')) return

        setIsDeleting(id)
        setError(null)

        const result = await deleteCategory(id)

        if (result.error) {
            setError(result.error)
        } else {
            setCategories(categories.filter((c) => c.id !== id))
        }

        setIsDeleting(null)
    }

    function startEdit(category: Category) {
        setEditingId(category.id)
        setEditingName(category.name)
    }

    function cancelEdit() {
        setEditingId(null)
        setEditingName('')
    }

    return (
        <div className="space-y-6">
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                </div>
            )}

            {/* Add new category */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Tambah Kategori Baru</h3>
                <form onSubmit={handleCreate} className="flex gap-3">
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Nama kategori"
                        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <button
                        type="submit"
                        disabled={isCreating || !newName.trim()}
                        className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isCreating ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        )}
                        <span>Tambah</span>
                    </button>
                </form>
            </div>

            {/* Categories list */}
            <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Daftar Kategori</h3>
                </div>

                {categories.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">Belum ada kategori</div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {categories.map((category) => (
                            <div key={category.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                                {editingId === category.id ? (
                                    <div className="flex-1 flex items-center gap-3">
                                        <input
                                            type="text"
                                            value={editingName}
                                            onChange={(e) => setEditingName(e.target.value)}
                                            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                            autoFocus
                                        />
                                        <button
                                            onClick={() => handleUpdate(category.id)}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={cancelEdit}
                                            className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <span className="font-medium text-gray-900">{category.name}</span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => startEdit(category)}
                                                className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category.id)}
                                                disabled={isDeleting === category.id}
                                                className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                                            >
                                                {isDeleting === category.id ? (
                                                    <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
