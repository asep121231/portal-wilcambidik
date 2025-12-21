export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-6 h-6 border-2',
        lg: 'w-8 h-8 border-3',
    }

    return (
        <div className={`${sizeClasses[size]} border-purple-600 border-t-transparent rounded-full animate-spin`} />
    )
}

export function PostCardSkeleton() {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden animate-pulse">
            {/* Thumbnail Skeleton */}
            <div className="h-40 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer" />

            {/* Content */}
            <div className="p-5">
                <div className="flex gap-2 mb-3">
                    <div className="h-6 w-20 bg-gray-200 rounded-full" />
                    <div className="h-6 w-16 bg-gray-200 rounded-full" />
                </div>
                <div className="h-5 w-full bg-gray-200 rounded mb-2" />
                <div className="h-5 w-3/4 bg-gray-200 rounded mb-4" />
                <div className="h-4 w-full bg-gray-100 rounded mb-1" />
                <div className="h-4 w-2/3 bg-gray-100 rounded mb-4" />
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                </div>
            </div>
        </div>
    )
}

export function PostDetailSkeleton() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 animate-pulse">
                <div className="flex gap-2 mb-4">
                    <div className="h-5 w-20 bg-gray-200 rounded" />
                </div>
                <div className="h-8 w-full bg-gray-200 rounded mb-2" />
                <div className="h-8 w-3/4 bg-gray-200 rounded mb-4" />
                <div className="h-4 w-32 bg-gray-100 rounded mb-8" />
                <div className="space-y-3">
                    <div className="h-4 w-full bg-gray-100 rounded" />
                    <div className="h-4 w-full bg-gray-100 rounded" />
                    <div className="h-4 w-5/6 bg-gray-100 rounded" />
                    <div className="h-4 w-full bg-gray-100 rounded" />
                    <div className="h-4 w-2/3 bg-gray-100 rounded" />
                </div>
            </div>
        </div>
    )
}

export function PageLoading() {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="mt-3 text-sm text-gray-500">Memuat...</p>
            </div>
        </div>
    )
}
