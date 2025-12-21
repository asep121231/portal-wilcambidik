'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function uploadAttachment(postId: string, formData: FormData) {
    const supabase = await createClient()
    const file = formData.get('file') as File

    if (!file) {
        return { error: 'File tidak ditemukan' }
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name}`
    const filePath = `${postId}/${fileName}`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase
        .storage
        .from('attachments')
        .upload(filePath, file)

    if (uploadError) {
        console.error('Error uploading file:', uploadError)
        return { error: uploadError.message }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase
        .storage
        .from('attachments')
        .getPublicUrl(filePath)

    // Save attachment record
    const { data, error } = await supabase
        .from('attachments')
        .insert({
            post_id: postId,
            file_url: publicUrl,
            file_type: file.type,
            file_name: file.name,
        })
        .select()
        .single()

    if (error) {
        console.error('Error saving attachment:', error)
        return { error: error.message }
    }

    revalidatePath(`/berita/${postId}`)
    revalidatePath(`/admin/posts/${postId}/edit`)

    return { data }
}

export async function deleteAttachment(id: string, fileUrl: string, postId: string) {
    const supabase = await createClient()

    // Extract file path from URL
    const urlParts = fileUrl.split('/attachments/')
    if (urlParts.length > 1) {
        const filePath = urlParts[1]

        // Delete from storage
        const { error: storageError } = await supabase
            .storage
            .from('attachments')
            .remove([filePath])

        if (storageError) {
            console.error('Error deleting from storage:', storageError)
        }
    }

    // Delete record
    const { error } = await supabase
        .from('attachments')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting attachment:', error)
        return { error: error.message }
    }

    revalidatePath(`/berita/${postId}`)
    revalidatePath(`/admin/posts/${postId}/edit`)

    return { success: true }
}

export async function getAttachments(postId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('attachments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at')

    if (error) {
        console.error('Error fetching attachments:', error)
        return []
    }

    return data
}
