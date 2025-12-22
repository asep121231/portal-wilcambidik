'use client'

import { useState } from 'react'
import Link from 'next/link'
import { subscribeEmail } from '@/lib/actions/email'

export default function Footer() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return

        setIsLoading(true)
        setMessage(null)

        try {
            const result = await subscribeEmail(email)
            if (result.success) {
                setMessage({ type: 'success', text: 'Berhasil! Cek email untuk verifikasi.' })
                setEmail('')
            } else {
                setMessage({ type: 'error', text: result.error || 'Gagal berlangganan' })
            }
        } catch {
            setMessage({ type: 'error', text: 'Terjadi kesalahan' })
        }

        setIsLoading(false)
    }

    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            {/* Newsletter Section */}
            <div className="bg-gradient-to-r from-purple-600 to-orange-500">
                <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div className="text-center lg:text-left">
                            <h3 className="text-2xl font-bold text-white mb-2">
                                📬 Dapatkan Informasi Terbaru
                            </h3>
                            <p className="text-white/80">
                                Langganan newsletter untuk update informasi langsung ke email Anda
                            </p>
                        </div>
                        <form onSubmit={handleSubscribe} className="w-full lg:w-auto">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Masukkan email Anda"
                                        className="w-full sm:w-80 px-5 py-3.5 rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/60 focus:outline-none focus:border-white/50 transition-colors"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-6 py-3.5 bg-white text-purple-600 font-semibold rounded-xl hover:bg-purple-50 disabled:opacity-50 transition-all shadow-lg"
                                >
                                    {isLoading ? 'Memproses...' : 'Langganan'}
                                </button>
                            </div>
                            {message && (
                                <p className={`mt-3 text-sm ${message.type === 'success' ? 'text-green-200' : 'text-red-200'}`}>
                                    {message.text}
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 to-orange-500 flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div>
                                <div className="font-bold text-lg text-gray-900 dark:text-white">Wilcambidik Bruno</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Portal Informasi Kedinasan</div>
                            </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 max-w-sm leading-relaxed">
                            Pusat informasi resmi dari Wilayah Cabang Bidang Pendidikan Bruno untuk
                            masyarakat dan aparatur sipil negara.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Navigasi</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                                    Beranda
                                </Link>
                            </li>
                            <li>
                                <Link href="/#info" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                                    Informasi
                                </Link>
                            </li>
                            <li>
                                <Link href="/galeri" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                                    Galeri
                                </Link>
                            </li>
                            <li>
                                <Link href="/dokumen" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                                    Dokumen
                                </Link>
                            </li>
                            <li>
                                <Link href="/data-sekolah" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                                    Data Sekolah
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                                    Admin Panel
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Kontak</h3>
                        <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                            <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Kec. Bruno, Kab. Purworejo, Jawa Tengah
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                info@wilcambidik.bruno
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <p>© 2024 Wilcambidik Bruno. Hak Cipta Dilindungi.</p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Kebijakan Privasi</a>
                            <a href="#" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Syarat & Ketentuan</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
