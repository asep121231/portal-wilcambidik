import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-[#0F172A] text-white" id="kontak">
            <div className="container-gov py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Info */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-[#2563EB] rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div>
                                <span className="block font-semibold text-white">Wilcambidik Bruno</span>
                                <span className="block text-sm text-[#94A3B8]">Portal Informasi Kedinasan</span>
                            </div>
                        </div>
                        <p className="text-sm text-[#94A3B8] leading-relaxed">
                            Portal resmi untuk penyebaran informasi kedinasan dari Wilayah Cabang Dinas Pendidikan Bruno kepada seluruh sekolah dasar di wilayah binaan.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Navigasi</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-sm text-[#94A3B8] hover:text-white transition-colors">
                                    Beranda
                                </Link>
                            </li>
                            <li>
                                <Link href="/#info" className="text-sm text-[#94A3B8] hover:text-white transition-colors">
                                    Informasi
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin" className="text-sm text-[#94A3B8] hover:text-white transition-colors">
                                    Admin Panel
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Kontak</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-[#94A3B8] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-sm text-[#94A3B8]">
                                    Kec. Bruno, Kab. Purworejo, Jawa Tengah
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-[#94A3B8] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className="text-sm text-[#94A3B8]">
                                    wilcambidik.bruno@gmail.com
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-10 pt-6 border-t border-[#1E293B]">
                    <p className="text-sm text-[#64748B] text-center">
                        © {new Date().getFullYear()} Wilcambidik Bruno. Hak cipta dilindungi.
                    </p>
                </div>
            </div>
        </footer>
    )
}
