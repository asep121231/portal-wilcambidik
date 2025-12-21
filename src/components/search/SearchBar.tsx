'use client'

import { useState, useCallback, useEffect } from 'react'

interface SearchBarProps {
    initialValue?: string
    onSearch: (keyword: string) => void
    placeholder?: string
}

export default function SearchBar({
    initialValue = '',
    onSearch,
    placeholder = 'Cari informasi kedinasan...'
}: SearchBarProps) {
    const [value, setValue] = useState(initialValue)
    const [debouncedValue, setDebouncedValue] = useState(initialValue)

    // Debounce effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value)
        }, 300)

        return () => clearTimeout(timer)
    }, [value])

    // Trigger search when debounced value changes
    useEffect(() => {
        onSearch(debouncedValue)
    }, [debouncedValue, onSearch])

    const handleClear = useCallback(() => {
        setValue('')
        setDebouncedValue('')
        onSearch('')
    }, [onSearch])

    return (
        <div className="relative w-full max-w-2xl mx-auto">
            <div className="relative">
                {/* Search Icon */}
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>

                {/* Input */}
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-12 pr-12 py-4 text-base bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                    aria-label="Cari informasi"
                />

                {/* Clear Button */}
                {value && (
                    <button
                        onClick={handleClear}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/60 hover:text-white transition-colors"
                        aria-label="Hapus pencarian"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Search hint */}
            <p className="mt-2 text-sm text-white/60 text-center">
                Cari berdasarkan judul, isi berita, atau nama file lampiran
            </p>
        </div>
    )
}
