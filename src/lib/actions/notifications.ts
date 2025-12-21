'use server'

import { createClient } from '@/lib/supabase/server'
import webpush from 'web-push'

// Initialize web-push with VAPID keys
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || ''

if (vapidPublicKey && vapidPrivateKey) {
    webpush.setVapidDetails(
        'mailto:admin@wilcambidik.bruno',
        vapidPublicKey,
        vapidPrivateKey
    )
}

interface PushSubscriptionKeys {
    p256dh: string
    auth: string
}

interface PushSubscriptionData {
    endpoint: string
    keys: PushSubscriptionKeys
}

export async function subscribeToPush(subscription: PushSubscriptionData) {
    const supabase = await createClient()

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from('push_subscriptions')
            .upsert({
                endpoint: subscription.endpoint,
                keys: subscription.keys,
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'endpoint'
            })

        if (error) {
            console.error('Error saving push subscription:', error)
            return { success: false, error: error.message }
        }

        return { success: true }
    } catch (err) {
        console.error('Error saving push subscription:', err)
        return { success: false, error: 'Database error' }
    }
}

export async function unsubscribeFromPush(endpoint: string) {
    const supabase = await createClient()

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from('push_subscriptions')
            .delete()
            .eq('endpoint', endpoint)

        if (error) {
            console.error('Error removing push subscription:', error)
            return { success: false, error: error.message }
        }

        return { success: true }
    } catch {
        return { success: false, error: 'Database error' }
    }
}

export async function sendPushNotification(title: string, body: string, url: string = '/') {
    if (!vapidPublicKey || !vapidPrivateKey) {
        console.warn('VAPID keys not configured, skipping push notification')
        return { success: false, error: 'VAPID keys not configured' }
    }

    const supabase = await createClient()

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: subscriptions, error } = await (supabase as any)
            .from('push_subscriptions')
            .select('endpoint, keys')

        if (error) {
            console.error('Error fetching subscriptions:', error)
            return { success: false, error: error.message }
        }

        if (!subscriptions || subscriptions.length === 0) {
            return { success: true, sent: 0 }
        }

        const payload = JSON.stringify({
            title,
            body,
            url,
        })

        let successCount = 0
        let failCount = 0

        // Send to all subscribers
        const sendPromises = subscriptions.map(async (sub: { endpoint: string; keys: PushSubscriptionKeys }) => {
            try {
                await webpush.sendNotification(
                    {
                        endpoint: sub.endpoint,
                        keys: sub.keys,
                    },
                    payload
                )
                successCount++
            } catch (err) {
                console.error('Error sending push notification:', err)
                failCount++

                // Remove invalid subscriptions (410 Gone or 404 Not Found)
                const error = err as { statusCode?: number }
                if (error.statusCode === 410 || error.statusCode === 404) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    await (supabase as any)
                        .from('push_subscriptions')
                        .delete()
                        .eq('endpoint', sub.endpoint)
                }
            }
        })

        await Promise.all(sendPromises)

        return { success: true, sent: successCount, failed: failCount }
    } catch {
        return { success: false, error: 'Failed to send notifications' }
    }
}

export async function getSubscriptionCount() {
    const supabase = await createClient()

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { count, error } = await (supabase as any)
            .from('push_subscriptions')
            .select('*', { count: 'exact', head: true })

        if (error) {
            console.error('Error counting subscriptions:', error)
            return 0
        }

        return count || 0
    } catch {
        return 0
    }
}

export async function getVapidPublicKey() {
    return process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
}
