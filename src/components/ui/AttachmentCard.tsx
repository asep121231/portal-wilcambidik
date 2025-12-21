'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Attachment {
    id: string
    file_url: string
    file_name: string
    file_type: string
}

interface AttachmentCardProps {
    attachment: Attachment
}

type FileCategory = 'pdf' | 'image' | 'word' | 'excel' | 'other'

function getFileCategory(fileType: string, fileName: string): FileCategory {
    const type = fileType.toLowerCase()
    const name = fileName.toLowerCase()

    if (type.includes('pdf') || name.endsWith('.pdf')) {
        return 'pdf'
    }
    if (type.includes('image') || /\.(jpg|jpeg|png|gif|webp)$/.test(name)) {
        return 'image'
    }
    if (type.includes('word') || type.includes('document') || /\.(doc|docx)$/.test(name)) {
        return 'word'
    }
    if (type.includes('excel') || type.includes('sheet') || /\.(xls|xlsx)$/.test(name)) {
        return 'excel'
    }
    return 'other'
}

function getFileExtension(fileName: string): string {
    const parts = fileName.split('.')
    return parts.length > 1 ? parts.pop()?.toUpperCase() || '' : ''
}

function FileIcon({ category, className = '' }: { category: FileCategory; className?: string }) {
    const iconClass = `${className}`

    switch (category) {
        case 'pdf':
            return (
                <div className={`${iconClass} text-red-500`}>
                    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zm-3 9.5c0 .83-.67 1.5-1.5 1.5H7v2H5.5v-6H9c.83 0 1.5.67 1.5 1.5v1zm5 3c0 .83-.67 1.5-1.5 1.5h-2.5v-6H14c.83 0 1.5.67 1.5 1.5v3zm4-3c0 .28-.22.5-.5.5H17v1h1.5v1H17v2h-1.5v-6h3c.28 0 .5.22.5.5v1z" />
                    </svg>
                </div>
            )
        case 'word':
            return (
                <div className={`${iconClass} text-blue-600`}>
                    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM7 17h2l1.5-5 1.5 5h2l2-8h-2l-1 4.5L11.5 9h-1l-1.5 4.5-1-4.5H6l2 8z" />
                    </svg>
                </div>
            )
        case 'excel':
            return (
                <div className={`${iconClass} text-green-600`}>
                    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM7 17l2.5-3.5L7 10h2l1.5 2 1.5-2h2l-2.5 3.5L14 17h-2l-1.5-2-1.5 2H7z" />
                    </svg>
                </div>
            )
        case 'image':
            return (
                <div className={`${iconClass} text-purple-500`}>
                    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                    </svg>
                </div>
            )
        default:
            return (
                <div className={`${iconClass} text-gray-500`}>
                    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4z" />
                    </svg>
                </div>
            )
    }
}

function ImagePreview({ src, alt }: { src: string; alt: string }) {
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)

    if (hasError) {
        return (
            <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-t-lg">
                <FileIcon category="image" className="w-16 h-16" />
            </div>
        )
    }

    return (
        <div className="relative w-full h-48 bg-gray-100 rounded-t-lg overflow-hidden">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                </div>
            )}
            <Image
                src={src}
                alt={alt}
                fill
                className={`object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setIsLoading(false)}
                onError={() => setHasError(true)}
                unoptimized
            />
        </div>
    )
}

function PDFPreview({ src, title }: { src: string; title: string }) {
    const [hasError, setHasError] = useState(false)

    if (hasError) {
        return (
            <div className="w-full h-48 bg-gray-100 flex flex-col items-center justify-center rounded-t-lg gap-2">
                <FileIcon category="pdf" className="w-16 h-16" />
                <span className="text-sm text-gray-500">Preview tidak tersedia</span>
            </div>
        )
    }

    return (
        <div className="w-full h-48 bg-gray-100 rounded-t-lg overflow-hidden">
            <iframe
                src={`${src}#toolbar=0&navpanes=0&scrollbar=0`}
                title={title}
                className="w-full h-full border-0"
                sandbox="allow-same-origin"
                loading="lazy"
                onError={() => setHasError(true)}
            />
        </div>
    )
}

function DocumentPreview({ category, extension }: { category: FileCategory; extension: string }) {
    return (
        <div className="w-full h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center rounded-t-lg gap-2">
            <FileIcon category={category} className="w-16 h-16" />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {extension}
            </span>
        </div>
    )
}

export default function AttachmentCard({ attachment }: AttachmentCardProps) {
    const category = getFileCategory(attachment.file_type, attachment.file_name)
    const extension = getFileExtension(attachment.file_name)

    const renderPreview = () => {
        switch (category) {
            case 'image':
                return <ImagePreview src={attachment.file_url} alt={attachment.file_name} />
            case 'pdf':
                return <PDFPreview src={attachment.file_url} title={attachment.file_name} />
            default:
                return <DocumentPreview category={category} extension={extension} />
        }
    }

    return (
        <div className="group bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:border-primary-300 transition-all duration-200">
            {/* Preview Section */}
            {renderPreview()}

            {/* Info Section */}
            <div className="p-4">
                <div className="flex items-start gap-3">
                    <FileIcon category={category} className="w-8 h-8 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate text-sm" title={attachment.file_name}>
                            {attachment.file_name}
                        </p>
                        <p className="text-xs text-gray-500 uppercase mt-1">
                            {extension} File
                        </p>
                    </div>
                </div>

                {/* Download Button */}
                <a
                    href={attachment.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={attachment.file_name}
                    className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium group-hover:bg-primary-100"
                    aria-label={`Unduh ${attachment.file_name}`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Unduh
                </a>
            </div>
        </div>
    )
}
