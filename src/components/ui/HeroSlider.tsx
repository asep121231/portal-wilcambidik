'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface SliderPhoto {
    id: string
    photo_url: string
    activity_title: string
    activity_date: string
}

interface HeroSliderProps {
    photos: SliderPhoto[]
}

export default function HeroSlider({ photos }: HeroSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % photos.length)
    }, [photos.length])

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)
    }, [photos.length])

    const goToSlide = (index: number) => {
        setCurrentIndex(index)
        setIsAutoPlaying(false)
        // Resume autoplay after 5 seconds
        setTimeout(() => setIsAutoPlaying(true), 5000)
    }

    // Auto-play functionality
    useEffect(() => {
        if (!isAutoPlaying || photos.length <= 1) return

        const interval = setInterval(nextSlide, 4000)
        return () => clearInterval(interval)
    }, [isAutoPlaying, nextSlide, photos.length])

    if (photos.length === 0) {
        return null
    }

    return (
        <div
            className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-2xl group"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            {/* Slides */}
            <div
                className="flex transition-transform duration-700 ease-out h-full"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {photos.map((photo, index) => (
                    <div
                        key={photo.id}
                        className="relative min-w-full h-full"
                    >
                        <Image
                            src={photo.photo_url}
                            alt={photo.activity_title}
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Caption */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                            <p className="text-white/80 text-sm mb-2">
                                📅 {new Date(photo.activity_date).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                            <h3 className="text-white text-xl md:text-2xl lg:text-3xl font-bold">
                                {photo.activity_title}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            {photos.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm hover:bg-white/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        aria-label="Previous slide"
                    >
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm hover:bg-white/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        aria-label="Next slide"
                    >
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}

            {/* Dots Indicator */}
            {photos.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {photos.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${index === currentIndex
                                    ? 'bg-white w-6 md:w-8'
                                    : 'bg-white/50 hover:bg-white/80'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* View Gallery Link */}
            <Link
                href="/galeri"
                className="absolute top-4 right-4 px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white text-sm font-medium rounded-full flex items-center gap-2 transition-colors z-10"
            >
                <span>📸</span>
                <span>Lihat Galeri</span>
            </Link>
        </div>
    )
}
