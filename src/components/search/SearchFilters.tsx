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
        <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Filter Bar */}
                <div className="flex items-center gap-3 py-3 overflow-x-auto">
                    {/* Category Pills */}
                    <button
                        onClick={() => onCategoryChange('')}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${!selectedCategory
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Semua
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => onCategoryChange(category.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === category.id
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}

                    {/* Expand Filters Button */}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${isExpanded || hasActiveFilters
                                ? 'bg-primary-100 text-primary-700'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Filter
                        {hasActiveFilters && (
                            <span className="w-2 h-2 rounded-full bg-primary-500" />
                        )}
                    </button>
                </div>

                {/* Expanded Filters */}
                {isExpanded && (
                    <div className="pb-4 pt-2 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Date Range */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tanggal Mulai
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => onStartDateChange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tanggal Akhir
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => onEndDateChange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>

                        {/* Urgency */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Prioritas
                            </label>
                            <select
                                value={urgency}
                                onChange={(e) => onUrgencyChange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="">Semua</option>
                                <option value="urgent">Penting</option>
                                <option value="normal">Normal</option>
                            </select>
                        </div>

                        {/* Sort Order */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Urutkan
                            </label>
                            <select
                                value={sortOrder}
                                onChange={(e) => onSortOrderChange(e.target.value as 'asc' | 'desc')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="desc">Terbaru</option>
                                <option value="asc">Terlama</option>
                            </select>
                        </div>

                        {/* Reset Button */}
                        {hasActiveFilters && (
                            <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
                                <button
                                    onClick={onReset}
                                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                                >
                                    Reset semua filter
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
