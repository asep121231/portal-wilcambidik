interface ReadingTimeProps {
    content: string
}

export default function ReadingTime({ content }: ReadingTimeProps) {
    // Average reading speed: 200 words per minute for Indonesian
    const wordsPerMinute = 200
    const wordCount = content.trim().split(/\s+/).length
    const readingTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute))

    return (
        <div className="flex items-center gap-2 text-white/70">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">{readingTime} menit baca</span>
        </div>
    )
}
