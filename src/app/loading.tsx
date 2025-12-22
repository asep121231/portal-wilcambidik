import { PostCardSkeleton } from '@/components/ui/Loading'

export default function Loading() {
    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section Skeleton */}
            <section className="py-16 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
                    {/* Title Skeleton */}
                    <div className="h-12 md:h-16 w-3/4 max-w-lg mx-auto bg-gray-200 rounded-lg mb-6 animate-pulse" />

                    {/* Subtitle Skeleton */}
                    <div className="h-6 w-full max-w-xl mx-auto bg-gray-100 rounded mb-2 animate-pulse" />
                    <div className="h-6 w-2/3 max-w-md mx-auto bg-gray-100 rounded mb-8 animate-pulse" />

                    {/* Stats Skeleton */}
                    <div className="flex justify-center gap-8 md:gap-16 mb-10">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="text-center">
                                <div className="h-10 w-16 bg-gray-200 rounded mx-auto mb-1 animate-pulse" />
                                <div className="h-4 w-14 bg-gray-100 rounded mx-auto animate-pulse" />
                            </div>
                        ))}
                    </div>

                    {/* Search Box Skeleton */}
                    <div className="max-w-2xl mx-auto">
                        <div className="h-14 bg-gray-200 rounded-full animate-pulse" />
                    </div>
                </div>
            </section>

            {/* Content Section Skeleton */}
            <section className="py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    {/* Section Title */}
                    <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-10 animate-pulse" />

                    {/* Category Filters Skeleton */}
                    <div className="flex flex-wrap justify-center gap-2 mb-10">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-10 w-24 bg-gray-200 rounded-full animate-pulse" />
                        ))}
                    </div>

                    {/* Posts Grid Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <PostCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
