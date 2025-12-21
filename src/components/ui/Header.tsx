'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
    { name: 'Beranda', href: '/' },
    { name: 'Informasi', href: '/#info' },
    { name: 'Kontak', href: '/#kontak' },
]

export default function Header() {
    const [isOpen, setIsOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        setIsOpen(false)
    }, [pathname])

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen])

    return (
        <>
            <header className={`gov-header ${isScrolled ? 'shadow-sm' : ''}`}>
                <nav className="container-gov">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-[#2563EB] rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div className="hidden sm:block">
                                <span className="block font-semibold text-[#0F172A] text-base leading-tight">
                                    Wilcambidik Bruno
                                </span>
                                <span className="block text-xs text-[#475569]">
                                    Portal Informasi Kedinasan
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                            ? 'bg-[#EFF6FF] text-[#2563EB]'
                                            : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                )
                            })}
                            <Link
                                href="/admin"
                                className="ml-3 px-4 py-2 bg-[#2563EB] text-white rounded-md text-sm font-medium hover:bg-[#1E40AF] transition-colors"
                            >
                                Admin
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(true)}
                            className="md:hidden p-2 -mr-2 rounded-md text-[#475569] hover:bg-[#F8FAFC] transition-colors touch-target"
                            aria-label="Buka menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </nav>
            </header>

            {/* Mobile Drawer Overlay */}
            <div
                className={`drawer-overlay ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(false)}
            />

            {/* Mobile Drawer */}
            <div className={`drawer ${isOpen ? 'open' : ''}`}>
                <div className="flex flex-col h-full">
                    {/* Drawer Header */}
                    <div className="flex items-center justify-between p-4 border-b border-[#E2E8F0]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#2563EB] rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <span className="font-semibold text-[#0F172A]">Menu</span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 rounded-md text-[#475569] hover:bg-[#F8FAFC] transition-colors"
                            aria-label="Tutup menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Drawer Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${isActive
                                        ? 'bg-[#EFF6FF] text-[#2563EB]'
                                        : 'text-[#475569] hover:bg-[#F8FAFC]'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Drawer Footer */}
                    <div className="p-4 border-t border-[#E2E8F0] safe-bottom">
                        <Link
                            href="/admin"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#2563EB] text-white rounded-lg font-medium hover:bg-[#1E40AF] transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Masuk Admin
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}
