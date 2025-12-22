'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { deletePost, togglePostStatus } from '@/lib/actions/posts'
import { sendNewPostNotification } from '@/lib/actions/email'

interface Post {
    id: string
    title: string
    content: string
    status: string
    urgency: string
    created_at: string
    categories: { name: string } | null
}

interface PostsTableProps {
    posts: Post[]
}

export default function PostsTable({ posts }: PostsTableProps) {
    const router = useRouter()
    const [loadingId, setLoadingId] = useState<string | null>(null)
    const [notifyingId, setNotifyingId] = useState<string | null>(null)
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

    const handleToggleStatus = async (postId: string) => {
        setLoadingId(postId)
        await togglePostStatus(postId)
        router.refresh()
        setLoadingId(null)
    }

    const handleDelete = async (postId: string) => {
        if (!confirm('Yakin ingin menghapus berita ini?')) return
        setLoadingId(postId)
        await deletePost(postId)
        router.refresh()
        setLoadingId(null)
    }

    const handleSendNotification = async (post: Post) => {
        if (!confirm(`Kirim notifikasi email ke semua subscriber tentang "${post.title}"?`)) return

        setNotifyingId(post.id)
        setNotification(null)

        try {
            const excerpt = post.content.length > 150
                ? post.content.substring(0, 150) + '...'
                : post.content

            const result = await sendNewPostNotification(
                post.title,
                excerpt,
                `/berita/${post.id}`
            )

            if (result.success) {
                setNotification({
                    type: 'success',
                    message: `Email berhasil dikirim ke ${result.sent || 0} subscriber!`
                })
            } else {
                setNotification({
                    type: 'error',
                    message: 'Gagal mengirim notifikasi'
                })
            }
        } catch {
            setNotification({
                type: 'error',
                message: 'Terjadi kesalahan'
            })
        }

        setNotifyingId(null)

        // Auto-hide notification after 5 seconds
        setTimeout(() => setNotification(null), 5000)
    }

    return (
        <div>
            {/* Notification Banner */}
            {notification && (
                <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium ${notification.type === 'success'
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                    {notification.message}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Judul</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600 hidden md:table-cell">Kategori</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600 hidden sm:table-cell">Tanggal</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-600">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {posts.map((post) => (
                            <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                                <td className="py-3 px-4">
                                    <div className="font-medium text-gray-900 truncate max-w-xs">
                                        {post.title}
                                    </div>
                                </td>
                                <td className="py-3 px-4 hidden md:table-cell">
                                    <span className="text-gray-600">
                                        {post.categories?.name || '-'}
                                    </span>
                                </td>
                                <td className="py-3 px-4 hidden sm:table-cell">
                                    <span className="text-gray-500 text-xs">
                                        {new Date(post.created_at).toLocaleDateString('id-ID')}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <button
                                        onClick={() => handleToggleStatus(post.id)}
                                        disabled={loadingId === post.id}
                                        className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${post.status === 'published'
                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {post.status === 'published' ? 'Publikasi' : 'Draft'}
                                    </button>
                                </td>
                                <td className="py-3 px-4 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        {/* Send Notification Button - Only for published posts */}
                                        {post.status === 'published' && (
                                            <button
                                                onClick={() => handleSendNotification(post)}
                                                disabled={notifyingId === post.id}
                                                className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                title="Kirim notifikasi ke subscriber"
                                            >
                                                {notifyingId === post.id ? (
                                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                )}
                                            </button>
                                        )}
                                        <Link
                                            href={`/admin/posts/${post.id}/edit`}
                                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            disabled={loadingId === post.id}
                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
            </div>
        </div>
    )
}
