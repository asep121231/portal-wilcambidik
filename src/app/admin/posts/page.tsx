import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PostsTable from './PostsTable'

async function getPosts() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('posts')
        .select(`
      *,
      categories (*)
    `)
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
            {/* Page header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Kelola Berita</h1>
                    <p className="text-gray-500 mt-1">{posts.length} berita</p>
                </div>
                <Link
                    href="/admin/posts/new"
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Tambah Berita</span>
                </Link>
            </div>

            {/* Posts table */}
            <PostsTable posts={posts} />
        </div>
    )
}
