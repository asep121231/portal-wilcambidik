export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8'
    }

    return (
        <div className={`${sizeClasses[size]} border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin`} />
    )
}

export function PostCardSkeleton() {
    return (
        <div className="card p-5 space-y-4 animate-pulse">
            {/* Badge skeleton */}
            <div className="flex gap-2">
                <div className="h-6 w-20 bg-gray-200 rounded-full skeleton" />
            </div>

            {/* Title skeleton */}
            <div className="space-y-2">
                <div className="h-5 bg-gray-200 rounded skeleton w-full" />
                <div className="h-5 bg-gray-200 rounded skeleton w-3/4" />
            </div>

            {/* Content skeleton */}
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded skeleton w-full" />
                <div className="h-4 bg-gray-200 rounded skeleton w-full" />
                <div className="h-4 bg-gray-200 rounded skeleton w-2/3" />
            </div>

            {/* Footer skeleton */}
            <div className="pt-3 border-t border-gray-100 flex justify-between">
                <div className="h-4 w-24 bg-gray-200 rounded skeleton" />
                <div className="h-4 w-20 bg-gray-200 rounded skeleton" />
            </div>
        </div>
    )
}

export function PostDetailSkeleton() {
    return (
        <div className="max-w-3xl mx-auto animate-pulse">
            {/* Header */}
            <div className="space-y-4 mb-8">
                <div className="h-6 w-24 bg-gray-200 rounded-full skeleton" />
                <div className="h-8 bg-gray-200 rounded skeleton w-full" />
                <div className="h-8 bg-gray-200 rounded skeleton w-3/4" />
                <div className="h-4 w-32 bg-gray-200 rounded skeleton" />
            </div>

            {/* Content */}
            <div className="space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded skeleton w-full" />
                ))}
                <div className="h-4 bg-gray-200 rounded skeleton w-2/3" />
            </div>
        </div>
    )
}

export function PageLoading() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-sm text-gray-500">Memuat...</p>
            </div>
        </div>
    )
}
