'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageVisit } from '@/lib/actions/analytics'

// Generate a unique session ID for this browser session
function getSessionId(): string {
    if (typeof window === 'undefined') return ''

    let sessionId = sessionStorage.getItem('visitor_session_id')
    if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36)
        sessionStorage.setItem('visitor_session_id', sessionId)
    }
    return sessionId
}

// Parse user agent to get device info
function getDeviceInfo() {
    if (typeof window === 'undefined') {
        return { deviceType: 'unknown', browser: 'unknown', os: 'unknown' }
    }

    const ua = navigator.userAgent

    // Device type
    let deviceType = 'desktop'
    if (/Mobi|Android/i.test(ua)) {
        deviceType = 'mobile'
    } else if (/Tablet|iPad/i.test(ua)) {
        deviceType = 'tablet'
    }

    // Browser
    let browser = 'unknown'
    if (ua.includes('Firefox')) browser = 'Firefox'
    else if (ua.includes('Edg')) browser = 'Edge'
    else if (ua.includes('Chrome')) browser = 'Chrome'
    else if (ua.includes('Safari')) browser = 'Safari'
    else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera'

    // OS
    let os = 'unknown'
    if (ua.includes('Windows')) os = 'Windows'
    else if (ua.includes('Mac')) os = 'macOS'
    else if (ua.includes('Linux')) os = 'Linux'
    else if (ua.includes('Android')) os = 'Android'
    else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS'

    return { deviceType, browser, os }
}

export default function PageTracker() {
    const pathname = usePathname()

    useEffect(() => {
        // Don't track admin pages
        if (pathname.startsWith('/admin')) return

        const sessionId = getSessionId()
        const { deviceType, browser, os } = getDeviceInfo()

        trackPageVisit({
            pagePath: pathname,
            pageTitle: document.title,
            referrer: document.referrer || null,
            userAgent: navigator.userAgent,
            deviceType,
            browser,
            os,
            sessionId,
        })
    }, [pathname])

    return null
}
