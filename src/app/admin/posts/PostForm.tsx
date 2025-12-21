'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createPost, updatePost } from '@/lib/actions/posts'
import { uploadAttachment, deleteAttachment } from '@/lib/actions/attachments'
import type { Category, PostDetail, Attachment } from '@/types/database'

interface PostFormProps {
    categories: Category[]
    post?: PostDetail
}

export default function PostForm({ categories, post }: PostFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [attachments, setAttachments] = useState<Attachment[]>(post?.attachments || [])
    const [isUploading, setIsUploading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true)
        setError(null)

        try {
            const result = post
                ? await updatePost(post.id, formData)
                : await createPost(formData)

            if (result.error) {
                setError(result.error)
                setIsSubmitting(false)
                return
            }

            router.push('/admin/posts')
            router.refresh()
        } catch (err) {
            setError('Terjadi kesalahan. Silakan coba lagi.')
            setIsSubmitting(false)
        }
    }

    async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!post || !e.target.files?.length) return

        const file = e.target.files[0]
        setIsUploading(true)

        const formData = new FormData()
        formData.append('file', file)

        const result = await uploadAttachment(post.id, formData)

        if (result.error) {
            alert(result.error)
        } else if (result.data) {
            setAttachments([...attachments, result.data])
        }

        setIsUploading(false)
        e.target.value = ''
    }

    async function handleDeleteAttachment(attachment: Attachment) {
        if (!post) return
        if (!confirm('Apakah Anda yakin ingin menghapus lampiran ini?')) return

        const result = await deleteAttachment(attachment.id, attachment.file_url, post.id)

        if (result.error) {
            alert(result.error)
        } else {
            setAttachments(attachments.filter((a) => a.id !== attachment.id))
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Judul <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        required
                        defaultValue={post?.title || ''}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Masukkan judul berita"
                    />
                </div>

                {/* Category */}
                <div>
                    <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
                        Kategori
                    </label>
                    <select
                        id="category_id"
                        name="category_id"
                        defaultValue={post?.category_id || ''}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                        <option value="">Pilih Kategori</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Content */}
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                        Isi Berita <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        required
                        rows={10}
                        defaultValue={post?.content || ''}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-y"
                        placeholder="Tulis isi berita di sini..."
                    />
                </div>

                {/* Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                            Status Publikasi
                        </label>
                        <select
                            id="status"
                            name="status"
                            defaultValue={post?.status || 'draft'}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="draft">📝 Draft</option>
                            <option value="published">✅ Publikasi</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-2">
                            Tingkat Kepentingan
                        </label>
                        <select
                            id="urgency"
                            name="urgency"
                            defaultValue={post?.urgency || 'general'}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="urgent">🔴 Mendesak</option>
                            <option value="deadline">🟡 Batas Waktu</option>
                            <option value="general">🔵 Umum</option>
                            <option value="archive">⚫ Arsip</option>
                        </select>
                        <p className="mt-1 text-xs text-gray-500">Pilih tingkat kepentingan berita</p>
                    </div>
                </div>
            </div>

            {/* Attachments (only for edit) */}
            {post && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">Lampiran</h3>
                        <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors cursor-pointer">
                            {isUploading ? (
                                <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                            )}
                            <span>Upload File</span>
                            <input
                                type="file"
                                className="hidden"
                                onChange={handleFileUpload}
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                                disabled={isUploading}
                            />
                        </label>
                    </div>

                    {attachments.length === 0 ? (
                        <p className="text-gray-500 text-sm">Belum ada lampiran</p>
                    ) : (
                        <div className="space-y-2">
                            {attachments.map((attachment) => (
                                <div
                                    key={attachment.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                        </svg>
                                        <span className="text-sm text-gray-700 truncate">{attachment.file_name}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteAttachment(attachment)}
                                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
                <Link
                    href="/admin/posts"
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                    Batal
                </Link>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Menyimpan...</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{post ? 'Simpan Perubahan' : 'Simpan Berita'}</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}
