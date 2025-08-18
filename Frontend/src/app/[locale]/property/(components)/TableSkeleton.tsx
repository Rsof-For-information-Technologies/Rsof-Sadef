// Table Skeleton Loading Component
export default function TableSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-50 rounded-lg border border-gray-200 dark:border-gray-200 p-6">
            <div className="border-b border-gray-200 dark:border-gray-200 pb-4 mb-4">
                <div className="grid grid-cols-12 gap-4">
                    <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>
            </div>

            {[...Array(5)].map((_, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 py-4 border-b border-gray-100 dark:border-gray-200">
                    <div className="h-4 bg-gray-100 rounded w-8 animate-pulse"></div>
                    <div className="h-4 bg-gray-100 rounded w-32 animate-pulse"></div>
                    <div className="h-4 bg-gray-100 rounded w-16 animate-pulse"></div>
                    <div className="h-4 bg-gray-100 rounded w-12 animate-pulse"></div>
                    <div className="h-4 bg-gray-100 rounded w-24 animate-pulse"></div>
                    <div className="h-4 bg-gray-100 rounded w-16 animate-pulse"></div>
                    <div className="h-4 bg-gray-100 rounded w-8 animate-pulse"></div>
                    <div className="h-4 bg-gray-100 rounded w-20 animate-pulse"></div>
                    <div className="h-4 bg-gray-100 rounded w-24 animate-pulse"></div>
                    <div className="h-4 bg-gray-100 rounded w-16 animate-pulse"></div>
                    <div className="h-4 bg-gray-100 rounded w-20 animate-pulse"></div>
                    <div className="h-4 bg-gray-100 rounded w-24 animate-pulse"></div>
                </div>
            ))}
        </div>
    );
}
