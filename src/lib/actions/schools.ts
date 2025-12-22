'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface SchoolLevel {
    id: string
    name: string
    icon: string
    sort_order: number
}

export interface School {
    id: string
    level_id: string | null
    nama: string
    npsn: string
    status: 'Negeri' | 'Swasta'
    peserta_didik: number
    guru: number
    alamat: string | null
    school_levels?: SchoolLevel | null
}

export async function getSchoolLevels(): Promise<SchoolLevel[]> {
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
        .from('school_levels')
        .select('*')
        .order('sort_order')

    if (error) {
        console.error('Error fetching school levels:', error)
        return []
    }

    return data || []
}

export async function getSchools(levelId?: string): Promise<School[]> {
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabase as any)
        .from('schools')
        .select('*, school_levels(*)')
        .order('nama')

    if (levelId) {
        query = query.eq('level_id', levelId)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching schools:', error)
        return []
    }

    return data || []
}

export async function getSchoolStats() {
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: levels } = await (supabase as any)
        .from('school_levels')
        .select('*')
        .order('sort_order')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: schools } = await (supabase as any)
        .from('schools')
        .select('*')

    if (!levels || !schools) {
        return { levels: [], stats: [] }
    }

    const stats = levels.map((level: SchoolLevel) => {
        const levelSchools = schools.filter((s: School) => s.level_id === level.id)
        return {
            ...level,
            count: levelSchools.length,
            totalPd: levelSchools.reduce((acc: number, s: School) => acc + (s.peserta_didik || 0), 0),
            totalGuru: levelSchools.reduce((acc: number, s: School) => acc + (s.guru || 0), 0),
            schools: levelSchools
        }
    })

    return { levels, stats }
}

export async function createSchool(formData: FormData) {
    const supabase = await createClient()

    const levelId = formData.get('levelId') as string
    const nama = formData.get('nama') as string
    const npsn = formData.get('npsn') as string
    const status = formData.get('status') as string
    const pesertaDidik = parseInt(formData.get('pesertaDidik') as string) || 0
    const guru = parseInt(formData.get('guru') as string) || 0
    const alamat = formData.get('alamat') as string

    if (!nama || !npsn) {
        return { success: false, error: 'Nama dan NPSN wajib diisi' }
    }

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from('schools')
            .insert({
                level_id: levelId || null,
                nama,
                npsn,
                status: status || 'Negeri',
                peserta_didik: pesertaDidik,
                guru,
                alamat: alamat || null,
            })

        if (error) {
            console.error('Insert error:', error)
            if (error.code === '23505') {
                return { success: false, error: 'NPSN sudah terdaftar' }
            }
            return { success: false, error: 'Gagal menambahkan sekolah' }
        }

        revalidatePath('/admin/schools')
        revalidatePath('/data-sekolah')
        return { success: true }
    } catch (error) {
        console.error('Error creating school:', error)
        return { success: false, error: 'Terjadi kesalahan' }
    }
}

export async function updateSchool(id: string, formData: FormData) {
    const supabase = await createClient()

    const levelId = formData.get('levelId') as string
    const nama = formData.get('nama') as string
    const npsn = formData.get('npsn') as string
    const status = formData.get('status') as string
    const pesertaDidik = parseInt(formData.get('pesertaDidik') as string) || 0
    const guru = parseInt(formData.get('guru') as string) || 0
    const alamat = formData.get('alamat') as string

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from('schools')
            .update({
                level_id: levelId || null,
                nama,
                npsn,
                status: status || 'Negeri',
                peserta_didik: pesertaDidik,
                guru,
                alamat: alamat || null,
            })
            .eq('id', id)

        if (error) {
            console.error('Update error:', error)
            return { success: false, error: 'Gagal mengupdate sekolah' }
        }

        revalidatePath('/admin/schools')
        revalidatePath('/data-sekolah')
        return { success: true }
    } catch (error) {
        console.error('Error updating school:', error)
        return { success: false, error: 'Terjadi kesalahan' }
    }
}

export async function deleteSchool(id: string) {
    const supabase = await createClient()

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from('schools')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Delete error:', error)
            return { success: false, error: 'Gagal menghapus sekolah' }
        }

        revalidatePath('/admin/schools')
        revalidatePath('/data-sekolah')
        return { success: true }
    } catch (error) {
        console.error('Error deleting school:', error)
        return { success: false, error: 'Terjadi kesalahan' }
    }
}

export async function bulkCreateSchools(schools: Array<{
    level_id: string
    nama: string
    npsn: string
    status: 'Negeri' | 'Swasta'
    peserta_didik: number
    guru: number
}>) {
    const supabase = await createClient()

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from('schools')
            .upsert(schools, { onConflict: 'npsn' })

        if (error) {
            console.error('Bulk insert error:', error)
            return { success: false, error: 'Gagal menambahkan sekolah' }
        }

        revalidatePath('/admin/schools')
        revalidatePath('/data-sekolah')
        return { success: true }
    } catch (error) {
        console.error('Error bulk creating schools:', error)
        return { success: false, error: 'Terjadi kesalahan' }
    }
}
