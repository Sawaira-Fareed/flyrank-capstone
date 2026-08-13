export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6">
      <div className="h-8 bg-white/20 rounded w-48 mb-6 animate-pulse" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-white/15 rounded-2xl animate-pulse" />
        ))}
      </div>
      <div className="h-64 bg-white/15 rounded-2xl animate-pulse" />
    </div>
  );
}