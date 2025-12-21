'use client'

import Link from 'next/link'
import { useState } from 'react'
import { deletePost, togglePostStatus } from '@/lib/actions/posts'
import type { PostWithCategory } from '@/types/database'

interface PostsTableProps {
    posts: PostWithCategory[]
}

export default function PostsTable({ posts }: PostsTableProps) {
    const [isDeleting, setIsDeleting] = useState<string | null>(null)
    const [isToggling, setIsToggling] = useState<string | null>(null)

    async function handleDelete(id: string) {
        if (!confirm('Apakah Anda yakin ingin menghapus berita ini?')) return

        setIsDeleting(id)
        await deletePost(id)
        setIsDeleting(null)
    }

    async function handleToggleStatus(id: string, currentStatus: string) {
        setIsToggling(id)
        await togglePostStatus(id, currentStatus)
        setIsToggling(null)
    }

    if (posts.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <svg
                    className="w-16 h-16 mx-auto text-gray-300 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
                <h3 className="text-lg font-medium text-gray-600 mb-2">Belum ada berita</h3>
                <p className="text-gray-500 mb-4">Mulai dengan membuat berita pertama Anda</p>
                <Link
                    href="/admin/posts/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Tambah Berita</span>
                </Link>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Judul</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Kategori</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Tanggal</th>
                            <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {posts.map((post) => (
                            <tr key={post.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <Link
                                        href={`/admin/posts/${post.id}/edit`}
                                        className="font-medium text-gray-900 hover:text-primary-600 line-clamp-1"
                                    >
                                        {post.title}
                                    </Link>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-gray-500">
                                        {post.categories?.name || 'Tanpa Kategori'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleToggleStatus(post.id, post.status)}
                                        disabled={isToggling === post.id}
                                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full transition-colors ${post.status === 'published'
                                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                            }`}
                                    >
                                        {isToggling === post.id ? (
                                            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        ) : null}
                                        {post.status === 'published' ? 'Publikasi' : 'Draft'}
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-gray-500">
                                        {new Date(post.created_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/berita/${post.id}`}
                                            target="_blank"
                                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                            title="Lihat"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </Link>
                                        <Link
                                            href={`/admin/posts/${post.id}/edit`}
                                            className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                                            title="Edit"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            disabled={isDeleting === post.id}
                                            className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                                            title="Hapus"
                                        >
                                            {isDeleting === post.id ? (
                                                <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            )}
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
