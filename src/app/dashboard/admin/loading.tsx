export default function AdminDashboardLoading() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="w-64 bg-white border-r border-gray-200 animate-pulse">
        <div className="p-6 border-b border-gray-100">
          <div className="h-6 w-32 bg-gray-200 rounded" />
        </div>
        <div className="p-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-8 bg-gray-100 rounded-lg" />)}
        </div>
      </div>
      <div className="flex-1 p-8 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-8" />
        <div className="grid grid-cols-4 gap-4 mb-10">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded-2xl" />)}
        </div>
        <div className="h-64 bg-gray-100 rounded-2xl mb-6" />
        <div className="h-48 bg-gray-100 rounded-2xl" />
      </div>
    </div>
  );
}
