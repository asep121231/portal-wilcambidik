'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface SchoolData {
    nama?: string
    sd_n?: number
    sd_s?: number
    sd?: number
    smp_n?: number
    smp_s?: number
    smp?: number
    sma_n?: number
    sma_s?: number
    sma?: number
    smk_n?: number
    smk_s?: number
    smk?: number
    tk_n?: number
    tk_s?: number
    tk?: number
    sekolah_n?: number
    sekolah_s?: number
    sekolah?: number
}

interface ApiResponse {
    success: boolean
    data: SchoolData
    source: string
    lastUpdated: string
    semester: string
}

// Daftar SD di wilayah Bruno (data statis sebagai fallback)
const brunoSchools = [
    { npsn: '20304001', nama: 'SDN 1 BRUNO', alamat: 'Desa Bruno' },
    { npsn: '20304002', nama: 'SDN 2 BRUNO', alamat: 'Desa Bruno' },
    { npsn: '20304003', nama: 'SDN BRUNOREJO', alamat: 'Desa Brunorejo' },
    { npsn: '20304004', nama: 'SDN CANGKREP LOR', alamat: 'Desa Cangkrep Lor' },
    { npsn: '20304005', nama: 'SDN CANGKREP KIDUL', alamat: 'Desa Cangkrep Kidul' },
    { npsn: '20304006', nama: 'SDN KALIWUNGU', alamat: 'Desa Kaliwungu' },
    { npsn: '20304007', nama: 'SDN KEDUNGPUCANG', alamat: 'Desa Kedungpucang' },
    { npsn: '20304008', nama: 'SDN PAKISARUM', alamat: 'Desa Pakisarum' },
    { npsn: '20304009', nama: 'SDN SOMONGARI', alamat: 'Desa Somongari' },
    { npsn: '20304010', nama: 'SDN TLOGOREJO', alamat: 'Desa Tlogorejo' },
]

function StatCard({ icon, label, value, subtext, color }: {
    icon: string
    label: string
    value: string | number
    subtext?: string
    color: string
}) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
                <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
                    {icon}
                </div>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
                    {subtext && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtext}</p>}
                </div>
            </div>
        </div>
    )
}

export default function DataSekolahPage() {
    const [data, setData] = useState<SchoolData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [lastUpdated, setLastUpdated] = useState<string>('')

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/dapo?type=sekolah')
                const result: ApiResponse = await response.json()

                if (result.success && result.data) {
                    setData(result.data)
                    setLastUpdated(result.lastUpdated)
                } else {
                    setError('Gagal memuat data')
                }
            } catch (err) {
                console.error('Error fetching data:', err)
                setError('Gagal memuat data dari server')
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [])

    const formatNumber = (num: number | undefined) => {
        if (num === undefined) return '-'
        return num.toLocaleString('id-ID')
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-purple-600 to-orange-500 py-16">
                <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                        🏫 Data Sekolah
                    </h1>
                    <p className="text-lg text-white/80 max-w-2xl mx-auto">
                        Statistik data sekolah, siswa, dan guru dari DAPO Kemendikdasmen
                    </p>
                    {lastUpdated && (
                        <p className="text-sm text-white/60 mt-4">
                            Sumber: DAPO Kemendikdasmen • Diperbarui: {new Date(lastUpdated).toLocaleString('id-ID')}
                        </p>
                    )}
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    {/* Province Stats - Jawa Tengah */}
                    <div className="mb-12">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <span>📊</span>
                            <span>Statistik Jawa Tengah</span>
                        </h2>

                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
                                        <div className="flex items-start gap-4">
                                            <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                                            <div className="flex-1">
                                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2" />
                                                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-xl text-center">
                                {error}
                            </div>
                        ) : data ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard
                                    icon="🏫"
                                    label="Total Sekolah"
                                    value={formatNumber(data.sekolah)}
                                    subtext={`Negeri: ${formatNumber(data.sekolah_n)} • Swasta: ${formatNumber(data.sekolah_s)}`}
                                    color="bg-purple-100 dark:bg-purple-900/50"
                                />
                                <StatCard
                                    icon="🎒"
                                    label="Sekolah Dasar (SD)"
                                    value={formatNumber(data.sd)}
                                    subtext={`Negeri: ${formatNumber(data.sd_n)} • Swasta: ${formatNumber(data.sd_s)}`}
                                    color="bg-blue-100 dark:bg-blue-900/50"
                                />
                                <StatCard
                                    icon="📚"
                                    label="SMP"
                                    value={formatNumber(data.smp)}
                                    subtext={`Negeri: ${formatNumber(data.smp_n)} • Swasta: ${formatNumber(data.smp_s)}`}
                                    color="bg-green-100 dark:bg-green-900/50"
                                />
                                <StatCard
                                    icon="🎓"
                                    label="SMA/SMK"
                                    value={formatNumber((data.sma || 0) + (data.smk || 0))}
                                    subtext={`SMA: ${formatNumber(data.sma)} • SMK: ${formatNumber(data.smk)}`}
                                    color="bg-orange-100 dark:bg-orange-900/50"
                                />
                            </div>
                        ) : null}
                    </div>

                    {/* Bruno Schools */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <span>🏫</span>
                            <span>SD di Wilayah Bruno</span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {brunoSchools.map((school, index) => (
                                <div
                                    key={school.npsn}
                                    className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-orange-100 dark:from-purple-900/50 dark:to-orange-900/50 rounded-xl flex items-center justify-center text-lg font-bold text-purple-600 dark:text-purple-400">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                                {school.nama}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                {school.alamat}
                                            </p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                NPSN: {school.npsn}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Source Info */}
                    <div className="mt-12 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center text-2xl">
                                ℹ️
                            </div>
                            <div>
                                <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                                    Tentang Data Ini
                                </h3>
                                <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                                    Data statistik diambil secara real-time dari{' '}
                                    <Link
                                        href="https://dapo.kemendikdasmen.go.id"
                                        target="_blank"
                                        className="underline hover:no-underline"
                                    >
                                        DAPO Kemendikdasmen
                                    </Link>
                                    . Data diperbarui setiap jam untuk memastikan akurasi.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
