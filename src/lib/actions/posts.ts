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

export async function createPost(formData: FormData) {
    const supabase = await createClient()

    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const categoryId = formData.get('category_id') as string
    const status = formData.get('status') as 'draft' | 'published'
    const urgency = formData.get('urgency') as string || 'general'

    const { data, error } = await supabase
        .from('posts')
        .insert({
            title,
            content,
            category_id: categoryId || null,
            status: status || 'draft',
            urgency,
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

export async function updatePost(id: string, formData: FormData) {
    const supabase = await createClient()

    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const categoryId = formData.get('category_id') as string
    const status = formData.get('status') as 'draft' | 'published'
    const urgency = formData.get('urgency') as string || 'general'

    const { data, error } = await supabase
        .from('posts')
        .update({
            title,
            content,
            category_id: categoryId || null,
            status: status || 'draft',
            urgency,
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

export async function togglePostStatus(id: string, currentStatus: string) {
    const supabase = await createClient()

    const newStatus = currentStatus === 'published' ? 'draft' : 'published'

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
