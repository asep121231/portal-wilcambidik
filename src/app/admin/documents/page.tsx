'use client'

import { useState, useEffect } from 'react'
import { getAllDocuments, getDocumentCategories, createDocument, deleteDocument, type Document, type DocumentCategory } from '@/lib/actions/documents'

export default function AdminDocumentsPage() {
    const [documents, setDocuments] = useState<Document[]>([])
    const [categories, setCategories] = useState<DocumentCategory[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isUploading, setIsUploading] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

    useEffect(() => {
        loadData()
    }, [])

    async function loadData() {
        const [docs, cats] = await Promise.all([
            getAllDocuments(),
            getDocumentCategories()
        ])
        setDocuments(docs)
        setCategories(cats)
        setIsLoading(false)
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsUploading(true)

        const form = e.currentTarget
        const formData = new FormData(form)

        const result = await createDocument(formData)

        if (result.success) {
            setNotification({ type: 'success', message: 'Dokumen berhasil ditambahkan!' })
            setShowForm(false)
            form.reset()
            loadData()
        } else {
            setNotification({ type: 'error', message: result.error || 'Gagal menambahkan dokumen' })
        }

        setIsUploading(false)
        setTimeout(() => setNotification(null), 3000)
    }

    async function handleDelete(id: string, title: string) {
        if (!confirm(`Hapus dokumen "${title}"?`)) return

        const result = await deleteDocument(id)
        if (result.success) {
            setNotification({ type: 'success', message: 'Dokumen berhasil dihapus!' })
            loadData()
        } else {
            setNotification({ type: 'error', message: result.error || 'Gagal menghapus dokumen' })
        }
        setTimeout(() => setNotification(null), 3000)
    }

    function formatFileSize(bytes: number) {
        if (bytes === 0) return '0 B'
        const k = 1024
        const sizes = ['B', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
    }

    return (
        <div className="space-y-6">
            {/* Notification */}
            {notification && (
                <div className={`p-4 rounded-lg ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {notification.message}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Kelola Dokumen</h1>
                    <p className="text-sm text-gray-500">Upload dan kelola dokumen unduhan</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-orange-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-colors shadow-lg"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Dokumen
                </button>
            </div>

            {/* Upload Form */}
            {showForm && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Dokumen Baru</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Judul Dokumen *
                            </label>
                            <input
                                type="text"
                                name="title"
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Contoh: Template Surat Tugas"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Deskripsi
                            </label>
                            <textarea
                                name="description"
                                rows={2}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Deskripsi singkat tentang dokumen..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kategori
                            </label>
                            <select
                                name="categoryId"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="">Pilih Kategori</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.icon} {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                File *
                            </label>
                            <input
                                type="file"
                                name="file"
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Format: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, ZIP, RAR
                            </p>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={isUploading}
                                className={`flex items-center gap-2 px-6 py-2.5 font-medium rounded-lg transition-all ${isUploading ? 'bg-purple-400 text-white cursor-wait' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
                            >
                                {isUploading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Mengupload...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        Upload Dokumen
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                disabled={isUploading}
                                className="px-6 py-2.5 border border-gray-200 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Batal
                            </button>
                        </div>

                        {/* Upload Progress Bar */}
                        {isUploading && (
                            <div className="flex items-center gap-3 p-4 bg-purple-50 border border-purple-200 rounded-xl">
                                <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-purple-700">Mengunggah dokumen...</p>
                                    <div className="mt-1 h-1.5 bg-purple-100 rounded-full overflow-hidden">
                                        <div className="h-full w-1/3 bg-gradient-to-r from-purple-600 to-orange-500 rounded-full animate-progress-indeterminate" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            )}

            {/* Documents List */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center">
                        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="mt-2 text-sm text-gray-500">Memuat dokumen...</p>
                    </div>
                ) : documents.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">📂</span>
                        </div>
                        <p className="text-gray-500">Belum ada dokumen. Klik "Tambah Dokumen" untuk memulai.</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Dokumen</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Kategori</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Ukuran</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Unduhan</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {documents.map((doc) => (
                                <tr key={doc.id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">📄</span>
                                            <div>
                                                <p className="font-medium text-gray-900">{doc.title}</p>
                                                <p className="text-xs text-gray-500">{doc.file_name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        {doc.document_categories ? (
                                            <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                                                {doc.document_categories.name}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-600">
                                        {formatFileSize(doc.file_size)}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-600">
                                        {doc.download_count}x
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <a
                                                href={doc.file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                title="Download"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                            </a>
                                            <button
                                                onClick={() => handleDelete(doc.id, doc.title)}
                                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Hapus"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
