export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 py-6 mt-auto">
            <div className="max-w-5xl mx-auto px-4">
                <div className="text-center text-sm text-gray-500">
                    <p className="font-medium text-gray-700 mb-1">
                        Portal Informasi Kedinasan
                    </p>
                    <p>Wilcambidik Bruno - Dinas Pendidikan</p>
                    <p className="mt-2">
                        © {new Date().getFullYear()} Wilcambidik Bruno. Hak Cipta Dilindungi.
                    </p>
                </div>
            </div>
        </footer>
    )
}
