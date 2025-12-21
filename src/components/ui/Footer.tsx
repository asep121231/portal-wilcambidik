export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="container-main py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div>
                                <div className="font-bold text-gray-900">Wilcambidik Bruno</div>
                                <div className="text-xs text-gray-500">Portal Informasi Kedinasan</div>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600">
                            Portal resmi penyebaran informasi kedinasan untuk seluruh sekolah di wilayah Cabang Dinas Pendidikan Bruno.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Tautan Cepat</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                                    Beranda
                                </a>
                            </li>
                            <li>
                                <a href="/#info" className="text-gray-600 hover:text-blue-600 transition-colors">
                                    Informasi Terbaru
                                </a>
                            </li>
                            <li>
                                <a href="/admin" className="text-gray-600 hover:text-blue-600 transition-colors">
                                    Admin Panel
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Kontak</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Kecamatan Bruno, Purworejo
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                wilcambidik.bruno@disdikpurworejo.go.id
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} Wilcambidik Bruno - Dinas Pendidikan Kabupaten Purworejo
                </div>
            </div>
        </footer>
    )
}
