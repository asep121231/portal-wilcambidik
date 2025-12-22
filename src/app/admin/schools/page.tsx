'use client'

import { useState, useEffect } from 'react'
import { getSchools, getSchoolLevels, createSchool, updateSchool, deleteSchool, type School, type SchoolLevel } from '@/lib/actions/schools'

export default function AdminSchoolsPage() {
    const [schools, setSchools] = useState<School[]>([])
    const [levels, setLevels] = useState<SchoolLevel[]>([])
    const [selectedLevel, setSelectedLevel] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingSchool, setEditingSchool] = useState<School | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

    useEffect(() => {
        loadData()
    }, [selectedLevel])

    async function loadData() {
        setIsLoading(true)
        const [schoolsData, levelsData] = await Promise.all([
            getSchools(selectedLevel || undefined),
            getSchoolLevels()
        ])
        setSchools(schoolsData)
        setLevels(levelsData)
        setIsLoading(false)
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsSubmitting(true)

        const form = e.currentTarget
        const formData = new FormData(form)

        let result
        if (editingSchool) {
            result = await updateSchool(editingSchool.id, formData)
        } else {
            result = await createSchool(formData)
        }

        if (result.success) {
            setNotification({ type: 'success', message: editingSchool ? 'Sekolah berhasil diupdate!' : 'Sekolah berhasil ditambahkan!' })
            setShowForm(false)
            setEditingSchool(null)
            form.reset()
            loadData()
        } else {
            setNotification({ type: 'error', message: result.error || 'Gagal menyimpan sekolah' })
        }

        setIsSubmitting(false)
        setTimeout(() => setNotification(null), 3000)
    }

    async function handleDelete(id: string, nama: string) {
        if (!confirm(`Hapus sekolah "${nama}"?`)) return

        const result = await deleteSchool(id)
        if (result.success) {
            setNotification({ type: 'success', message: 'Sekolah berhasil dihapus!' })
            loadData()
        } else {
            setNotification({ type: 'error', message: result.error || 'Gagal menghapus sekolah' })
        }
        setTimeout(() => setNotification(null), 3000)
    }

    function handleEdit(school: School) {
        setEditingSchool(school)
        setShowForm(true)
    }

    function handleCancel() {
        setShowForm(false)
        setEditingSchool(null)
    }

    // Calculate stats
    const totalSchools = schools.length
    const totalPd = schools.reduce((acc, s) => acc + s.peserta_didik, 0)
    const totalGuru = schools.reduce((acc, s) => acc + s.guru, 0)

    return (
        <div className="space-y-6">
            {/* Notification */}
            {notification && (
                <div className={`p-4 rounded-lg ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {notification.message}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Data Sekolah</h1>
                    <p className="text-sm text-gray-500">Kelola data sekolah, siswa, dan guru</p>
                </div>
                <button
                    onClick={() => { setShowForm(!showForm); setEditingSchool(null); }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-orange-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-colors shadow-lg"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Sekolah
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Total Sekolah</p>
                    <p className="text-2xl font-bold text-gray-900">{totalSchools}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Total Siswa</p>
                    <p className="text-2xl font-bold text-gray-900">{totalPd.toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Total Guru</p>
                    <p className="text-2xl font-bold text-gray-900">{totalGuru}</p>
                </div>
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        {editingSchool ? 'Edit Sekolah' : 'Tambah Sekolah Baru'}
                    </h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jenjang *</label>
                            <select
                                name="levelId"
                                required
                                defaultValue={editingSchool?.level_id || ''}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="">Pilih Jenjang</option>
                                {levels.map((level) => (
                                    <option key={level.id} value={level.id}>{level.icon} {level.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                            <select
                                name="status"
                                required
                                defaultValue={editingSchool?.status || 'Negeri'}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="Negeri">Negeri</option>
                                <option value="Swasta">Swasta</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Sekolah *</label>
                            <input
                                type="text"
                                name="nama"
                                required
                                defaultValue={editingSchool?.nama || ''}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Contoh: SD NEGERI 1 BRUNO"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">NPSN *</label>
                            <input
                                type="text"
                                name="npsn"
                                required
                                defaultValue={editingSchool?.npsn || ''}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Contoh: 20306356"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                            <input
                                type="text"
                                name="alamat"
                                defaultValue={editingSchool?.alamat || ''}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Desa/Kelurahan"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Peserta Didik</label>
                            <input
                                type="number"
                                name="pesertaDidik"
                                min="0"
                                defaultValue={editingSchool?.peserta_didik || 0}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Guru</label>
                            <input
                                type="number"
                                name="guru"
                                min="0"
                                defaultValue={editingSchool?.guru || 0}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div className="md:col-span-2 flex items-center gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Menyimpan...' : editingSchool ? 'Update' : 'Simpan'}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-2.5 border border-gray-200 text-gray-600 font-medium rounded-lg hover:bg-gray-50"
                            >
                                Batal
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Filter */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setSelectedLevel('')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${!selectedLevel
                        ? 'bg-purple-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    Semua
                </button>
                {levels.map((level) => (
                    <button
                        key={level.id}
                        onClick={() => setSelectedLevel(level.id)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${selectedLevel === level.id
                            ? 'bg-purple-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <span>{level.icon}</span>
                        <span>{level.name}</span>
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center">
                        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="mt-2 text-sm text-gray-500">Memuat data...</p>
                    </div>
                ) : schools.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">🏫</span>
                        </div>
                        <p className="text-gray-500">Belum ada data sekolah. Klik "Tambah Sekolah" untuk memulai.</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Sekolah</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">NPSN</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Siswa</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Guru</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {schools.map((school) => (
                                <tr key={school.id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                        <p className="font-medium text-gray-900">{school.nama}</p>
                                        <p className="text-xs text-gray-500">{school.school_levels?.name}</p>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-600 font-mono">{school.npsn}</td>
                                    <td className="py-3 px-4">
                                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${school.status === 'Negeri'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            {school.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-900 text-right font-semibold">
                                        {school.peserta_didik.toLocaleString('id-ID')}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-900 text-right">{school.guru}</td>
                                    <td className="py-3 px-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(school)}
                                                className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
                                                title="Edit"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(school.id, school.nama)}
                                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                                title="Hapus"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
