'use client'

import { useState } from 'react'

interface TeamMember {
    name: string
    position: string
    role: 'leader' | 'supervisor' | 'staff'
    initials: string
}

const teamMembers: TeamMember[] = [
    {
        name: 'AKHMADI, S.Pd., M.M.Pd',
        position: 'Koordinator Wilayah Cabang Bidang Pendidikan',
        role: 'leader',
        initials: 'AK'
    },
    {
        name: 'NGESTI WAHYUNI, S.Pd.SD.',
        position: 'Pengawas Sekolah',
        role: 'supervisor',
        initials: 'NW'
    },
    {
        name: 'UMI ULFATULJANAH, S.Pd.SD.',
        position: 'Pengawas Sekolah',
        role: 'supervisor',
        initials: 'UU'
    },
    {
        name: 'JUPRI',
        position: 'Tenaga Teknis',
        role: 'staff',
        initials: 'JP'
    }
]

export default function StrukturOrganisasiPage() {
    const [hoveredMember, setHoveredMember] = useState<number | null>(null)

    const leader = teamMembers.find(m => m.role === 'leader')
    const supervisors = teamMembers.filter(m => m.role === 'supervisor')
    const staff = teamMembers.filter(m => m.role === 'staff')

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'leader': return 'from-purple-600 to-orange-500'
            case 'supervisor': return 'from-blue-500 to-cyan-400'
            case 'staff': return 'from-green-500 to-emerald-400'
            default: return 'from-gray-500 to-gray-400'
        }
    }

    const getRoleBgColor = (role: string) => {
        switch (role) {
            case 'leader': return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700'
            case 'supervisor': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
            case 'staff': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
            default: return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-950">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-orange-500/10 dark:from-purple-600/20 dark:to-orange-500/20" />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />

                <div className="relative container mx-auto px-4 py-16 md:py-24">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-purple-200 dark:border-purple-700 mb-6">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Wilayah Cabang Bidang Pendidikan</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                                Struktur Organisasi
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8">
                            Wilcambidik Bruno, Kecamatan Bruno, Kabupaten Purworejo
                        </p>

                        <div className="flex flex-wrap justify-center gap-4 text-sm">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-600 to-orange-500" />
                                <span className="text-gray-600 dark:text-gray-300">Korwilcambidik</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                                <span className="text-gray-600 dark:text-gray-300">Pengawas</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-400" />
                                <span className="text-gray-600 dark:text-gray-300">Tenaga Teknis</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Organization Chart */}
            <div className="container mx-auto px-4 py-12 md:py-16">
                {/* Leader Card */}
                {leader && (
                    <div className="flex justify-center mb-12">
                        <div
                            className={`relative group cursor-pointer transition-all duration-500 ${hoveredMember === 0 ? 'scale-105' : ''
                                }`}
                            onMouseEnter={() => setHoveredMember(0)}
                            onMouseLeave={() => setHoveredMember(null)}
                        >
                            {/* Glow Effect */}
                            <div className={`absolute -inset-1 bg-gradient-to-r ${getRoleColor(leader.role)} rounded-2xl blur-lg opacity-40 group-hover:opacity-75 transition-opacity`} />

                            <div className={`relative ${getRoleBgColor(leader.role)} border-2 rounded-2xl p-8 md:p-10 backdrop-blur-sm`}>
                                {/* Crown Icon */}
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                                        <span className="text-white text-sm">👑</span>
                                    </div>
                                </div>

                                {/* Avatar */}
                                <div className="flex flex-col items-center">
                                    <div className={`w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-r ${getRoleColor(leader.role)} p-1 mb-4 shadow-xl`}>
                                        <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                                            <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                                                {leader.initials}
                                            </span>
                                        </div>
                                    </div>

                                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
                                        {leader.name}
                                    </h3>

                                    <div className={`inline-flex px-4 py-2 bg-gradient-to-r ${getRoleColor(leader.role)} rounded-full`}>
                                        <span className="text-white text-sm font-semibold">
                                            Korwilcambidik Bruno
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Connecting Lines */}
                <div className="hidden md:flex justify-center mb-8">
                    <div className="w-px h-12 bg-gradient-to-b from-purple-400 to-blue-400" />
                </div>
                <div className="hidden md:flex justify-center mb-8">
                    <div className="w-1/2 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
                </div>

                {/* Supervisors Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto mb-12">
                    {supervisors.map((member, index) => (
                        <div
                            key={index}
                            className={`relative group cursor-pointer transition-all duration-500 ${hoveredMember === index + 1 ? 'scale-105' : ''
                                }`}
                            onMouseEnter={() => setHoveredMember(index + 1)}
                            onMouseLeave={() => setHoveredMember(null)}
                        >
                            {/* Glow Effect */}
                            <div className={`absolute -inset-0.5 bg-gradient-to-r ${getRoleColor(member.role)} rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity`} />

                            <div className={`relative ${getRoleBgColor(member.role)} border rounded-xl p-6 backdrop-blur-sm`}>
                                <div className="flex items-center gap-4">
                                    {/* Avatar */}
                                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${getRoleColor(member.role)} p-0.5 shadow-lg flex-shrink-0`}>
                                        <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                                                {member.initials}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                                            {member.name}
                                        </h3>
                                        <div className={`inline-flex mt-2 px-3 py-1 bg-gradient-to-r ${getRoleColor(member.role)} rounded-full`}>
                                            <span className="text-white text-xs font-semibold">
                                                {member.position}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Connecting Lines */}
                <div className="hidden md:flex justify-center mb-8">
                    <div className="w-px h-8 bg-gradient-to-b from-blue-400 to-green-400" />
                </div>

                {/* Staff Row */}
                <div className="flex justify-center">
                    {staff.map((member, index) => (
                        <div
                            key={index}
                            className={`relative group cursor-pointer transition-all duration-500 max-w-md w-full ${hoveredMember === supervisors.length + index + 1 ? 'scale-105' : ''
                                }`}
                            onMouseEnter={() => setHoveredMember(supervisors.length + index + 1)}
                            onMouseLeave={() => setHoveredMember(null)}
                        >
                            {/* Glow Effect */}
                            <div className={`absolute -inset-0.5 bg-gradient-to-r ${getRoleColor(member.role)} rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity`} />

                            <div className={`relative ${getRoleBgColor(member.role)} border rounded-xl p-6 backdrop-blur-sm`}>
                                <div className="flex items-center gap-4">
                                    {/* Avatar */}
                                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${getRoleColor(member.role)} p-0.5 shadow-lg flex-shrink-0`}>
                                        <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                                            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                                                {member.initials}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                            {member.name}
                                        </h3>
                                        <div className={`inline-flex mt-2 px-3 py-1 bg-gradient-to-r ${getRoleColor(member.role)} rounded-full`}>
                                            <span className="text-white text-xs font-semibold">
                                                {member.position}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Info */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
                        <span className="text-2xl">🏫</span>
                        <span className="text-gray-600 dark:text-gray-300 font-medium">
                            Melayani Satuan Pendidikan SD Se-Kecamatan Bruno
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
