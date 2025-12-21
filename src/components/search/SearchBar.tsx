'use client'

import { useState, useEffect, useCallback } from 'react'

interface SearchBarProps {
    initialValue?: string
    onSearch: (keyword: string) => void
}

export default function SearchBar({ initialValue = '', onSearch }: SearchBarProps) {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (value !== initialValue) {
                onSearch(value)
            }
        }, 300)
        return () => clearTimeout(timer)
    }, [value, initialValue, onSearch])

    const handleClear = useCallback(() => {
        setValue('')
        onSearch('')
    }, [onSearch])

    return (
        <div className="space-y-2">
            <div className="flex items-center bg-white rounded-xl shadow-sm border border-white/20">
                <svg
                    className="w-5 h-5 text-gray-400 ml-4 flex-shrink-0"
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
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Cari informasi kedinasan..."
                    className="flex-1 min-w-0 px-4 py-3 bg-transparent border-none text-gray-900 placeholder-gray-400 focus:outline-none text-sm"
                />
                {value && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="p-2 mr-1 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Hapus pencarian"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
                <button
                    type="button"
                    onClick={() => onSearch(value)}
                    className="hidden sm:flex items-center justify-center px-5 py-2.5 mr-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    Cari
                </button>
            </div>
            <p className="text-xs text-white/70 text-center">
                Cari berdasarkan judul, isi, atau nama file
            </p>
        </div>
    )
}
