import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const formData = await request.formData()
        const file = formData.get('file') as File
        const activityId = formData.get('activityId') as string
        const caption = formData.get('caption') as string | null

        if (!file || !activityId) {
            return NextResponse.json(
                { success: false, error: 'File dan activity ID wajib diisi' },
                { status: 400 }
            )
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { success: false, error: 'Format file tidak didukung. Gunakan JPEG, PNG, GIF, atau WebP.' },
                { status: 400 }
            )
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024
        if (file.size > maxSize) {
            return NextResponse.json(
                { success: false, error: 'Ukuran file maksimal 5MB' },
                { status: 400 }
            )
        }

        const fileExt = file.name.split('.').pop()
        const fileName = `${activityId}/${Date.now()}.${fileExt}`

        // Convert File to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = new Uint8Array(arrayBuffer)

        // Upload to storage
        const { error: uploadError } = await supabase.storage
            .from('gallery')
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: false
            })

        if (uploadError) {
            console.error('Upload error:', uploadError)
            return NextResponse.json(
                { success: false, error: `Gagal mengupload foto: ${uploadError.message}` },
                { status: 500 }
            )
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
            // Try to delete the uploaded file if insert fails
            await supabase.storage.from('gallery').remove([fileName])
            return NextResponse.json(
                { success: false, error: 'Gagal menyimpan data foto' },
                { status: 500 }
            )
        }

        revalidatePath('/admin/gallery')
        revalidatePath('/galeri')

        return NextResponse.json({
            success: true,
            url: urlData.publicUrl
        })
    } catch (error) {
        console.error('Error uploading photo:', error)
        return NextResponse.json(
            { success: false, error: 'Terjadi kesalahan saat mengupload foto' },
            { status: 500 }
        )
    }
}
