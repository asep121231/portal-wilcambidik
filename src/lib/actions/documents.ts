'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface DocumentCategory {
    id: string
    name: string
    icon: string
}

export interface Document {
    id: string
    title: string
    description: string | null
    category_id: string | null
    file_url: string
    file_name: string
    file_type: string
    file_size: number
    download_count: number
    status: 'draft' | 'published'
    created_at: string
    document_categories?: DocumentCategory | null
}

export async function getDocumentCategories(): Promise<DocumentCategory[]> {
    const supabase = await createClient()

    const { data, error } = await (supabase as unknown as { from: (table: string) => { select: (cols: string) => { order: (col: string) => Promise<{ data: DocumentCategory[] | null, error: unknown }> } } })
        .from('document_categories')
        .select('*')
        .order('name')

    if (error) {
        console.error('Error fetching document categories:', error)
        return []
    }

    return data || []
}

export async function getDocuments(categoryId?: string): Promise<Document[]> {
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabase as any)
        .from('documents')
        .select('*, document_categories(*)')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

    if (categoryId) {
        query = query.eq('category_id', categoryId)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching documents:', error)
        return []
    }

    return data || []
}

export async function getAllDocuments(): Promise<Document[]> {
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
        .from('documents')
        .select('*, document_categories(*)')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching all documents:', error)
        return []
    }

    return data || []
}

export async function createDocument(formData: FormData) {
    const supabase = await createClient()

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const categoryId = formData.get('categoryId') as string
    const file = formData.get('file') as File

    if (!title || !file) {
        return { success: false, error: 'Judul dan file wajib diisi' }
    }

    try {
        // Upload file to storage
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `documents/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('attachments')
            .upload(filePath, file)

        if (uploadError) {
            console.error('Upload error:', uploadError)
            return { success: false, error: 'Gagal mengupload file' }
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('attachments')
            .getPublicUrl(filePath)

        // Insert document record
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: insertError } = await (supabase as any)
            .from('documents')
            .insert({
                title,
                description: description || null,
                category_id: categoryId || null,
                file_url: urlData.publicUrl,
                file_name: file.name,
                file_type: file.type || 'application/octet-stream',
                file_size: file.size,
                status: 'published',
            })

        if (insertError) {
            console.error('Insert error:', insertError)
            return { success: false, error: 'Gagal menyimpan dokumen' }
        }

        revalidatePath('/admin/documents')
        revalidatePath('/dokumen')
        return { success: true }
    } catch (error) {
        console.error('Error creating document:', error)
        return { success: false, error: 'Terjadi kesalahan' }
    }
}

export async function deleteDocument(id: string) {
    const supabase = await createClient()

    try {
        // Get document to find file path
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: doc } = await (supabase as any)
            .from('documents')
            .select('file_url')
            .eq('id', id)
            .single()

        if (doc?.file_url) {
            // Extract file path from URL
            const urlParts = doc.file_url.split('/attachments/')
            if (urlParts[1]) {
                await supabase.storage
                    .from('attachments')
                    .remove([urlParts[1]])
            }
        }

        // Delete document record
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from('documents')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Delete error:', error)
            return { success: false, error: 'Gagal menghapus dokumen' }
        }

        revalidatePath('/admin/documents')
        revalidatePath('/dokumen')
        return { success: true }
    } catch (error) {
        console.error('Error deleting document:', error)
        return { success: false, error: 'Terjadi kesalahan' }
    }
}

export async function trackDocumentDownload(documentId: string, userAgent?: string) {
    const supabase = await createClient()

    try {
        // Increment download_count using RPC function (bypasses RLS)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any).rpc('increment_download_count', {
            doc_id: documentId
        })

        if (error) {
            console.error('Error incrementing download count:', error)
        }

        // Also try to record in document_downloads table for detailed analytics
        const ipHash = Math.random().toString(36).substring(2, 15)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
            .from('document_downloads')
            .insert({
                document_id: documentId,
                user_agent: userAgent || null,
                ip_hash: ipHash,
            })
            .catch(() => {
                // Table might not exist yet, that's ok
            })
    } catch (error) {
        console.error('Error tracking document download:', error)
    }
}

export async function getDocumentDownloadCounts(): Promise<Record<string, number>> {
    const supabase = await createClient()

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data } = await (supabase as any)
            .from('document_downloads')
            .select('document_id')

        if (!data) return {}

        // Count downloads per document
        const counts: Record<string, number> = {}
        data.forEach((row: { document_id: string }) => {
            counts[row.document_id] = (counts[row.document_id] || 0) + 1
        })

        return counts
    } catch (error) {
        console.error('Error getting document download counts:', error)
        return {}
    }
}
