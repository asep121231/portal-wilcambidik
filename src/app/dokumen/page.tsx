'use client'

import { useState, useEffect } from 'react'
import { getDocuments, getDocumentCategories, type Document, type DocumentCategory } from '@/lib/actions/documents'

// File type icons
const fileIcons: Record<string, { icon: string; bg: string }> = {
    'application/pdf': { icon: '📄', bg: 'bg-red-100' },
    'application/msword': { icon: '📝', bg: 'bg-blue-100' },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { icon: '📝', bg: 'bg-blue-100' },
    'application/vnd.ms-excel': { icon: '📊', bg: 'bg-green-100' },
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { icon: '📊', bg: 'bg-green-100' },
    'application/vnd.ms-powerpoint': { icon: '📽️', bg: 'bg-orange-100' },
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': { icon: '📽️', bg: 'bg-orange-100' },
    'image/jpeg': { icon: '🖼️', bg: 'bg-purple-100' },
    'image/png': { icon: '🖼️', bg: 'bg-purple-100' },
    'application/zip': { icon: '📦', bg: 'bg-gray-100' },
}

function getFileIcon(fileType: string) {
    return fileIcons[fileType] || { icon: '📎', bg: 'bg-gray-100' }
}

function formatFileSize(bytes: number) {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<Document[]>([])
    const [categories, setCategories] = useState<DocumentCategory[]>([])
    const [selectedCategory, setSelectedCategory] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function loadData() {
            const [docs, cats] = await Promise.all([
                getDocuments(),
                getDocumentCategories()
            ])
            setDocuments(docs)
            setCategories(cats)
            setIsLoading(false)
        }
        loadData()
    }, [])

    const handleCategoryChange = async (categoryId: string) => {
        setSelectedCategory(categoryId)
        setIsLoading(true)
        const docs = await getDocuments(categoryId || undefined)
        setDocuments(docs)
        setIsLoading(false)
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-purple-600 to-orange-500 py-16">
                <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                        📥 Dokumen & Unduhan
                    </h1>
                    <p className="text-lg text-white/80 max-w-2xl mx-auto">
                        Download template surat dinas, format laporan, peraturan, dan panduan administrasi resmi
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    {/* Category Filter */}
                    <div className="flex flex-wrap justify-center gap-2 mb-10">
                        <button
                            onClick={() => handleCategoryChange('')}
                            className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all ${!selectedCategory
                                ? 'bg-gradient-to-r from-purple-600 to-orange-500 text-white shadow-lg'
                                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            Semua
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryChange(cat.id)}
                                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full transition-all ${selectedCategory === cat.id
                                    ? 'bg-gradient-to-r from-purple-600 to-orange-500 text-white shadow-lg'
                                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <span>{cat.icon}</span>
                                <span>{cat.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* Documents Grid */}
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                                        <div className="flex-1">
                                            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                                            <div className="h-4 bg-gray-100 dark:bg-gray-600 rounded w-1/2" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : documents.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                <span className="text-4xl">📂</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Belum ada dokumen
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Dokumen akan ditampilkan di sini setelah diunggah oleh admin
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {documents.map((doc) => {
                                const fileStyle = getFileIcon(doc.file_type)
                                return (
                                    <div
                                        key={doc.id}
                                        className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className={`w-14 h-14 ${fileStyle.bg} rounded-xl flex items-center justify-center text-3xl flex-shrink-0`}>
                                                {fileStyle.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                                                    {doc.title}
                                                </h3>
                                                {doc.document_categories && (
                                                    <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
                                                        {doc.document_categories.name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {doc.description && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                                                {doc.description}
                                            </p>
                                        )}

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                                <span>{formatFileSize(doc.file_size)}</span>
                                                <span>•</span>
                                                <span>{doc.download_count} unduhan</span>
                                            </div>
                                            <a
                                                href={doc.file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-orange-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                                Unduh
                                            </a>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
