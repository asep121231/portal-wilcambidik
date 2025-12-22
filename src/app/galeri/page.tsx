'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getActivities, getActivityCategories, type Activity, type ActivityCategory } from '@/lib/actions/gallery'

export default function GaleriPage() {
    const [activities, setActivities] = useState<Activity[]>([])
    const [categories, setCategories] = useState<ActivityCategory[]>([])
    const [selectedCategory, setSelectedCategory] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [lightboxImages, setLightboxImages] = useState<{ url: string; caption?: string }[]>([])
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    useEffect(() => {
        async function loadData() {
            setIsLoading(true)
            const [activitiesData, categoriesData] = await Promise.all([
                getActivities(selectedCategory || undefined, true),
                getActivityCategories()
            ])
            setActivities(activitiesData)
            setCategories(categoriesData)
            setIsLoading(false)
        }
        loadData()
    }, [selectedCategory])

    function openLightbox(photos: { photo_url: string; caption?: string | null }[], index: number) {
        setLightboxImages(photos.map(p => ({ url: p.photo_url, caption: p.caption || undefined })))
        setCurrentImageIndex(index)
        setLightboxOpen(true)
    }

    function closeLightbox() {
        setLightboxOpen(false)
    }

    function nextImage() {
        setCurrentImageIndex((prev) => (prev + 1) % lightboxImages.length)
    }

    function prevImage() {
        setCurrentImageIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length)
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-purple-600 to-orange-500 py-16">
                <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                        📸 Galeri Kegiatan
                    </h1>
                    <p className="text-lg text-white/80 max-w-2xl mx-auto">
                        Dokumentasi foto kegiatan Wilcambidik Bruno
                    </p>
                </div>
            </section>

            {/* Filter */}
            <section className="py-8 -mt-6">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    <div className="flex flex-wrap gap-2 justify-center">
                        <button
                            onClick={() => setSelectedCategory('')}
                            className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all shadow ${!selectedCategory
                                ? 'bg-white text-purple-600 shadow-lg'
                                : 'bg-white/20 text-white hover:bg-white/30'
                                }`}
                        >
                            Semua
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full transition-all shadow ${selectedCategory === cat.id
                                    ? 'bg-white text-purple-600 shadow-lg'
                                    : 'bg-white/20 text-white hover:bg-white/30'
                                    }`}
                            >
                                <span>{cat.icon}</span>
                                <span>{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Grid */}
            <section className="py-8">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden animate-pulse">
                                    <div className="aspect-video bg-gray-200 dark:bg-gray-700" />
                                    <div className="p-4">
                                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : activities.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-4xl">📷</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Belum ada kegiatan
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Dokumentasi kegiatan akan ditampilkan di sini
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {activities.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                >
                                    {/* Cover Photo */}
                                    <div className="relative aspect-video bg-gray-100 dark:bg-gray-700">
                                        {activity.activity_photos && activity.activity_photos.length > 0 ? (
                                            <>
                                                <Image
                                                    src={activity.activity_photos[0].photo_url}
                                                    alt={activity.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                {activity.activity_photos.length > 1 && (
                                                    <div className="absolute top-3 right-3 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded-full">
                                                        +{activity.activity_photos.length - 1} foto
                                                    </div>
                                                )}
                                                <div
                                                    className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors cursor-pointer flex items-center justify-center"
                                                    onClick={() => openLightbox(activity.activity_photos || [], 0)}
                                                >
                                                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-4xl">📷</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            {activity.activity_categories && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full">
                                                    {activity.activity_categories.icon} {activity.activity_categories.name}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                                            {activity.title}
                                        </h3>
                                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                            <span>📅 {new Date(activity.activity_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            {activity.location && <span>📍 {activity.location}</span>}
                                        </div>
                                        {activity.description && (
                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                                {activity.description}
                                            </p>
                                        )}

                                        {/* Photos Preview */}
                                        {activity.activity_photos && activity.activity_photos.length > 1 && (
                                            <div className="flex gap-1 mt-3">
                                                {activity.activity_photos.slice(0, 4).map((photo, index) => (
                                                    <button
                                                        key={photo.id}
                                                        onClick={() => openLightbox(activity.activity_photos || [], index)}
                                                        className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 hover:ring-2 hover:ring-purple-500 transition-all"
                                                    >
                                                        <Image
                                                            src={photo.photo_url}
                                                            alt=""
                                                            fill
                                                            className="object-cover"
                                                        />
                                                        {index === 3 && activity.activity_photos && activity.activity_photos.length > 4 && (
                                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-medium">
                                                                +{activity.activity_photos.length - 4}
                                                            </div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Lightbox */}
            {lightboxOpen && lightboxImages.length > 0 && (
                <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={closeLightbox}>
                    {/* Close button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white z-10"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Prev button */}
                    {lightboxImages.length > 1 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            className="absolute left-4 p-2 text-white/70 hover:text-white z-10"
                        >
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}

                    {/* Image */}
                    <div className="relative max-w-5xl max-h-[80vh] mx-4" onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={lightboxImages[currentImageIndex].url}
                            alt={lightboxImages[currentImageIndex].caption || ''}
                            width={1200}
                            height={800}
                            className="max-h-[80vh] w-auto object-contain"
                        />
                        {lightboxImages[currentImageIndex].caption && (
                            <p className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-center py-3 px-4 text-sm">
                                {lightboxImages[currentImageIndex].caption}
                            </p>
                        )}
                    </div>

                    {/* Next button */}
                    {lightboxImages.length > 1 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            className="absolute right-4 p-2 text-white/70 hover:text-white z-10"
                        >
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}

                    {/* Counter */}
                    <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
                        {currentImageIndex + 1} / {lightboxImages.length}
                    </p>
                </div>
            )}
        </div>
    )
}
