'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getSchoolStats } from '@/lib/actions/schools'

interface SchoolLevel {
    id: string
    name: string
    icon: string
    sort_order: number
    count: number
    totalPd: number
    totalGuru: number
    schools: Array<{
        id: string
        nama: string
        npsn: string
        status: 'Negeri' | 'Swasta'
        peserta_didik: number
        guru: number
    }>
}

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
    const [stats, setStats] = useState<SchoolLevel[]>([])
    const [activeTab, setActiveTab] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function loadData() {
            const result = await getSchoolStats()
            setStats(result.stats)
            setIsLoading(false)
        }
        loadData()
    }, [])

    const totalSekolah = stats.reduce((acc, level) => acc + level.count, 0)
    const totalSiswa = stats.reduce((acc, level) => acc + level.totalPd, 0)
    const totalGuru = stats.reduce((acc, level) => acc + level.totalGuru, 0)

    const activeLevel = stats[activeTab]

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
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2" />
                                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : totalSekolah === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
                            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-4xl">🏫</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Belum ada data sekolah
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Data sekolah akan ditampilkan setelah diinput oleh admin
                            </p>
                        </div>
                    ) : (
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
                    )}
                </div>
            </section>

            {/* School Data Tabs */}
            {!isLoading && stats.length > 0 && (
                <section className="py-8">
                    <div className="max-w-7xl mx-auto px-4 lg:px-8">
                        {/* Tab Buttons */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {stats.map((level, index) => (
                                <button
                                    key={level.id}
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
                                        {level.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        {activeLevel && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                {/* Level Summary */}
                                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                                    <div className="flex flex-wrap items-center gap-6">
                                        <div>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Total Sekolah:</span>
                                            <span className="ml-2 font-semibold text-gray-900 dark:text-white">{activeLevel.count}</span>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Total Siswa:</span>
                                            <span className="ml-2 font-semibold text-gray-900 dark:text-white">{activeLevel.totalPd.toLocaleString('id-ID')}</span>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Total Guru:</span>
                                            <span className="ml-2 font-semibold text-gray-900 dark:text-white">{activeLevel.totalGuru}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Table */}
                                {activeLevel.schools.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                        Belum ada data sekolah untuk jenjang ini
                                    </div>
                                ) : (
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
                                                {activeLevel.schools.map((school, index) => (
                                                    <tr key={school.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{index + 1}</td>
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
                                                        <td className="py-3 px-4 text-sm text-gray-900 dark:text-white text-right font-semibold">{school.peserta_didik.toLocaleString('id-ID')}</td>
                                                        <td className="py-3 px-4 text-sm text-gray-900 dark:text-white text-right">{school.guru}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

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
                                        . Data dikelola oleh admin portal dan diperbarui secara berkala.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </div>
    )
}
