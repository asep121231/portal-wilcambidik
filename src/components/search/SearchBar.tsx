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
            <div className="search-box">
                <svg className="w-5 h-5 text-[#94A3B8] ml-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Cari informasi, surat edaran, atau file..."
                    className="flex-1 touch-target"
                />
                {value && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="p-2 mr-1 text-[#94A3B8] hover:text-[#475569] transition-colors"
                        aria-label="Hapus pencarian"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
                <button className="mr-1 hidden sm:flex">
                    Cari
                </button>
            </div>
            <p className="text-xs text-[#94A3B8] pl-1">
                Cari berdasarkan judul, isi, atau nama file
            </p>
        </div>
    )
}
