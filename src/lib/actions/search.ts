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

export interface SearchResponse {
    data: SearchResult[]
    hasMore: boolean
    total: number
}

const DEFAULT_LIMIT = 10

export async function searchPosts(params: SearchParams): Promise<SearchResponse> {
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
        limit = DEFAULT_LIMIT
    } = params

    const offset = (page - 1) * limit
    // Fetch one extra to check if there are more
    const fetchLimit = limit + 1

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.rpc as any)('search_posts', {
        keyword: keyword || null,
        cat_id: categoryId || null,
        start_date: startDate || null,
        end_date: endDate || null,
        urgency_filter: urgency || null,
        file_types: fileTypes && fileTypes.length > 0 ? fileTypes : null,
        sort_order: sortOrder,
        page_limit: fetchLimit,
        page_offset: offset
    })

    if (error) {
        console.error('Search error:', error)
        return { data: [], hasMore: false, total: 0 }
    }

    const results = data as SearchResult[]
    const hasMore = results.length > limit

    return {
        data: hasMore ? results.slice(0, limit) : results,
        hasMore,
        total: results.length
    }
}
