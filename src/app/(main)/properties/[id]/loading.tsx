export default function PropertyDetailLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-pulse">
      <div className="h-80 bg-gray-200 rounded-2xl mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <div className="h-5 w-20 bg-gray-200 rounded-full" />
          <div className="h-8 w-3/4 bg-gray-200 rounded" />
          <div className="h-4 w-1/2 bg-gray-200 rounded" />
          <div className="h-24 bg-gray-100 rounded-xl" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-7 w-16 bg-gray-200 rounded-full" />)}
          </div>
        </div>
        <div className="md:col-span-1">
          <div className="h-64 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
