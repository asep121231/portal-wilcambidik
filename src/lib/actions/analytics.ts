'use server'

import { createClient } from '@/lib/supabase/server'

// Track post view
export async function trackPostView(postId: string, userAgent?: string) {
    const supabase = await createClient()

    // Generate a simple hash for privacy (in production, use a proper hash)
    const ipHash = Math.random().toString(36).substring(2, 15)

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
            .from('post_views')
            .insert({
                post_id: postId,
                user_agent: userAgent || null,
                ip_hash: ipHash,
            })
    } catch (error) {
        console.error('Error tracking post view:', error)
    }
}

// Track attachment download
export async function trackAttachmentDownload(attachmentId: string, userAgent?: string) {
    const supabase = await createClient()

    const ipHash = Math.random().toString(36).substring(2, 15)

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
            .from('attachment_downloads')
            .insert({
                attachment_id: attachmentId,
                user_agent: userAgent || null,
                ip_hash: ipHash,
            })
    } catch (error) {
        console.error('Error tracking download:', error)
    }
}

// Get dashboard stats
export async function getDashboardStats() {
    const supabase = await createClient()

    // Total posts
    const { count: totalPosts } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published')

    // Total categories
    const { count: totalCategories } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true })

    // Total views (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    let totalViews = 0
    let totalDownloads = 0
    let pushSubscribers = 0
    let emailSubscribers = 0

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { count: views } = await (supabase as any)
            .from('post_views')
            .select('*', { count: 'exact', head: true })
            .gte('viewed_at', thirtyDaysAgo.toISOString())
        totalViews = views || 0
    } catch { /* table may not exist */ }

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { count: downloads } = await (supabase as any)
            .from('attachment_downloads')
            .select('*', { count: 'exact', head: true })
            .gte('downloaded_at', thirtyDaysAgo.toISOString())
        totalDownloads = downloads || 0
    } catch { /* table may not exist */ }

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { count: push } = await (supabase as any)
            .from('push_subscriptions')
            .select('*', { count: 'exact', head: true })
        pushSubscribers = push || 0
    } catch { /* table may not exist */ }

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { count: email } = await (supabase as any)
            .from('email_subscribers')
            .select('*', { count: 'exact', head: true })
            .eq('verified', true)
        emailSubscribers = email || 0
    } catch { /* table may not exist */ }

    return {
        totalPosts: totalPosts || 0,
        totalCategories: totalCategories || 0,
        totalViews,
        totalDownloads,
        pushSubscribers,
        emailSubscribers,
    }
}

// Get popular posts
export async function getPopularPosts(limit: number = 5) {
    const supabase = await createClient()

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: viewCounts } = await (supabase as any)
            .from('post_views')
            .select('post_id')
            .gte('viewed_at', thirtyDaysAgo.toISOString())

        if (!viewCounts || viewCounts.length === 0) {
            throw new Error('No views')
        }

        // Count views per post
        const viewMap: Record<string, number> = {}
        viewCounts.forEach((v: { post_id: string }) => {
            viewMap[v.post_id] = (viewMap[v.post_id] || 0) + 1
        })

        // Sort by views
        const sortedPostIds = Object.entries(viewMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([id]) => id)

        if (sortedPostIds.length === 0) throw new Error('No posts')

        // Get post details
        const { data: posts } = await supabase
            .from('posts')
            .select('id, title, created_at')
            .in('id', sortedPostIds)

        return (posts || []).map(p => ({
            ...p,
            views: viewMap[p.id] || 0,
        })).sort((a, b) => b.views - a.views)
    } catch {
        // Fallback to recent posts if no views
        const { data: recentPosts } = await supabase
            .from('posts')
            .select('id, title, created_at')
            .eq('status', 'published')
            .order('created_at', { ascending: false })
            .limit(limit)

        return (recentPosts || []).map(p => ({ ...p, views: 0 }))
    }
}

// Get daily stats for chart
export async function getDailyStats(daysBack: number = 7) {
    const supabase = await createClient()

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysBack)

    // Group by date
    const dailyMap: Record<string, number> = {}

    // Initialize all days
    for (let i = 0; i <= daysBack; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        dailyMap[dateStr] = 0
    }

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: views } = await (supabase as any)
            .from('post_views')
            .select('viewed_at')
            .gte('viewed_at', startDate.toISOString())

        // Count views per day
        views?.forEach((v: { viewed_at: string }) => {
            const dateStr = new Date(v.viewed_at).toISOString().split('T')[0]
            dailyMap[dateStr] = (dailyMap[dateStr] || 0) + 1
        })
    } catch { /* table may not exist */ }

    // Convert to array sorted by date
    return Object.entries(dailyMap)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date))
}

// Get recent activity
export async function getRecentActivity(limit: number = 10) {
    const supabase = await createClient()

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: recentViews } = await (supabase as any)
            .from('post_views')
            .select(`
                id,
                viewed_at,
                posts:post_id (id, title)
            `)
            .order('viewed_at', { ascending: false })
            .limit(limit)

        return (recentViews || []).map((v: { id: string; viewed_at: string; posts: { title: string } | null }) => ({
            id: v.id,
            type: 'view' as const,
            timestamp: v.viewed_at,
            postTitle: v.posts?.title || 'Unknown',
        }))
    } catch {
        return []
    }
}
