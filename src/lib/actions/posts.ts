'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Post, PostDetail } from '@/types/database'

export async function getPosts(includeUnpublished = false) {
    const supabase = await createClient()

    let query = supabase
        .from('posts')
        .select(`
      *,
      categories (*)
    `)
        .order('created_at', { ascending: false })

    if (!includeUnpublished) {
        query = query.eq('status', 'published')
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching posts:', error)
        return []
    }

    return data
}

export async function getPost(id: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('posts')
        .select(`
      *,
      categories (*),
      attachments (*)
    `)
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching post:', error)
        return null
    }

    return data as PostDetail
}

interface PostInput {
    title: string
    content: string
    category_id?: string | null
    status?: 'draft' | 'published'
    urgency?: 'urgent' | 'deadline' | 'general' | 'archive'
}

export async function createPost(input: PostInput) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('posts')
        .insert({
            title: input.title,
            content: input.content,
            category_id: input.category_id || null,
            status: input.status || 'draft',
            urgency: input.urgency || 'general',
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating post:', error)
        return { error: error.message }
    }

    revalidatePath('/')
    revalidatePath('/admin/posts')

    return { data }
}

export async function updatePost(id: string, input: PostInput) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('posts')
        .update({
            title: input.title,
            content: input.content,
            category_id: input.category_id || null,
            status: input.status || 'draft',
            urgency: input.urgency || 'general',
        })
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error updating post:', error)
        return { error: error.message }
    }

    revalidatePath('/')
    revalidatePath('/admin/posts')
    revalidatePath(`/berita/${id}`)

    return { data }
}

export async function deletePost(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting post:', error)
        return { error: error.message }
    }

    revalidatePath('/')
    revalidatePath('/admin/posts')

    return { success: true }
}

export async function togglePostStatus(id: string) {
    const supabase = await createClient()

    // Get current status first
    const { data: post } = await supabase
        .from('posts')
        .select('status')
        .eq('id', id)
        .single()

    if (!post) {
        return { error: 'Post not found' }
    }

    const newStatus = post.status === 'published' ? 'draft' : 'published'

    const { error } = await supabase
        .from('posts')
        .update({ status: newStatus })
        .eq('id', id)

    if (error) {
        console.error('Error toggling status:', error)
        return { error: error.message }
    }

    revalidatePath('/')
    revalidatePath('/admin/posts')

    return { success: true }
}

// Get posts with thumbnail image for cards
export interface PostWithThumbnail {
    id: string
    title: string
    content: string
    category_id: string | null
    status: string
    urgency: string
    created_at: string
    updated_at: string
    category_name: string | null
    thumbnail_url: string | null
    attachment_count: number
}

export async function getPostsWithThumbnails(params: {
    categoryId?: string
    page?: number
    limit?: number
}): Promise<{ posts: PostWithThumbnail[]; total: number }> {
    const supabase = await createClient()
    const { categoryId, page = 1, limit = 9 } = params
    const offset = (page - 1) * limit

    let query = supabase
        .from('posts')
        .select(`
            *,
            categories (name),
            attachments (file_url, file_name)
        `, { count: 'exact' })
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

    if (categoryId) {
        query = query.eq('category_id', categoryId)
    }

    const { data, count, error } = await query

    if (error) {
        console.error('Error fetching posts with thumbnails:', error)
        return { posts: [], total: 0 }
    }

    // Process data to extract thumbnail and attachment count
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const posts: PostWithThumbnail[] = (data || []).map((post: any) => {
        const attachments = post.attachments || []

        // Find first image attachment for thumbnail
        const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
        const imageAttachment = attachments.find((att: { file_name: string; file_url: string }) => {
            const ext = att.file_name.split('.').pop()?.toLowerCase()
            return imageExts.includes(ext || '')
        })

        return {
            id: post.id,
            title: post.title,
            content: post.content,
            category_id: post.category_id,
            status: post.status,
            urgency: post.urgency,
            created_at: post.created_at,
            updated_at: post.updated_at,
            category_name: post.categories?.name || null,
            thumbnail_url: imageAttachment?.file_url || null,
            attachment_count: attachments.length,
        }
    })

    return { posts, total: count || 0 }
}

