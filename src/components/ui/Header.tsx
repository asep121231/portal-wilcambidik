'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import NotificationButton from './NotificationButton'
import ThemeToggle from './ThemeToggle'

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
                ? 'glass-effect shadow-lg dark:bg-gray-900/80 dark:backdrop-blur-md'
                : 'bg-white dark:bg-gray-900'
                }`}>
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 to-orange-500 flex items-center justify-center shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div className="hidden sm:block">
                                <div className="font-bold text-lg text-gray-900 dark:text-white">Wilcambidik Bruno</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Portal Informasi</div>
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
                                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                )
                            })}
                            <ThemeToggle />
                            <NotificationButton />
                            <Link
                                href="/admin"
                                className="ml-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-orange-500 text-white text-sm font-medium rounded-full hover:opacity-90 transition-all shadow-lg"
                            >
                                Admin Panel
                            </Link>
                        </nav>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center gap-2">
                            <ThemeToggle />
                            <button
                                onClick={() => setIsDrawerOpen(true)}
                                className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 rounded-xl transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Drawer */}
            <div
                className={`drawer-overlay ${isDrawerOpen ? 'open' : ''}`}
                onClick={() => setIsDrawerOpen(false)}
            />
            <div className={`drawer-panel dark:bg-gray-900 ${isDrawerOpen ? 'open' : ''}`}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <span className="text-xl font-bold text-gray-900 dark:text-white">Menu</span>
                        <button
                            onClick={() => setIsDrawerOpen(false)}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 rounded-xl"
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
                                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-700 dark:text-gray-300 dark:hover:bg-purple-900/30 dark:hover:text-purple-300 rounded-xl font-medium transition-colors"
                            >
                                {item.name}
                            </Link>
                        ))}
                        <Link
                            href="/admin"
                            onClick={() => setIsDrawerOpen(false)}
                            className="flex items-center justify-center gap-3 px-4 py-3 mt-4 bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-xl font-medium"
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
