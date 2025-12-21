interface CategoryBadgeProps {
    name: string
    size?: 'sm' | 'md'
}

export default function CategoryBadge({ name, size = 'md' }: CategoryBadgeProps) {
    // Color mapping based on category name
    const getColors = (categoryName: string) => {
        const lowerName = categoryName.toLowerCase()

        if (lowerName.includes('surat') || lowerName.includes('edaran')) {
            return 'bg-blue-100 text-blue-800'
        }
        if (lowerName.includes('undangan')) {
            return 'bg-purple-100 text-purple-800'
        }
        if (lowerName.includes('pengumuman')) {
            return 'bg-amber-100 text-amber-800'
        }
        if (lowerName.includes('laporan')) {
            return 'bg-green-100 text-green-800'
        }
        if (lowerName.includes('informasi')) {
            return 'bg-cyan-100 text-cyan-800'
        }
        return 'bg-gray-100 text-gray-800'
    }

    const sizeClasses = size === 'sm'
        ? 'px-2.5 py-1 text-xs'
        : 'px-3 py-1.5 text-sm'

    return (
        <span
            className={`inline-flex items-center font-medium rounded-full ${getColors(name)} ${sizeClasses}`}
        >
            {name}
        </span>
    )
}
