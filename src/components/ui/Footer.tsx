import Link from 'next/link'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-[#111827] text-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer */}
                <div className="py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Logo & Description */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#2563EB] to-[#3B82F6] rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">Wilcambidik Bruno</h3>
                                <p className="text-sm text-gray-400">Portal Informasi Kedinasan</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Portal resmi untuk menyampaikan informasi kedinasan kepada satuan pendidikan
                            Sekolah Dasar di Wilayah Cabang Dinas Pendidikan Bruno.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Navigasi</h4>
                        <nav className="space-y-2.5">
                            <Link href="/" className="block text-sm text-gray-400 hover:text-white transition-colors">
                                Beranda
                            </Link>
                            <Link href="/#info" className="block text-sm text-gray-400 hover:text-white transition-colors">
                                Informasi Terbaru
                            </Link>
                            <Link href="/admin" className="block text-sm text-gray-400 hover:text-white transition-colors">
                                Halaman Admin
                            </Link>
                        </nav>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Kontak</h4>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 text-sm text-gray-400">
                                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>Kecamatan Bruno, Kabupaten Purworejo, Jawa Tengah</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>info@wilcambidik-bruno.go.id</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="py-4 border-t border-gray-800 text-center">
                    <p className="text-xs text-gray-500">
                        © {currentYear} Wilcambidik Bruno. Hak Cipta Dilindungi.
                    </p>
                </div>
            </div>
        </footer>
    )
}
