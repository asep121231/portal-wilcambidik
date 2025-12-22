'use client'

export default function OfflinePage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                {/* Offline Icon */}
                <div className="w-24 h-24 mx-auto mb-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
                    </svg>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    Anda Sedang Offline
                </h1>

                {/* Description */}
                <p className="text-gray-600 mb-8">
                    Sepertinya Anda tidak terhubung ke internet.
                    Silakan periksa koneksi Anda dan coba lagi.
                </p>

                {/* Retry Button */}
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-orange-500 text-white font-medium rounded-full hover:opacity-90 transition-opacity shadow-lg"
                >
                    Coba Lagi
                </button>

                {/* Cached Content Notice */}
                <p className="mt-8 text-sm text-gray-400">
                    Beberapa halaman yang pernah Anda kunjungi mungkin masih tersedia.
                </p>
            </div>
        </div>
    )
}
