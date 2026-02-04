import { ListingsGridSkeleton, SidebarSkeleton } from '@/components/ui/skeleton';

export default function ListingsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="flex-1">
          {/* Header skeleton */}
          <div className="mb-6">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Filters skeleton */}
          <div className="flex gap-4 mb-6">
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 flex-1 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Listings grid */}
          <ListingsGridSkeleton count={9} />

          {/* Pagination skeleton */}
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 w-10 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80">
          <SidebarSkeleton />
        </div>
      </div>
    </div>
  );
}
