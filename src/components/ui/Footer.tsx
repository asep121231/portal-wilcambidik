export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="container-gov py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-6 bg-blue-800 rounded flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <span className="font-semibold text-gray-900">Wilcambidik Bruno</span>
                        </div>
                        <p className="text-gray-600 text-xs leading-relaxed">
                            Portal resmi penyebaran informasi kedinasan untuk sekolah-sekolah di wilayah Cabang Dinas Pendidikan Bruno.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-medium text-gray-900 mb-3">Tautan</h3>
                        <ul className="space-y-2 text-xs text-gray-600">
                            <li><a href="/" className="hover:text-blue-700">Beranda</a></li>
                            <li><a href="/#info" className="hover:text-blue-700">Informasi</a></li>
                            <li><a href="/admin" className="hover:text-blue-700">Admin</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-medium text-gray-900 mb-3">Kontak</h3>
                        <ul className="space-y-2 text-xs text-gray-600">
                            <li>Kecamatan Bruno, Purworejo</li>
                            <li>wilcambidik.bruno@disdikpurworejo.go.id</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
                    © {new Date().getFullYear()} Wilcambidik Bruno - Dinas Pendidikan Kabupaten Purworejo
                </div>
            </div>
        </footer>
    )
}
