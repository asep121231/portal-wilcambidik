export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizeClass = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    }[size]

    return (
        <div className="flex items-center justify-center">
            <div
                className={`${sizeClass} border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin`}
            />
        </div>
    )
}

export function PostCardSkeleton() {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <div className="skeleton h-6 w-24 rounded-full" />
                    <div className="skeleton h-4 w-32 rounded" />
                </div>
                <div className="skeleton h-6 w-full rounded" />
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="skeleton h-4 w-1/2 rounded" />
                <div className="skeleton h-4 w-28 rounded mt-2" />
            </div>
        </div>
    )
}

export function PostDetailSkeleton() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="skeleton h-8 w-24 rounded-full mb-4" />
            <div className="skeleton h-10 w-full rounded mb-2" />
            <div className="skeleton h-10 w-3/4 rounded mb-4" />
            <div className="skeleton h-4 w-48 rounded mb-8" />
            <div className="space-y-3">
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-4 w-5/6 rounded" />
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-4 w-4/5 rounded" />
            </div>
        </div>
    )
}

export function PageLoading() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-500">Memuat...</p>
            </div>
        </div>
    )
}
