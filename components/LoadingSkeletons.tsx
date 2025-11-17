export function BusinessCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-6 space-y-3">
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="flex gap-2 mt-4">
          <div className="h-8 bg-gray-200 rounded w-20" />
          <div className="h-8 bg-gray-200 rounded w-20" />
        </div>
      </div>
    </div>
  );
}

export function BusinessDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>

          {/* Image */}
          <div className="h-96 bg-gray-200 rounded-lg" />

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>

          {/* Features */}
          <div className="flex gap-2 flex-wrap">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded-full w-24" />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/2" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReviewSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-5 bg-gray-200 rounded w-32" />
            <div className="h-4 bg-gray-200 rounded w-24" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-20" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {[...Array(columns)].map((_, i) => (
            <div key={i} className="h-5 bg-gray-200 rounded" />
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-200">
        {[...Array(rows)].map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {[...Array(columns)].map((_, colIndex) => (
                <div key={colIndex} className="h-4 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3" />

      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-10 bg-gray-200 rounded w-full" />
        </div>
      ))}

      <div className="flex gap-4 pt-4">
        <div className="h-10 bg-gray-200 rounded w-32" />
        <div className="h-10 bg-gray-200 rounded w-32" />
      </div>
    </div>
  );
}

export function GridSkeleton({ items = 6 }: { items?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(items)].map((_, i) => (
        <BusinessCardSkeleton key={i} />
      ))}
    </div>
  );
}
