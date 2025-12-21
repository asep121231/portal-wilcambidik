'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Category } from '@/types/database'

export async function getCategories() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

    if (error) {
        console.error('Error fetching categories:', error)
        return []
    }

    return data as Category[]
}

export async function createCategory(formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string

    if (!name || !name.trim()) {
        return { error: 'Nama kategori harus diisi' }
    }

    const { data, error } = await supabase
        .from('categories')
        .insert({ name: name.trim() })
        .select()
        .single()

    if (error) {
        if (error.code === '23505') {
            return { error: 'Kategori dengan nama ini sudah ada' }
        }
        console.error('Error creating category:', error)
        return { error: error.message }
    }

    revalidatePath('/')
    revalidatePath('/admin/categories')

    return { data }
}

export async function updateCategory(id: string, formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string

    if (!name || !name.trim()) {
        return { error: 'Nama kategori harus diisi' }
    }

    const { data, error } = await supabase
        .from('categories')
        .update({ name: name.trim() })
        .eq('id', id)
        .select()
        .single()

    if (error) {
        if (error.code === '23505') {
            return { error: 'Kategori dengan nama ini sudah ada' }
        }
        console.error('Error updating category:', error)
        return { error: error.message }
    }

    revalidatePath('/')
    revalidatePath('/admin/categories')

    return { data }
}

export async function deleteCategory(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting category:', error)
        return { error: error.message }
    }

    revalidatePath('/')
    revalidatePath('/admin/categories')

    return { success: true }
}
