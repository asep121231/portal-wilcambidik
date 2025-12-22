'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Attachment {
    id: string
    file_name: string
    file_url: string
}

interface AttachmentPreviewProps {
    attachments: Attachment[]
}

// Check if file is an image
function isImage(fileName: string): boolean {
    const ext = fileName.split('.').pop()?.toLowerCase()
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')
}

// Check if file is a PDF
function isPDF(fileName: string): boolean {
    return fileName.toLowerCase().endsWith('.pdf')
}

// Get file icon
function getFileIcon(fileName: string) {
    const ext = fileName.split('.').pop()?.toLowerCase()
    if (ext === 'pdf') return { icon: '📄', bg: 'bg-red-50 dark:bg-red-900/30', color: 'text-red-600' }
    if (['doc', 'docx'].includes(ext || '')) return { icon: '📝', bg: 'bg-blue-50 dark:bg-blue-900/30', color: 'text-blue-600' }
    if (['xls', 'xlsx'].includes(ext || '')) return { icon: '📊', bg: 'bg-green-50 dark:bg-green-900/30', color: 'text-green-600' }
    if (['ppt', 'pptx'].includes(ext || '')) return { icon: '📑', bg: 'bg-orange-50 dark:bg-orange-900/30', color: 'text-orange-600' }
    return { icon: '📎', bg: 'bg-gray-50 dark:bg-gray-700', color: 'text-gray-600' }
}

export default function AttachmentPreview({ attachments }: AttachmentPreviewProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [showPdfViewer, setShowPdfViewer] = useState<string | null>(null)

    // Separate images and documents
    const images = attachments.filter(att => isImage(att.file_name))
    const pdfs = attachments.filter(att => isPDF(att.file_name))
    const documents = attachments.filter(att => !isImage(att.file_name) && !isPDF(att.file_name))

    if (attachments.length === 0) return null

    return (
        <div className="space-y-8">
            {/* Image Gallery */}
            {images.length > 0 && (
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        <span className="text-xl">🖼️</span>
                        Gambar ({images.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {images.map((img) => (
                            <button
                                key={img.id}
                                onClick={() => setSelectedImage(img.file_url)}
                                className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer"
                            >
                                <Image
                                    src={img.file_url}
                                    alt={img.file_name}
                                    fill
                                    className="object-cover transition-transform group-hover:scale-105"
                                    sizes="(max-width: 768px) 50vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-gray-800/90 rounded-full p-2">
                                        <svg className="w-6 h-6 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                        </svg>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* PDF Previews */}
            {pdfs.length > 0 && (
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        <span className="text-xl">📄</span>
                        Dokumen PDF ({pdfs.length})
                    </h3>
                    <div className="space-y-3">
                        {pdfs.map((pdf) => (
                            <div key={pdf.id} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center text-xl">
                                            📄
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white text-sm">{pdf.file_name}</p>
                                            <p className="text-xs text-gray-500">PDF Document</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setShowPdfViewer(showPdfViewer === pdf.id ? null : pdf.id)}
                                            className="px-3 py-1.5 text-sm font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
                                        >
                                            {showPdfViewer === pdf.id ? '🔼 Tutup' : '👁️ Preview'}
                                        </button>
                                        <a
                                            href={pdf.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3 py-1.5 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                                        >
                                            📥 Unduh
                                        </a>
                                    </div>
                                </div>
                                {showPdfViewer === pdf.id && (
                                    <div className="h-[500px] bg-gray-100 dark:bg-gray-900">
                                        <iframe
                                            src={`${pdf.file_url}#toolbar=0`}
                                            className="w-full h-full"
                                            title={pdf.file_name}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Other Documents */}
            {documents.length > 0 && (
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        <span className="text-xl">📎</span>
                        Dokumen Lainnya ({documents.length})
                    </h3>
                    <div className="grid gap-3 md:grid-cols-2">
                        {documents.map((doc) => {
                            const fileStyle = getFileIcon(doc.file_name)
                            return (
                                <a
                                    key={doc.id}
                                    href={doc.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-lg rounded-xl transition-all"
                                >
                                    <div className={`w-12 h-12 ${fileStyle.bg} rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
                                        {fileStyle.icon}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
                                            {doc.file_name}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            Klik untuk mengunduh
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 group-hover:bg-purple-600 rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
                                        <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                    </div>
                                </a>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Lightbox Modal for Images */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="relative max-w-5xl max-h-[90vh] w-full h-full">
                        <Image
                            src={selectedImage}
                            alt="Preview"
                            fill
                            className="object-contain"
                            sizes="100vw"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
