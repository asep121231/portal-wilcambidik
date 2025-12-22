import { getVisitorStats } from '@/lib/actions/analytics'
import Link from 'next/link'

export default async function AnalyticsPage() {
    const stats = await getVisitorStats(30)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Analisis Pengunjung</h1>
                    <p className="text-sm text-gray-500">Statistik pengunjung website 30 hari terakhir</p>
                </div>
                <Link
                    href="/admin"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Kembali
                </Link>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Kunjungan</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalVisits.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Pengunjung Unik</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.uniqueVisitors.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">📱</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Mobile Users</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.deviceStats.find(d => d.device === 'mobile')?.count || 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">🖥️</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Desktop Users</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.deviceStats.find(d => d.device === 'desktop')?.count || 0}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Visits Chart */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h2 className="font-semibold text-gray-900 mb-4">Kunjungan Harian</h2>
                    <div className="h-48 flex items-end gap-1">
                        {stats.dailyVisits.slice(-14).map((day, i) => {
                            const maxCount = Math.max(...stats.dailyVisits.map(d => d.count), 1)
                            const height = (day.count / maxCount) * 100
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1" title={`${day.date}: ${day.count} kunjungan`}>
                                    <span className="text-xs text-gray-500">{day.count}</span>
                                    <div
                                        className="w-full bg-gradient-to-t from-purple-600 to-orange-500 rounded-t-md transition-all hover:opacity-80"
                                        style={{ height: `${Math.max(height, 4)}%` }}
                                    />
                                    <span className="text-xs text-gray-400">
                                        {new Date(day.date).getDate()}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Device Distribution */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h2 className="font-semibold text-gray-900 mb-4">Distribusi Perangkat</h2>
                    <div className="space-y-3">
                        {stats.deviceStats.length === 0 ? (
                            <p className="text-gray-500 text-sm text-center py-8">Belum ada data</p>
                        ) : (
                            stats.deviceStats.map((device, i) => {
                                const percentage = stats.totalVisits > 0 ? (device.count / stats.totalVisits * 100).toFixed(1) : 0
                                const deviceIcons: Record<string, string> = {
                                    desktop: '🖥️',
                                    mobile: '📱',
                                    tablet: '📱',
                                    unknown: '❓'
                                }
                                return (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="text-xl">{deviceIcons[device.device] || '❓'}</span>
                                        <div className="flex-1">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="capitalize font-medium">{device.device}</span>
                                                <span className="text-gray-500">{device.count} ({percentage}%)</span>
                                            </div>
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-purple-600 to-orange-500 rounded-full"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Browser Stats */}
                <div className="bg-white rounded-xl border border-gray-200">
                    <div className="p-5 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-900">Browser</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {stats.browserStats.length === 0 ? (
                            <p className="text-gray-500 text-sm text-center py-8">Belum ada data</p>
                        ) : (
                            stats.browserStats.slice(0, 5).map((browser, i) => {
                                const browserIcons: Record<string, string> = {
                                    Chrome: '🌐',
                                    Firefox: '🦊',
                                    Safari: '🧭',
                                    Edge: '🔵',
                                    Opera: '🔴',
                                    unknown: '❓'
                                }
                                return (
                                    <div key={i} className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">{browserIcons[browser.browser] || '🌐'}</span>
                                            <span className="font-medium">{browser.browser}</span>
                                        </div>
                                        <span className="text-gray-500">{browser.count}</span>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* Top Pages */}
                <div className="bg-white rounded-xl border border-gray-200">
                    <div className="p-5 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-900">Halaman Terpopuler</h2>
                    </div>
                    <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                        {stats.topPages.length === 0 ? (
                            <p className="text-gray-500 text-sm text-center py-8">Belum ada data</p>
                        ) : (
                            stats.topPages.map((page, i) => (
                                <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                                            {i + 1}
                                        </span>
                                        <span className="text-sm truncate">{page.page}</span>
                                    </div>
                                    <span className="text-gray-500 text-sm flex-shrink-0 ml-2">{page.count} views</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
