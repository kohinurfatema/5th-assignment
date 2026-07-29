import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-bold text-gray-200">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-8">The page you are looking for does not exist.</p>
        <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition">
          Go Home
        </Link>
      </div>
    </div>
  );
}
