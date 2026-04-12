export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page title skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-48 bg-muted rounded-lg" />
        <div className="h-4 w-72 bg-muted rounded" />
      </div>

      {/* Stats row skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-muted rounded-xl" />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 h-64 bg-muted rounded-xl" />
        <div className="h-64 bg-muted rounded-xl" />
      </div>

      {/* Table skeleton */}
      <div className="bg-muted rounded-xl h-48" />
    </div>
  );
}
