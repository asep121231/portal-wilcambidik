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
        const handleScroll = () => setIsScrolled(window.scrollY > 10)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        document.body.style.overflow = isDrawerOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [isDrawerOpen])

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 bg-white border-b transition-colors ${isScrolled ? 'border-gray-200' : 'border-gray-100'
                }`}>
                <div className="container-gov">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-800 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div className="hidden sm:block">
                                <div className="text-sm font-semibold text-gray-900">Wilcambidik Bruno</div>
                                <div className="text-xs text-gray-500">Portal Kedinasan</div>
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${pathname === item.href
                                            ? 'text-blue-800 bg-blue-50'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <Link
                                href="/admin"
                                className="ml-2 px-3 py-2 bg-blue-800 text-white text-sm font-medium rounded-md hover:bg-blue-900 transition-colors"
                            >
                                Admin
                            </Link>
                        </nav>

                        {/* Mobile Menu */}
                        <button
                            onClick={() => setIsDrawerOpen(true)}
                            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Drawer */}
            <div className={`drawer-overlay ${isDrawerOpen ? 'open' : ''}`} onClick={() => setIsDrawerOpen(false)} />
            <div className={`drawer ${isDrawerOpen ? 'open' : ''}`}>
                <div className="p-4">
                    <div className="flex items-center justify-between mb-6">
                        <span className="font-semibold text-gray-900">Menu</span>
                        <button onClick={() => setIsDrawerOpen(false)} className="p-2 text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <nav className="space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsDrawerOpen(false)}
                                className="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                            >
                                {item.name}
                            </Link>
                        ))}
                        <Link
                            href="/admin"
                            onClick={() => setIsDrawerOpen(false)}
                            className="block px-3 py-2.5 mt-2 text-sm bg-blue-800 text-white rounded-md"
                        >
                            Admin Panel
                        </Link>
                    </nav>
                </div>
            </div>

            <div className="h-16" />
        </>
    )
}
