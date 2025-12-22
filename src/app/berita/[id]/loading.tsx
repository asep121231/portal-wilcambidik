export default function Loading() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50/50 to-gray-50">
            {/* Hero Header Skeleton */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 pt-8 pb-24">
                <div className="max-w-4xl mx-auto px-4 lg:px-8">
                    {/* Back Button Skeleton */}
                    <div className="h-6 w-40 bg-white/20 rounded mb-8 animate-pulse" />

                    {/* Badges Skeleton */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-8 w-24 bg-white/20 rounded-full animate-pulse" />
                        <div className="h-8 w-20 bg-white/20 rounded-full animate-pulse" />
                    </div>

                    {/* Title Skeleton */}
                    <div className="h-10 w-full bg-white/30 rounded mb-2 animate-pulse" />
                    <div className="h-10 w-3/4 bg-white/30 rounded mb-4 animate-pulse" />

                    {/* Meta Info Skeleton */}
                    <div className="flex items-center gap-4">
                        <div className="h-5 w-32 bg-white/20 rounded animate-pulse" />
                        <div className="h-5 w-24 bg-white/20 rounded animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Content Card Skeleton */}
            <div className="max-w-4xl mx-auto px-4 lg:px-8 -mt-16 pb-16">
                <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden">
                    <div className="p-6 md:p-10 animate-pulse">
                        {/* Content Lines */}
                        <div className="space-y-4">
                            <div className="h-4 w-full bg-gray-200 rounded" />
                            <div className="h-4 w-full bg-gray-200 rounded" />
                            <div className="h-4 w-5/6 bg-gray-200 rounded" />
                            <div className="h-4 w-full bg-gray-200 rounded" />
                            <div className="h-4 w-3/4 bg-gray-200 rounded" />
                            <div className="h-4 w-full bg-gray-200 rounded" />
                            <div className="h-4 w-2/3 bg-gray-200 rounded" />
                        </div>

                        {/* Spacer */}
                        <div className="my-8" />

                        {/* More Content */}
                        <div className="space-y-4">
                            <div className="h-4 w-full bg-gray-100 rounded" />
                            <div className="h-4 w-full bg-gray-100 rounded" />
                            <div className="h-4 w-4/5 bg-gray-100 rounded" />
                        </div>
                    </div>

                    {/* Attachments Skeleton */}
                    <div className="border-t border-gray-100 bg-gray-50/50 p-6 md:p-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse" />
                            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl">
                                    <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse" />
                                    <div className="flex-1">
                                        <div className="h-4 w-3/4 bg-gray-200 rounded mb-2 animate-pulse" />
                                        <div className="h-3 w-1/2 bg-gray-100 rounded animate-pulse" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Share Section Skeleton */}
                <div className="mt-8 flex items-center justify-center gap-3">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                    <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
                    <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
                    <div className="h-10 w-24 bg-gray-200 rounded-full animate-pulse" />
                </div>

                {/* Related Posts Skeleton */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse" />
                        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                                <div className="h-24 bg-gray-200 animate-pulse" />
                                <div className="p-4">
                                    <div className="h-5 w-16 bg-gray-200 rounded-full mb-2 animate-pulse" />
                                    <div className="h-4 w-full bg-gray-200 rounded mb-1 animate-pulse" />
                                    <div className="h-4 w-2/3 bg-gray-200 rounded mb-2 animate-pulse" />
                                    <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
