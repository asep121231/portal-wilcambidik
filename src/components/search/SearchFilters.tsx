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
        <div className="bg-white border-b border-gray-100 shadow-sm sticky top-14 lg:top-16 z-40">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Filter Bar - Scrollable on Mobile */}
                <div className="flex items-center gap-2 py-3 overflow-x-auto hide-scrollbar">
                    {/* Category Pills */}
                    <button
                        onClick={() => onCategoryChange('')}
                        className={`flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all touch-target ${!selectedCategory
                            ? 'bg-[#1E40AF] text-white shadow-sm'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Semua
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => onCategoryChange(category.id)}
                            className={`flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all touch-target ${selectedCategory === category.id
                                ? 'bg-[#1E40AF] text-white shadow-sm'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}

                    {/* Expand Filters Button */}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`flex-shrink-0 ml-auto flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all touch-target ${isExpanded || hasActiveFilters
                            ? 'bg-[#1E40AF]/10 text-[#1E40AF]'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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

                {/* Expanded Filters Panel */}
                {isExpanded && (
                    <div className="pb-4 pt-2 border-t border-gray-100 fade-in">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {/* Date Range */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                                    Dari Tanggal
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => onStartDateChange(e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                                    Sampai Tanggal
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => onEndDateChange(e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] bg-gray-50"
                                />
                            </div>

                            {/* Urgency */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                                    Prioritas
                                </label>
                                <select
                                    value={urgency}
                                    onChange={(e) => onUrgencyChange(e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] bg-gray-50"
                                >
                                    <option value="">Semua</option>
                                    <option value="urgent">🔴 Penting</option>
                                    <option value="normal">🟢 Normal</option>
                                </select>
                            </div>

                            {/* Sort Order */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                                    Urutkan
                                </label>
                                <select
                                    value={sortOrder}
                                    onChange={(e) => onSortOrderChange(e.target.value as 'asc' | 'desc')}
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] bg-gray-50"
                                >
                                    <option value="desc">Terbaru</option>
                                    <option value="asc">Terlama</option>
                                </select>
                            </div>
                        </div>

                        {/* Reset Button */}
                        {hasActiveFilters && (
                            <div className="mt-3 flex justify-end">
                                <button
                                    onClick={onReset}
                                    className="text-sm text-gray-500 hover:text-[#1E40AF] flex items-center gap-1.5 transition-colors"
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
