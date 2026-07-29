import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <span className="text-white font-bold text-lg">RentNest</span>
          </div>
          <p className="text-sm">Find &amp; List Rental Properties with Ease</p>
          <div className="flex gap-4 text-sm">
            <Link href="/properties" className="hover:text-white transition">Properties</Link>
            <Link href="/auth/login" className="hover:text-white transition">Login</Link>
            <Link href="/auth/register" className="hover:text-white transition">Register</Link>
          </div>
        </div>
        <p className="text-center text-xs mt-6">© {new Date().getFullYear()} RentNest. All rights reserved.</p>
      </div>
    </footer>
  );
}
