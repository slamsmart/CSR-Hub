export default function PublicLoading() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Hero skeleton */}
      <div className="h-64 bg-muted" />

      {/* Content skeleton */}
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
        <div className="h-8 w-64 bg-muted rounded-lg mx-auto" />
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
