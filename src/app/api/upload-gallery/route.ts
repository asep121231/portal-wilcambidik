import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()

        const formData = await request.formData()
        const file = formData.get('file') as File
        const activityId = formData.get('activityId') as string
        const caption = formData.get('caption') as string

        if (!file || !activityId) {
            return NextResponse.json(
                { success: false, error: 'File dan activityId wajib diisi' },
                { status: 400 }
            )
        }

        // Convert File to ArrayBuffer then to Buffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const fileExt = file.name.split('.').pop()
        const fileName = `${activityId}/${Date.now()}.${fileExt}`

        // Upload to storage
        const { error: uploadError } = await supabase.storage
            .from('gallery')
            .upload(fileName, buffer, {
                contentType: file.type,
            })

        if (uploadError) {
            console.error('Upload error:', uploadError)
            return NextResponse.json(
                { success: false, error: 'Gagal mengupload foto' },
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
            { success: false, error: 'Terjadi kesalahan' },
            { status: 500 }
        )
    }
}
