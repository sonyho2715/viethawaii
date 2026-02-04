import { EventsListSkeleton, SidebarSkeleton } from '@/components/ui/skeleton';

export default function EventsLoading() {
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

          {/* Month navigation skeleton */}
          <div className="flex items-center justify-between mb-6">
            <div className="h-10 w-10 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-10 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Events list */}
          <EventsListSkeleton count={5} />
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80">
          <SidebarSkeleton />
        </div>
      </div>
    </div>
  );
}
