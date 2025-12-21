'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
    { name: 'Beranda', href: '/' },
    { name: 'Informasi', href: '/#info' },
]

export default function Header() {
    const pathname = usePathname()
    const [isScrolled, setIsScrolled] = useState(false)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        document.body.style.overflow = isDrawerOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [isDrawerOpen])

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'glass shadow-lg shadow-gray-200/50'
                    : 'bg-transparent'
                }`}>
                <div className="container-main">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div className="hidden sm:block">
                                <div className="font-bold text-lg text-gray-900">Wilcambidik Bruno</div>
                                <div className="text-sm text-gray-500">Portal Informasi</div>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-2">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all ${isActive
                                                ? 'bg-purple-100 text-purple-700'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                )
                            })}
                            <Link
                                href="/admin"
                                className="ml-3 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm font-medium rounded-full hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                            >
                                Admin Panel
                            </Link>
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsDrawerOpen(true)}
                            className="md:hidden p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Drawer */}
            <div
                className={`drawer-overlay ${isDrawerOpen ? 'open' : ''}`}
                onClick={() => setIsDrawerOpen(false)}
            />
            <div className={`drawer ${isDrawerOpen ? 'open' : ''}`}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <span className="text-xl font-bold text-gray-900">Menu</span>
                        <button
                            onClick={() => setIsDrawerOpen(false)}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <nav className="space-y-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsDrawerOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-xl font-medium transition-colors"
                            >
                                {item.name}
                            </Link>
                        ))}
                        <Link
                            href="/admin"
                            onClick={() => setIsDrawerOpen(false)}
                            className="flex items-center justify-center gap-3 px-4 py-3 mt-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-medium"
                        >
                            Admin Panel
                        </Link>
                    </nav>
                </div>
            </div>

            {/* Spacer for fixed header */}
            <div className="h-20" />
        </>
    )
}
