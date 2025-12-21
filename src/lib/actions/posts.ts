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
