export function Skeleton({ className, ...props }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200/60 ${className}`}
      {...props}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      {/* 4 Cards Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <section key={i} className="card p-5 space-y-4">
            <div>
              <Skeleton className="h-3 w-20 mb-3" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-3 w-16 mt-2" />
            </div>
            <div className="space-y-3">
              {[...Array(4)].map((_, j) => (
                <div key={j}>
                  <div className="flex justify-between mb-1">
                    <Skeleton className="h-2 w-16" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-1.5 flex-1 rounded-full" />
                    <Skeleton className="h-2 w-8" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Bar Chart Skeleton */}
      <section className="card p-5">
        <div className="mb-5">
          <Skeleton className="h-3 w-32 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Skeleton className="h-72 w-full rounded-xl" />
      </section>

      {/* Confusion Matrix Skeleton */}
      <section className="card p-8">
        <div className="flex justify-center mb-8">
          <Skeleton className="h-5 w-80" />
        </div>
        <div className="grid sm:grid-cols-2 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <Skeleton className="h-4 w-32 mb-6" />
              <Skeleton className="h-64 w-64 rounded-xl" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function HistorySkeleton() {
  return (
    <div className="card overflow-hidden">
      {/* Toolbar / Header */}
      <div className="flex items-center justify-between border-b border-slate-100 p-5 bg-slate-50/50">
        <Skeleton className="h-9 w-48 rounded-lg" />
        <Skeleton className="h-9 w-64 rounded-xl" />
      </div>

      {/* Table headers */}
      <div className="grid grid-cols-6 gap-4 p-4 border-b border-slate-100">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-4 w-full max-w-[80px]" />
        ))}
      </div>

      {/* Table rows */}
      <div className="divide-y divide-slate-100">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="grid grid-cols-6 gap-4 p-4 items-center">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <div className="flex gap-2">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-8" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between border-t border-slate-100 p-4">
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
