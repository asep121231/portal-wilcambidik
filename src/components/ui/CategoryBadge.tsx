interface CategoryBadgeProps {
    name: string
    size?: 'sm' | 'md'
}

const categoryColors: Record<string, string> = {
    'Surat Edaran': 'bg-blue-100 text-blue-700 border-blue-200',
    'Undangan': 'bg-purple-100 text-purple-700 border-purple-200',
    'Pengumuman': 'bg-amber-100 text-amber-700 border-amber-200',
    'Laporan': 'bg-green-100 text-green-700 border-green-200',
    'Informasi Umum': 'bg-gray-100 text-gray-700 border-gray-200',
}

export default function CategoryBadge({ name, size = 'sm' }: CategoryBadgeProps) {
    const colorClass = categoryColors[name] || 'bg-gray-100 text-gray-700 border-gray-200'
    const sizeClass = size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5'

    return (
        <span className={`inline-flex items-center rounded-full border font-medium ${colorClass} ${sizeClass}`}>
            {name}
        </span>
    )
}
