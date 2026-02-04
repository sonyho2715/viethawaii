import { ArticlesGridSkeleton, SidebarSkeleton } from '@/components/ui/skeleton';

export default function ArticlesLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="flex-1">
          {/* Header skeleton */}
          <div className="mb-6">
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Category tabs skeleton */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 w-24 bg-gray-200 rounded-full animate-pulse flex-shrink-0" />
            ))}
          </div>

          {/* Articles grid */}
          <ArticlesGridSkeleton count={6} />
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80">
          <SidebarSkeleton />
        </div>
      </div>
    </div>
  );
}
