'use client'

import { useState, useEffect } from 'react'
import { subscribeToPush, unsubscribeFromPush } from '@/lib/actions/notifications'

export default function NotificationButton() {
    const [isSupported, setIsSupported] = useState(false)
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [permission, setPermission] = useState<NotificationPermission>('default')

    useEffect(() => {
        // Check if push notifications are supported
        const checkSupport = async () => {
            const supported = 'serviceWorker' in navigator && 'PushManager' in window
            setIsSupported(supported)

            if (!supported) {
                setIsLoading(false)
                return
            }

            // Check current permission
            setPermission(Notification.permission)

            // Check if already subscribed
            try {
                const registration = await navigator.serviceWorker.ready
                const subscription = await registration.pushManager.getSubscription()
                setIsSubscribed(!!subscription)
            } catch (err) {
                console.error('Error checking subscription:', err)
            }

            setIsLoading(false)
        }

        checkSupport()
    }, [])

    const handleSubscribe = async () => {
        setIsLoading(true)

        try {
            // Request permission
            const perm = await Notification.requestPermission()
            setPermission(perm)

            if (perm !== 'granted') {
                setIsLoading(false)
                return
            }

            // Get service worker registration
            const registration = await navigator.serviceWorker.ready

            // Get VAPID public key from environment
            const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
            if (!vapidKey) {
                console.warn('VAPID public key not configured - push notifications disabled')
                setIsLoading(false)
                return
            }

            // Subscribe to push
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidKey),
            })

            // Save to server
            const result = await subscribeToPush({
                endpoint: subscription.endpoint,
                keys: {
                    p256dh: arrayBufferToBase64(subscription.getKey('p256dh')),
                    auth: arrayBufferToBase64(subscription.getKey('auth')),
                },
            })

            if (result.success) {
                setIsSubscribed(true)
            }
        } catch (err) {
            console.error('Error subscribing to push:', err)
        }

        setIsLoading(false)
    }

    const handleUnsubscribe = async () => {
        setIsLoading(true)

        try {
            const registration = await navigator.serviceWorker.ready
            const subscription = await registration.pushManager.getSubscription()

            if (subscription) {
                await subscription.unsubscribe()
                await unsubscribeFromPush(subscription.endpoint)
                setIsSubscribed(false)
            }
        } catch (err) {
            console.error('Error unsubscribing from push:', err)
        }

        setIsLoading(false)
    }

    // Don't show if not supported
    if (!isSupported) {
        return null
    }

    // Permission denied
    if (permission === 'denied') {
        return (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                Notifikasi diblokir
            </div>
        )
    }

    return (
        <button
            onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all disabled:opacity-50 ${isSubscribed
                ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                : 'bg-gradient-to-r from-purple-600 to-orange-500 text-white hover:opacity-90 shadow-lg'
                }`}
        >
            {isLoading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            ) : isSubscribed ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
            ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
            )}
            {isSubscribed ? 'Notifikasi Aktif' : 'Aktifkan Notifikasi'}
        </button>
    )
}

// Helper functions
function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }

    return outputArray.buffer as ArrayBuffer
}

function arrayBufferToBase64(buffer: ArrayBuffer | null): string {
    if (!buffer) return ''
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i])
    }
    return window.btoa(binary)
}
