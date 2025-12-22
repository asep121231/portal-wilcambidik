'use client'

import { useEffect } from 'react'
import { trackPostView } from '@/lib/actions/analytics'

interface ViewTrackerProps {
    postId: string
}

export default function ViewTracker({ postId }: ViewTrackerProps) {
    useEffect(() => {
        // Track view when component mounts
        const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : undefined
        trackPostView(postId, userAgent)
    }, [postId])

    // This component doesn't render anything
    return null
}
