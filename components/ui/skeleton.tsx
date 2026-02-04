import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200',
        className
      )}
    />
  );
}

/**
 * Skeleton for listing cards
 */
export function ListingCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Image placeholder */}
      <Skeleton className="w-full h-48" />

      <div className="p-4 space-y-3">
        {/* Title */}
        <Skeleton className="h-5 w-3/4" />

        {/* Price */}
        <Skeleton className="h-6 w-1/3" />

        {/* Location */}
        <Skeleton className="h-4 w-1/2" />

        {/* Meta info */}
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for article cards
 */
export function ArticleCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Image placeholder */}
      <Skeleton className="w-full h-40" />

      <div className="p-4 space-y-3">
        {/* Category badge */}
        <Skeleton className="h-5 w-20" />

        {/* Title */}
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-2/3" />

        {/* Excerpt */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />

        {/* Meta */}
        <div className="flex justify-between pt-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for event cards
 */
export function EventCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex">
      {/* Date box */}
      <div className="w-20 flex-shrink-0 p-4 bg-gray-50">
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-8 w-full" />
      </div>

      <div className="p-4 flex-1 space-y-2">
        {/* Title */}
        <Skeleton className="h-5 w-3/4" />

        {/* Location */}
        <Skeleton className="h-4 w-1/2" />

        {/* Time */}
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}

/**
 * Skeleton for table rows
 */
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

/**
 * Grid of listing skeletons
 */
export function ListingsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Grid of article skeletons
 */
export function ArticlesGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * List of event skeletons
 */
export function EventsListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton for detail page header
 */
export function DetailHeaderSkeleton() {
  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <Skeleton className="h-4 w-48" />

      {/* Title */}
      <Skeleton className="h-8 w-3/4" />

      {/* Meta */}
      <div className="flex gap-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-24" />
      </div>

      {/* Image */}
      <Skeleton className="w-full h-96 rounded-lg" />
    </div>
  );
}

/**
 * Skeleton for sidebar
 */
export function SidebarSkeleton() {
  return (
    <div className="space-y-6">
      {/* Widget 1 */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <Skeleton className="h-5 w-32 mb-4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>

      {/* Widget 2 */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <Skeleton className="h-5 w-32 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="w-16 h-16 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
