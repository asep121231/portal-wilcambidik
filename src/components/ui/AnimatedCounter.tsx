'use client'

import { useState, useEffect, useRef } from 'react'

interface AnimatedCounterProps {
    end: number
    duration?: number
    suffix?: string
    className?: string
}

export default function AnimatedCounter({ end, duration = 2000, suffix = '', className = '' }: AnimatedCounterProps) {
    const [count, setCount] = useState(0)
    const [hasAnimated, setHasAnimated] = useState(false)
    const ref = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated) {
                    setHasAnimated(true)
                    animateCount()
                }
            },
            { threshold: 0.1 }
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => observer.disconnect()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasAnimated])

    const animateCount = () => {
        const startTime = Date.now()
        const step = () => {
            const progress = Math.min((Date.now() - startTime) / duration, 1)
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4)
            setCount(Math.floor(easeOutQuart * end))

            if (progress < 1) {
                requestAnimationFrame(step)
            } else {
                setCount(end)
            }
        }
        requestAnimationFrame(step)
    }

    return (
        <span ref={ref} className={className}>
            {count.toLocaleString('id-ID')}{suffix}
        </span>
    )
}
