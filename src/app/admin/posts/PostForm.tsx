'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { createPost, updatePost } from '@/lib/actions/posts'
import { uploadAttachment, deleteAttachment } from '@/lib/actions/attachments'

// Dynamic import for RichTextEditor (SSR disabled)
const RichTextEditor = dynamic(() => import('@/components/ui/RichTextEditor'), {
    ssr: false,
    loading: () => (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 p-2 h-12" />
            <div className="min-h-[300px] p-4 animate-pulse bg-gray-100" />
        </div>
    ),
})

interface Category {
    id: string
    name: string
}

interface Attachment {
    id: string
    file_name: string
    file_url: string
}

interface PostFormProps {
    categories: Category[]
    existingPost?: {
        id: string
        title: string
        content: string
        category_id: string | null
        status: string
        urgency: string
        attachments?: Attachment[]
    }
}

export default function PostForm({ categories, existingPost }: PostFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const [title, setTitle] = useState(existingPost?.title || '')
    const [content, setContent] = useState(existingPost?.content || '')
    const [categoryId, setCategoryId] = useState(existingPost?.category_id || '')
    const [status, setStatus] = useState(existingPost?.status || 'draft')
    const [urgency, setUrgency] = useState(existingPost?.urgency || 'general')
    const [attachments, setAttachments] = useState<Attachment[]>(existingPost?.attachments || [])
    const [isUploading, setIsUploading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            if (existingPost) {
                await updatePost(existingPost.id, {
                    title,
                    content,
                    category_id: categoryId || null,
                    status: status as 'draft' | 'published',
                    urgency: urgency as 'urgent' | 'deadline' | 'general' | 'archive'
                })
            } else {
                await createPost({
                    title,
                    content,
                    category_id: categoryId || null,
                    status: status as 'draft' | 'published',
                    urgency: urgency as 'urgent' | 'deadline' | 'general' | 'archive'
                })
            }
            router.push('/admin/posts')
            router.refresh()
        } catch {
            setError('Gagal menyimpan berita')
        } finally {
            setIsLoading(false)
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !existingPost) return
        setIsUploading(true)

        for (const file of Array.from(e.target.files)) {
            try {
                const result = await uploadAttachment(existingPost.id, file)
                if (result.data) {
                    setAttachments(prev => [...prev, result.data])
                }
            } catch (err) {
                console.error('Upload error:', err)
            }
        }

        setIsUploading(false)
        e.target.value = ''
    }

    const handleDeleteAttachment = async (attachmentId: string) => {
        if (!confirm('Hapus lampiran ini?')) return
        await deleteAttachment(attachmentId)
        setAttachments(prev => prev.filter(a => a.id !== attachmentId))
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Judul <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Masukkan judul berita"
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {/* Content */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Isi Berita <span className="text-red-500">*</span>
                </label>
                <RichTextEditor
                    content={content}
                    onChange={setContent}
                    placeholder="Tulis isi berita di sini..."
                />
            </div>

            {/* Category & Status Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Kategori
                    </label>
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                        <option value="">Pilih Kategori</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Status
                    </label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Publikasi</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Tingkat Kepentingan
                    </label>
                    <select
                        value={urgency}
                        onChange={(e) => setUrgency(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                        <option value="general">Umum</option>
                        <option value="urgent">Mendesak</option>
                        <option value="deadline">Batas Waktu</option>
                        <option value="archive">Arsip</option>
                    </select>
                </div>
            </div>

            {/* Attachments (only for existing post) */}
            {existingPost && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Lampiran
                    </label>

                    {/* Upload Progress */}
                    {isUploading && (
                        <div className="flex items-center gap-3 p-4 bg-purple-50 border border-purple-200 rounded-xl mb-3">
                            <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-purple-700">Mengunggah file...</p>
                                <div className="mt-1 h-1.5 bg-purple-100 rounded-full overflow-hidden">
                                    <div className="h-full w-1/3 bg-gradient-to-r from-purple-600 to-orange-500 rounded-full animate-progress-indeterminate" />
                                </div>
                            </div>
                        </div>
                    )}

                    {attachments.length > 0 && (
                        <div className="space-y-2 mb-3">
                            {attachments.map((att) => (
                                <div key={att.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-sm text-gray-700 truncate">{att.file_name}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteAttachment(att.id)}
                                        className="text-red-500 hover:text-red-700 text-xs"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <label className={`flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-xl transition-colors ${isUploading ? 'border-purple-400 bg-purple-50 cursor-wait' : 'border-gray-200 hover:border-blue-400 cursor-pointer'}`}>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="text-sm text-gray-500">
                            {isUploading ? 'Mohon tunggu...' : 'Klik untuk upload file'}
                        </span>
                        <input
                            type="file"
                            onChange={handleFileUpload}
                            disabled={isUploading}
                            multiple
                            className="hidden"
                        />
                    </label>
                </div>
            )}

            {/* Submit */}
            <div className="flex items-center gap-3 pt-4">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    {isLoading ? 'Menyimpan...' : existingPost ? 'Simpan Perubahan' : 'Buat Berita'}
                </button>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors"
                >
                    Batal
                </button>
            </div>
        </form>
    )
}
