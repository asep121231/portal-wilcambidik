'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// Data sekolah Bruno dari DAPO Kemendikdasmen (Semester 2025/2026 Ganjil)
// Kode wilayah: 030613 (Kec. Bruno, Kab. Purworejo)

interface School {
    no: number
    nama: string
    npsn: string
    status: 'Negeri' | 'Swasta'
    pd: number
    guru: number
}

interface SchoolLevel {
    name: string
    icon: string
    schools: School[]
    totalPd: number
    totalGuru: number
}

// Data SD di Kecamatan Bruno
const sdSchools: School[] = [
    { no: 1, nama: "SD NEGERI 1 BRUNO", npsn: "20306356", status: "Negeri", pd: 241, guru: 10 },
    { no: 2, nama: "SD NEGERI 1 CEPEDAK", npsn: "20306352", status: "Negeri", pd: 202, guru: 11 },
    { no: 3, nama: "SD NEGERI 2 BRUNO", npsn: "20306235", status: "Negeri", pd: 134, guru: 8 },
    { no: 4, nama: "SD NEGERI 2 CEPEDAK", npsn: "20306218", status: "Negeri", pd: 110, guru: 8 },
    { no: 5, nama: "SD NEGERI BLIMBING", npsn: "20350701", status: "Negeri", pd: 142, guru: 8 },
    { no: 6, nama: "SD NEGERI BRONDONG", npsn: "20306519", status: "Negeri", pd: 243, guru: 10 },
    { no: 7, nama: "SD NEGERI BRUNOREJO", npsn: "20306528", status: "Negeri", pd: 158, guru: 9 },
    { no: 8, nama: "SD NEGERI BRUNOSARI", npsn: "20306527", status: "Negeri", pd: 177, guru: 10 },
    { no: 9, nama: "SD NEGERI GIYOMBONG", npsn: "20306560", status: "Negeri", pd: 63, guru: 6 },
    { no: 10, nama: "SD NEGERI GOWONG", npsn: "20306558", status: "Negeri", pd: 127, guru: 8 },
    { no: 11, nama: "SD NEGERI GUNUNGCONDONG", npsn: "20306564", status: "Negeri", pd: 99, guru: 8 },
    { no: 12, nama: "SD NEGERI KALIPURING", npsn: "20338810", status: "Negeri", pd: 114, guru: 7 },
    { no: 13, nama: "SD NEGERI KALIWUNGU", npsn: "20306434", status: "Negeri", pd: 268, guru: 15 },
    { no: 14, nama: "SD NEGERI KAMBANGAN", npsn: "20306433", status: "Negeri", pd: 55, guru: 8 },
    { no: 15, nama: "SD NEGERI KARANGGEDANG", npsn: "20306416", status: "Negeri", pd: 74, guru: 8 },
    { no: 16, nama: "SD NEGERI KEMRANGGEN", npsn: "20306484", status: "Negeri", pd: 95, guru: 8 },
    { no: 17, nama: "SD NEGERI KLAPASAWIT", npsn: "20342570", status: "Negeri", pd: 74, guru: 8 },
    { no: 18, nama: "SD NEGERI NGABEAN", npsn: "20305941", status: "Negeri", pd: 112, guru: 8 },
    { no: 19, nama: "SD NEGERI PAKISARUM", npsn: "20306017", status: "Negeri", pd: 109, guru: 9 },
    { no: 20, nama: "SD NEGERI PLAOSAN", npsn: "20305991", status: "Negeri", pd: 125, guru: 8 },
    { no: 21, nama: "SD NEGERI PLIPIRAN", npsn: "20305988", status: "Negeri", pd: 119, guru: 8 },
    { no: 22, nama: "SD NEGERI PUSPO", npsn: "20338819", status: "Negeri", pd: 95, guru: 6 },
    { no: 23, nama: "SD NEGERI ROWOPANJANG", npsn: "20305891", status: "Negeri", pd: 117, guru: 8 },
    { no: 24, nama: "SD NEGERI SILO", npsn: "20305925", status: "Negeri", pd: 218, guru: 10 },
    { no: 25, nama: "SD NEGERI SINGOJOYO", npsn: "20305922", status: "Negeri", pd: 208, guru: 13 },
    { no: 26, nama: "SD NEGERI TEGALSARI", npsn: "20305908", status: "Negeri", pd: 127, guru: 7 },
    { no: 27, nama: "SD NEGERI TEGES", npsn: "20305907", status: "Negeri", pd: 177, guru: 9 },
    { no: 28, nama: "SD NEGERI WATUDUWUR", npsn: "20306128", status: "Negeri", pd: 142, guru: 8 },
    { no: 29, nama: "SD Muhammadiyah Bruno", npsn: "70001207", status: "Swasta", pd: 84, guru: 3 },
]

// Data SMP di Kecamatan Bruno
const smpSchools: School[] = [
    { no: 1, nama: "SMP NEGERI 21 PURWOREJO", npsn: "20306108", status: "Negeri", pd: 477, guru: 27 },
    { no: 2, nama: "SMP NEGERI 42 PURWOREJO", npsn: "20341517", status: "Negeri", pd: 218, guru: 15 },
    { no: 3, nama: "SMP ISLAM SUDIRMAN BRUNO", npsn: "20341491", status: "Swasta", pd: 157, guru: 8 },
    { no: 4, nama: "SMP PGRI BRUNO", npsn: "20341490", status: "Swasta", pd: 141, guru: 10 },
]

// Data SMA di Kecamatan Bruno
const smaSchools: School[] = [
    { no: 1, nama: "SMAS ISLAM SUDIRMAN BRUNO", npsn: "20306191", status: "Swasta", pd: 180, guru: 12 },
]

const schoolLevels: SchoolLevel[] = [
    {
        name: 'Sekolah Dasar (SD)',
        icon: '🎒',
        schools: sdSchools,
        totalPd: 4009,
        totalGuru: 245
    },
    {
        name: 'Sekolah Menengah Pertama (SMP)',
        icon: '📚',
        schools: smpSchools,
        totalPd: 993,
        totalGuru: 60
    },
    {
        name: 'Sekolah Menengah Atas (SMA)',
        icon: '🎓',
        schools: smaSchools,
        totalPd: 180,
        totalGuru: 12
    },
]

function StatCard({ icon, label, value, color }: {
    icon: string
    label: string
    value: string | number
    color: string
}) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
                <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
                    {icon}
                </div>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
                </div>
            </div>
        </div>
    )
}

export default function DataSekolahPage() {
    const [activeTab, setActiveTab] = useState(0)
    const [lastUpdated] = useState(new Date().toISOString())

    const totalSekolah = schoolLevels.reduce((acc, level) => acc + level.schools.length, 0)
    const totalSiswa = schoolLevels.reduce((acc, level) => acc + level.totalPd, 0)
    const totalGuru = schoolLevels.reduce((acc, level) => acc + level.totalGuru, 0)

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-purple-600 to-orange-500 py-16">
                <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                        🏫 Data Sekolah Kecamatan Bruno
                    </h1>
                    <p className="text-lg text-white/80 max-w-2xl mx-auto">
                        Statistik sekolah, siswa, dan guru dari DAPO Kemendikdasmen
                    </p>
                    <p className="text-sm text-white/60 mt-4">
                        Sumber: <Link href="https://dapo.kemendikdasmen.go.id/sp/3/030613" target="_blank" className="underline hover:no-underline">DAPO Kemendikdasmen</Link> • Semester 2025/2026 Ganjil
                    </p>
                </div>
            </section>

            {/* Summary Stats */}
            <section className="py-8 -mt-8">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard
                            icon="🏫"
                            label="Total Sekolah"
                            value={totalSekolah}
                            color="bg-purple-100 dark:bg-purple-900/50"
                        />
                        <StatCard
                            icon="👨‍🎓"
                            label="Total Peserta Didik"
                            value={totalSiswa.toLocaleString('id-ID')}
                            color="bg-blue-100 dark:bg-blue-900/50"
                        />
                        <StatCard
                            icon="👨‍🏫"
                            label="Total Guru & Tendik"
                            value={totalGuru}
                            color="bg-green-100 dark:bg-green-900/50"
                        />
                    </div>
                </div>
            </section>

            {/* School Data Tabs */}
            <section className="py-8">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    {/* Tab Buttons */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {schoolLevels.map((level, index) => (
                            <button
                                key={level.name}
                                onClick={() => setActiveTab(index)}
                                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full transition-all ${activeTab === index
                                        ? 'bg-gradient-to-r from-purple-600 to-orange-500 text-white shadow-lg'
                                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <span>{level.icon}</span>
                                <span>{level.name}</span>
                                <span className={`px-2 py-0.5 text-xs rounded-full ${activeTab === index
                                        ? 'bg-white/20 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                    }`}>
                                    {level.schools.length}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {/* Level Summary */}
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                            <div className="flex flex-wrap items-center gap-6">
                                <div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Total Sekolah:</span>
                                    <span className="ml-2 font-semibold text-gray-900 dark:text-white">{schoolLevels[activeTab].schools.length}</span>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Total Siswa:</span>
                                    <span className="ml-2 font-semibold text-gray-900 dark:text-white">{schoolLevels[activeTab].totalPd.toLocaleString('id-ID')}</span>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Total Guru:</span>
                                    <span className="ml-2 font-semibold text-gray-900 dark:text-white">{schoolLevels[activeTab].totalGuru}</span>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">No</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Nama Sekolah</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">NPSN</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Status</th>
                                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Peserta Didik</th>
                                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Guru</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {schoolLevels[activeTab].schools.map((school) => (
                                        <tr key={school.npsn} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{school.no}</td>
                                            <td className="py-3 px-4">
                                                <p className="font-medium text-gray-900 dark:text-white">{school.nama}</p>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 font-mono">{school.npsn}</td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${school.status === 'Negeri'
                                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                                                        : 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300'
                                                    }`}>
                                                    {school.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-900 dark:text-white text-right font-semibold">{school.pd.toLocaleString('id-ID')}</td>
                                            <td className="py-3 px-4 text-sm text-gray-900 dark:text-white text-right">{school.guru}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Source Info */}
                    <div className="mt-8 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center text-2xl">
                                ℹ️
                            </div>
                            <div>
                                <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                                    Tentang Data Ini
                                </h3>
                                <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                                    Data diambil dari{' '}
                                    <Link
                                        href="https://dapo.kemendikdasmen.go.id/sp/3/030613"
                                        target="_blank"
                                        className="underline hover:no-underline"
                                    >
                                        DAPO Kemendikdasmen (Kec. Bruno)
                                    </Link>
                                    . Data ini merupakan data resmi Semester 2025/2026 Ganjil.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
