'use client'

import { useEffect, useState } from 'react'

interface UploadProgressProps {
    isUploading: boolean
    progress?: number // 0-100, optional for indeterminate
    fileName?: string
    onCancel?: () => void
}

export default function UploadProgress({ isUploading, progress, fileName, onCancel }: UploadProgressProps) {
    const [dots, setDots] = useState('')

    useEffect(() => {
        if (!isUploading) return
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.')
        }, 400)
        return () => clearInterval(interval)
    }, [isUploading])

    if (!isUploading) return null

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-orange-500 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">Mengunggah File{dots}</h3>
                        {fileName && (
                            <p className="text-xs text-gray-500 truncate max-w-[200px]">{fileName}</p>
                        )}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
                    {progress !== undefined ? (
                        <div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-600 to-orange-500 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    ) : (
                        <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-purple-600 to-orange-500 rounded-full animate-progress-indeterminate" />
                    )}
                </div>

                {/* Progress Text */}
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                        {progress !== undefined ? `${Math.round(progress)}%` : 'Mohon tunggu...'}
                    </span>
                    {onCancel && (
                        <button
                            onClick={onCancel}
                            className="text-red-500 hover:text-red-700 font-medium"
                        >
                            Batalkan
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

// Inline upload indicator for use inside forms
export function UploadIndicator({
    isUploading,
    currentFile,
    totalFiles,
    currentIndex
}: {
    isUploading: boolean
    currentFile?: string
    totalFiles?: number
    currentIndex?: number
}) {
    if (!isUploading) return null

    return (
        <div className="flex items-center gap-3 p-4 bg-purple-50 border border-purple-200 rounded-xl animate-pulse">
            <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-purple-700">
                    {totalFiles && currentIndex !== undefined
                        ? `Mengunggah file ${currentIndex + 1} dari ${totalFiles}...`
                        : 'Mengunggah file...'}
                </p>
                {currentFile && (
                    <p className="text-xs text-purple-600 truncate">{currentFile}</p>
                )}
            </div>
        </div>
    )
}
