'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import {
    getActivities,
    getActivityCategories,
    createActivity,
    updateActivity,
    deleteActivity,
    uploadActivityPhoto,
    deleteActivityPhoto,
    type Activity,
    type ActivityCategory
} from '@/lib/actions/gallery'

export default function AdminGalleryPage() {
    const [activities, setActivities] = useState<Activity[]>([])
    const [categories, setCategories] = useState<ActivityCategory[]>([])
    const [selectedCategory, setSelectedCategory] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
    const [uploadingPhotos, setUploadingPhotos] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        loadData()
    }, [selectedCategory])

    async function loadData() {
        setIsLoading(true)
        const [activitiesData, categoriesData] = await Promise.all([
            getActivities(selectedCategory || undefined, false),
            getActivityCategories()
        ])
        setActivities(activitiesData)
        setCategories(categoriesData)
        setIsLoading(false)
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsSubmitting(true)

        const form = e.currentTarget
        const formData = new FormData(form)

        let result
        if (editingActivity) {
            result = await updateActivity(editingActivity.id, formData)
        } else {
            result = await createActivity(formData)
        }

        if (result.success) {
            setNotification({ type: 'success', message: editingActivity ? 'Kegiatan berhasil diupdate!' : 'Kegiatan berhasil ditambahkan!' })
            setShowForm(false)
            setEditingActivity(null)
            form.reset()
            loadData()
        } else {
            setNotification({ type: 'error', message: result.error || 'Gagal menyimpan kegiatan' })
        }

        setIsSubmitting(false)
        setTimeout(() => setNotification(null), 3000)
    }

    async function handleDelete(id: string, title: string) {
        if (!confirm(`Hapus kegiatan "${title}" beserta semua fotonya?`)) return

        const result = await deleteActivity(id)
        if (result.success) {
            setNotification({ type: 'success', message: 'Kegiatan berhasil dihapus!' })
            loadData()
        } else {
            setNotification({ type: 'error', message: result.error || 'Gagal menghapus kegiatan' })
        }
        setTimeout(() => setNotification(null), 3000)
    }

    async function handlePhotoUpload(activityId: string, files: FileList) {
        setUploadingPhotos(true)
        let successCount = 0

        for (const file of Array.from(files)) {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('activityId', activityId)

            try {
                const response = await fetch('/api/gallery/upload', {
                    method: 'POST',
                    body: formData,
                })
                const result = await response.json()
                if (result.success) {
                    successCount++
                }
            } catch (error) {
                console.error('Upload error:', error)
            }
        }

        setUploadingPhotos(false)
        loadData()
        if (successCount > 0) {
            setNotification({ type: 'success', message: `${successCount} foto berhasil diupload!` })
        } else {
            setNotification({ type: 'error', message: 'Gagal mengupload foto' })
        }
        setTimeout(() => setNotification(null), 3000)
    }

    async function handleDeletePhoto(photoId: string, photoUrl: string) {
        if (!confirm('Hapus foto ini?')) return

        const result = await deleteActivityPhoto(photoId, photoUrl)
        if (result.success) {
            loadData()
            setNotification({ type: 'success', message: 'Foto berhasil dihapus!' })
        } else {
            setNotification({ type: 'error', message: result.error || 'Gagal menghapus foto' })
        }
        setTimeout(() => setNotification(null), 3000)
    }

    function handleEdit(activity: Activity) {
        setEditingActivity(activity)
        setShowForm(true)
    }

    function handleCancel() {
        setShowForm(false)
        setEditingActivity(null)
    }

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
                    <h1 className="text-xl font-bold text-gray-900">Galeri Kegiatan</h1>
                    <p className="text-sm text-gray-500">Kelola dokumentasi foto kegiatan</p>
                </div>
                <button
                    onClick={() => { setShowForm(!showForm); setEditingActivity(null); }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-orange-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-colors shadow-lg"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Kegiatan
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        {editingActivity ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru'}
                    </h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Judul Kegiatan *</label>
                            <input
                                type="text"
                                name="title"
                                required
                                defaultValue={editingActivity?.title || ''}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Contoh: Rapat Koordinasi Pengawas Semester Ganjil"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                            <select
                                name="categoryId"
                                defaultValue={editingActivity?.category_id || ''}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="">Pilih Kategori</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Kegiatan</label>
                            <input
                                type="date"
                                name="activityDate"
                                defaultValue={editingActivity?.activity_date || new Date().toISOString().split('T')[0]}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                            <input
                                type="text"
                                name="location"
                                defaultValue={editingActivity?.location || ''}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="SDN 1 Bruno"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                name="status"
                                defaultValue={editingActivity?.status || 'published'}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="published">Dipublikasikan</option>
                                <option value="draft">Draft</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                            <textarea
                                name="description"
                                rows={3}
                                defaultValue={editingActivity?.description || ''}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Deskripsi kegiatan..."
                            />
                        </div>

                        <div className="md:col-span-2 flex items-center gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Menyimpan...' : editingActivity ? 'Update' : 'Simpan'}
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
                    onClick={() => setSelectedCategory('')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${!selectedCategory
                        ? 'bg-purple-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    Semua
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${selectedCategory === cat.id
                            ? 'bg-purple-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                    </button>
                ))}
            </div>

            {/* Activities List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="mt-2 text-sm text-gray-500">Memuat data...</p>
                    </div>
                ) : activities.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">📷</span>
                        </div>
                        <p className="text-gray-500">Belum ada kegiatan. Klik "Tambah Kegiatan" untuk memulai.</p>
                    </div>
                ) : (
                    activities.map((activity) => (
                        <div key={activity.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            {/* Activity Header */}
                            <div className="p-4 border-b border-gray-100">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${activity.status === 'published'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {activity.status === 'published' ? 'Publik' : 'Draft'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                            {activity.activity_categories && (
                                                <span>{activity.activity_categories.icon} {activity.activity_categories.name}</span>
                                            )}
                                            <span>📅 {new Date(activity.activity_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                            {activity.location && <span>📍 {activity.location}</span>}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(activity)}
                                            className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
                                            title="Edit"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(activity.id, activity.title)}
                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                            title="Hapus"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                {activity.description && (
                                    <p className="mt-2 text-sm text-gray-600">{activity.description}</p>
                                )}
                            </div>

                            {/* Photos Grid */}
                            <div className="p-4 bg-gray-50">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">
                                            📷 Foto ({activity.activity_photos?.length || 0})
                                        </p>
                                        <p className="text-xs text-gray-400">Maks. 5MB per foto (JPEG, PNG, GIF, WebP)</p>
                                    </div>
                                    <label className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${uploadingPhotos ? 'bg-purple-400 text-white cursor-wait' : 'bg-purple-600 text-white cursor-pointer hover:bg-purple-700'}`}>
                                        {uploadingPhotos ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Mengunggah...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                Upload Foto
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/jpeg,image/png,image/gif,image/webp"
                                            className="hidden"
                                            onChange={(e) => e.target.files && handlePhotoUpload(activity.id, e.target.files)}
                                            disabled={uploadingPhotos}
                                        />
                                    </label>
                                </div>

                                {activity.activity_photos && activity.activity_photos.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                        {activity.activity_photos.map((photo) => (
                                            <div key={photo.id} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-200">
                                                <Image
                                                    src={photo.photo_url}
                                                    alt={photo.caption || 'Activity photo'}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button
                                                        onClick={() => handleDeletePhoto(photo.id, photo.photo_url)}
                                                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                                        title="Hapus Foto"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400 text-center py-4">Belum ada foto. Klik "Upload Foto" untuk menambahkan.</p>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
