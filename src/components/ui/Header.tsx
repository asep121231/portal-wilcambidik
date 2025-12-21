'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 glass border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                />
                            </svg>
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-lg font-bold text-gray-900">Wilcambidik Bruno</h1>
                            <p className="text-xs text-gray-500">Portal Informasi Kedinasan</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link
                            href="/"
                            className="text-gray-600 hover:text-primary-600 font-medium transition-colors animated-underline"
                        >
                            Beranda
                        </Link>
                        <Link
                            href="/?category=surat-edaran"
                            className="text-gray-600 hover:text-primary-600 font-medium transition-colors animated-underline"
                        >
                            Surat Edaran
                        </Link>
                        <Link
                            href="/?category=undangan"
                            className="text-gray-600 hover:text-primary-600 font-medium transition-colors animated-underline"
                        >
                            Undangan
                        </Link>
                        <Link
                            href="/?category=pengumuman"
                            className="text-gray-600 hover:text-primary-600 font-medium transition-colors animated-underline"
                        >
                            Pengumuman
                        </Link>
                    </nav>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <nav className="md:hidden py-4 border-t border-gray-200 fade-in">
                        <div className="flex flex-col gap-2">
                            <Link
                                href="/"
                                className="px-4 py-2 text-gray-600 hover:bg-primary-50 hover:text-primary-600 rounded-lg font-medium transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Beranda
                            </Link>
                            <Link
                                href="/?category=surat-edaran"
                                className="px-4 py-2 text-gray-600 hover:bg-primary-50 hover:text-primary-600 rounded-lg font-medium transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Surat Edaran
                            </Link>
                            <Link
                                href="/?category=undangan"
                                className="px-4 py-2 text-gray-600 hover:bg-primary-50 hover:text-primary-600 rounded-lg font-medium transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Undangan
                            </Link>
                            <Link
                                href="/?category=pengumuman"
                                className="px-4 py-2 text-gray-600 hover:bg-primary-50 hover:text-primary-600 rounded-lg font-medium transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Pengumuman
                            </Link>
                        </div>
                    </nav>
                )}
            </div>
        </header>
    )
}
