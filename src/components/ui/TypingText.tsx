'use client'

import { useState, useEffect } from 'react'

interface TypingTextProps {
    texts: string[]
    className?: string
}

export default function TypingText({ texts, className = '' }: TypingTextProps) {
    const [currentTextIndex, setCurrentTextIndex] = useState(0)
    const [currentText, setCurrentText] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        const targetText = texts[currentTextIndex]

        const timeout = setTimeout(() => {
            if (!isDeleting) {
                // Typing
                if (currentText.length < targetText.length) {
                    setCurrentText(targetText.slice(0, currentText.length + 1))
                } else {
                    // Wait before deleting
                    setTimeout(() => setIsDeleting(true), 2000)
                }
            } else {
                // Deleting
                if (currentText.length > 0) {
                    setCurrentText(targetText.slice(0, currentText.length - 1))
                } else {
                    setIsDeleting(false)
                    setCurrentTextIndex((prev) => (prev + 1) % texts.length)
                }
            }
        }, isDeleting ? 50 : 100)

        return () => clearTimeout(timeout)
    }, [currentText, isDeleting, currentTextIndex, texts])

    return (
        <span className={className}>
            {currentText}
            <span className="animate-pulse">|</span>
        </span>
    )
}
