'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface ActivityCategory {
    id: string
    name: string
    icon: string
}

export interface ActivityPhoto {
    id: string
    activity_id: string
    photo_url: string
    caption: string | null
    sort_order: number
}

export interface Activity {
    id: string
    title: string
    description: string | null
    category_id: string | null
    activity_date: string
    location: string | null
    status: 'draft' | 'published'
    created_at: string
    activity_categories?: ActivityCategory | null
    activity_photos?: ActivityPhoto[]
}

export async function getActivityCategories(): Promise<ActivityCategory[]> {
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
        .from('activity_categories')
        .select('*')
        .order('name')

    if (error) {
        console.error('Error fetching activity categories:', error)
        return []
    }

    return data || []
}

export async function getActivities(categoryId?: string, publishedOnly = true): Promise<Activity[]> {
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabase as any)
        .from('activities')
        .select('*, activity_categories(*), activity_photos(*)')
        .order('created_at', { ascending: false })

    if (publishedOnly) {
        query = query.eq('status', 'published')
    }

    if (categoryId) {
        query = query.eq('category_id', categoryId)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching activities:', error)
        return []
    }

    return data || []
}

export async function getActivity(id: string): Promise<Activity | null> {
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
        .from('activities')
        .select('*, activity_categories(*), activity_photos(*)')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching activity:', error)
        return null
    }

    return data
}

export async function createActivity(formData: FormData) {
    const supabase = await createClient()

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const categoryId = formData.get('categoryId') as string
    const activityDate = formData.get('activityDate') as string
    const location = formData.get('location') as string
    const status = formData.get('status') as string

    if (!title) {
        return { success: false, error: 'Judul wajib diisi' }
    }

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
            .from('activities')
            .insert({
                title,
                description: description || null,
                category_id: categoryId || null,
                activity_date: activityDate || new Date().toISOString().split('T')[0],
                location: location || null,
                status: status || 'published',
            })
            .select()
            .single()

        if (error) {
            console.error('Insert error:', error)
            return { success: false, error: 'Gagal menambahkan kegiatan' }
        }

        revalidatePath('/admin/gallery')
        revalidatePath('/galeri')
        return { success: true, data }
    } catch (error) {
        console.error('Error creating activity:', error)
        return { success: false, error: 'Terjadi kesalahan' }
    }
}

export async function updateActivity(id: string, formData: FormData) {
    const supabase = await createClient()

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const categoryId = formData.get('categoryId') as string
    const activityDate = formData.get('activityDate') as string
    const location = formData.get('location') as string
    const status = formData.get('status') as string

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from('activities')
            .update({
                title,
                description: description || null,
                category_id: categoryId || null,
                activity_date: activityDate || new Date().toISOString().split('T')[0],
                location: location || null,
                status: status || 'published',
            })
            .eq('id', id)

        if (error) {
            console.error('Update error:', error)
            return { success: false, error: 'Gagal mengupdate kegiatan' }
        }

        revalidatePath('/admin/gallery')
        revalidatePath('/galeri')
        return { success: true }
    } catch (error) {
        console.error('Error updating activity:', error)
        return { success: false, error: 'Terjadi kesalahan' }
    }
}

export async function deleteActivity(id: string) {
    const supabase = await createClient()

    try {
        // Delete photos from storage first
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: photos } = await (supabase as any)
            .from('activity_photos')
            .select('photo_url')
            .eq('activity_id', id)

        if (photos && photos.length > 0) {
            const filePaths = photos.map((p: { photo_url: string }) => {
                const url = new URL(p.photo_url)
                return url.pathname.split('/gallery/')[1]
            }).filter(Boolean)

            if (filePaths.length > 0) {
                await supabase.storage.from('gallery').remove(filePaths)
            }
        }

        // Delete activity (photos will cascade delete)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from('activities')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Delete error:', error)
            return { success: false, error: 'Gagal menghapus kegiatan' }
        }

        revalidatePath('/admin/gallery')
        revalidatePath('/galeri')
        return { success: true }
    } catch (error) {
        console.error('Error deleting activity:', error)
        return { success: false, error: 'Terjadi kesalahan' }
    }
}

export async function uploadActivityPhoto(activityId: string, file: File, caption?: string) {
    const supabase = await createClient()

    try {
        const fileExt = file.name.split('.').pop()
        const fileName = `${activityId}/${Date.now()}.${fileExt}`

        // Upload to storage
        const { error: uploadError } = await supabase.storage
            .from('gallery')
            .upload(fileName, file)

        if (uploadError) {
            console.error('Upload error:', uploadError)
            return { success: false, error: 'Gagal mengupload foto' }
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('gallery')
            .getPublicUrl(fileName)

        // Insert photo record
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: insertError } = await (supabase as any)
            .from('activity_photos')
            .insert({
                activity_id: activityId,
                photo_url: urlData.publicUrl,
                caption: caption || null,
            })

        if (insertError) {
            console.error('Insert photo error:', insertError)
            return { success: false, error: 'Gagal menyimpan data foto' }
        }

        revalidatePath('/admin/gallery')
        revalidatePath('/galeri')
        return { success: true, url: urlData.publicUrl }
    } catch (error) {
        console.error('Error uploading photo:', error)
        return { success: false, error: 'Terjadi kesalahan' }
    }
}

export async function deleteActivityPhoto(photoId: string, photoUrl: string) {
    const supabase = await createClient()

    try {
        // Delete from storage
        const url = new URL(photoUrl)
        const filePath = url.pathname.split('/gallery/')[1]

        if (filePath) {
            await supabase.storage.from('gallery').remove([filePath])
        }

        // Delete record
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from('activity_photos')
            .delete()
            .eq('id', photoId)

        if (error) {
            console.error('Delete photo error:', error)
            return { success: false, error: 'Gagal menghapus foto' }
        }

        revalidatePath('/admin/gallery')
        revalidatePath('/galeri')
        return { success: true }
    } catch (error) {
        console.error('Error deleting photo:', error)
        return { success: false, error: 'Terjadi kesalahan' }
    }
}
