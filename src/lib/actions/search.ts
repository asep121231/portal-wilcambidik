'use server'

import { createClient } from '@/lib/supabase/server'

export interface SearchParams {
    keyword?: string
    categoryId?: string
    startDate?: string
    endDate?: string
    urgency?: string
    fileTypes?: string[]
    sortOrder?: 'asc' | 'desc'
    page?: number
    limit?: number
}

export interface SearchResult {
    id: string
    title: string
    content: string
    category_id: string | null
    status: string
    urgency: string
    created_at: string
    updated_at: string
    category_name: string | null
    attachment_count: number
}

export async function searchPosts(params: SearchParams): Promise<SearchResult[]> {
    const supabase = await createClient()

    const {
        keyword,
        categoryId,
        startDate,
        endDate,
        urgency,
        fileTypes,
        sortOrder = 'desc',
        page = 1,
        limit = 20
    } = params

    const offset = (page - 1) * limit

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.rpc as any)('search_posts', {
        keyword: keyword || null,
        cat_id: categoryId || null,
        start_date: startDate || null,
        end_date: endDate || null,
        urgency_filter: urgency || null,
        file_types: fileTypes && fileTypes.length > 0 ? fileTypes : null,
        sort_order: sortOrder,
        page_limit: limit,
        page_offset: offset
    })

    if (error) {
        console.error('Search error:', error)
        return []
    }

    return data as SearchResult[]
}
