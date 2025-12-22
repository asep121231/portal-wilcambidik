export default function PostCardSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden animate-pulse">
            {/* Image skeleton */}
            <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />

            {/* Content skeleton */}
            <div className="p-5">
                {/* Category badge skeleton */}
                <div className="w-24 h-5 bg-gray-200 dark:bg-gray-700 rounded-full mb-3" />

                {/* Title skeleton */}
                <div className="space-y-2 mb-3">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                </div>

                {/* Description skeleton */}
                <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-full" />
                    <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-5/6" />
                </div>

                {/* Footer skeleton */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
            </div>
        </div>
    )
}
