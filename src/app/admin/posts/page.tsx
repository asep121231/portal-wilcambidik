import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PostsTable from './PostsTable'

async function getPosts() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('posts')
        .select('id, title, content, status, urgency, created_at, categories(name)')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching posts:', error)
        return []
    }

    return data
}

export default async function AdminPostsPage() {
    const posts = await getPosts()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Kelola Berita</h1>
                    <p className="text-sm text-gray-500">{posts.length} total berita</p>
                </div>
                <Link
                    href="/admin/posts/new"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Berita
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {posts.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Belum Ada Berita</h3>
                        <p className="text-sm text-gray-500 mb-4">Mulai dengan menambahkan berita pertama</p>
                        <Link
                            href="/admin/posts/new"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                        >
                            Tambah Berita
                        </Link>
                    </div>
                ) : (
                    <PostsTable posts={posts} />
                )}
            </div>
        </div>
    )
}
