'use client'

import { useState } from 'react'

interface Category {
    id: string
    name: string
}

interface SearchFiltersProps {
    categories: Category[]
    selectedCategory: string
    startDate: string
    endDate: string
    urgency: string
    sortOrder: 'asc' | 'desc'
    onCategoryChange: (categoryId: string) => void
    onStartDateChange: (date: string) => void
    onEndDateChange: (date: string) => void
    onUrgencyChange: (urgency: string) => void
    onSortOrderChange: (order: 'asc' | 'desc') => void
    onReset: () => void
}

export default function SearchFilters({
    categories,
    selectedCategory,
    startDate,
    endDate,
    urgency,
    sortOrder,
    onCategoryChange,
    onStartDateChange,
    onEndDateChange,
    onUrgencyChange,
    onSortOrderChange,
    onReset
}: SearchFiltersProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    const hasActiveFilters = selectedCategory || startDate || endDate || urgency

    return (
        <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] sticky top-16 z-40">
            <div className="container-gov">
                {/* Main Filter Bar */}
                <div className="flex items-center gap-2 py-3 overflow-x-auto hide-scrollbar">
                    {/* Category Pills */}
                    <button
                        onClick={() => onCategoryChange('')}
                        className={`flex-shrink-0 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors touch-target ${!selectedCategory
                            ? 'bg-[#2563EB] text-white'
                            : 'bg-white text-[#475569] border border-[#E2E8F0] hover:border-[#2563EB]'
                            }`}
                    >
                        Semua
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => onCategoryChange(category.id)}
                            className={`flex-shrink-0 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors touch-target ${selectedCategory === category.id
                                ? 'bg-[#2563EB] text-white'
                                : 'bg-white text-[#475569] border border-[#E2E8F0] hover:border-[#2563EB]'
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}

                    {/* Filter Toggle */}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`flex-shrink-0 ml-auto flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors touch-target ${isExpanded || hasActiveFilters
                            ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB]'
                            : 'bg-white text-[#475569] border border-[#E2E8F0] hover:border-[#2563EB]'
                            }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        <span className="hidden sm:inline">Filter</span>
                        {hasActiveFilters && (
                            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                        )}
                    </button>
                </div>

                {/* Expanded Filters */}
                {isExpanded && (
                    <div className="pb-4 pt-2 border-t border-[#E2E8F0] fade-in">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-[#475569] mb-1.5">
                                    Dari Tanggal
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => onStartDateChange(e.target.value)}
                                    className="input"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#475569] mb-1.5">
                                    Sampai Tanggal
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => onEndDateChange(e.target.value)}
                                    className="input"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#475569] mb-1.5">
                                    Prioritas
                                </label>
                                <select
                                    value={urgency}
                                    onChange={(e) => onUrgencyChange(e.target.value)}
                                    className="input"
                                >
                                    <option value="">Semua</option>
                                    <option value="urgent">Mendesak</option>
                                    <option value="deadline">Batas Waktu</option>
                                    <option value="general">Umum</option>
                                    <option value="archive">Arsip</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#475569] mb-1.5">
                                    Urutkan
                                </label>
                                <select
                                    value={sortOrder}
                                    onChange={(e) => onSortOrderChange(e.target.value as 'asc' | 'desc')}
                                    className="input"
                                >
                                    <option value="desc">Terbaru</option>
                                    <option value="asc">Terlama</option>
                                </select>
                            </div>
                        </div>

                        {hasActiveFilters && (
                            <div className="mt-3 flex justify-end">
                                <button
                                    onClick={onReset}
                                    className="text-sm text-[#475569] hover:text-[#2563EB] flex items-center gap-1.5 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Reset filter
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
