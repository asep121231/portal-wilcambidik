import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div>
                                <div className="font-bold text-lg text-gray-900">Wilcambidik Bruno</div>
                                <div className="text-sm text-gray-500">Portal Informasi Kedinasan</div>
                            </div>
                        </div>
                        <p className="text-gray-600 max-w-sm leading-relaxed">
                            Pusat informasi resmi dari Wilayah Cabang Bidang Diklatpim Bruno untuk
                            masyarakat dan aparatur sipil negara.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Navigasi</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/" className="text-gray-600 hover:text-purple-600 transition-colors">
                                    Beranda
                                </Link>
                            </li>
                            <li>
                                <Link href="/#info" className="text-gray-600 hover:text-purple-600 transition-colors">
                                    Informasi
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin" className="text-gray-600 hover:text-purple-600 transition-colors">
                                    Admin Panel
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Kontak</h3>
                        <ul className="space-y-3 text-gray-600">
                            <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Kab. Magetan, Jawa Timur
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
            <div className="border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
                        <p>© 2024 Wilcambidik Bruno. Hak Cipta Dilindungi.</p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="hover:text-purple-600 transition-colors">Kebijakan Privasi</a>
                            <a href="#" className="hover:text-purple-600 transition-colors">Syarat & Ketentuan</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
