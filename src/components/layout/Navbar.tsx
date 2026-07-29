'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { clearAuth, getUser } from '@/lib/auth';
import { AuthUser } from '@/types';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    router.push('/');
  };

  const dashboardLink =
    user?.role === 'ADMIN' ? '/dashboard/admin'
    : user?.role === 'LANDLORD' ? '/dashboard/landlord'
    : '/dashboard/tenant';

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <span className="text-xl font-bold text-blue-600">RentNest</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/properties" className="text-sm text-gray-600 hover:text-blue-600 transition">
              Browse Properties
            </Link>
            {user && (
              <Link href={dashboardLink} className="text-sm text-gray-600 hover:text-blue-600 transition">
                Dashboard
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 text-sm font-medium transition"
                >
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                    {user.name[0].toUpperCase()}
                  </span>
                  {user.name.split(' ')[0]}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-10">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500">{user.role}</p>
                      <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                    </div>
                    <Link href={dashboardLink} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                      Dashboard
                    </Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm text-gray-600 hover:text-blue-600 font-medium transition">
                  Login
                </Link>
                <Link href="/auth/register" className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <span className="block w-5 h-0.5 bg-gray-600 mb-1"></span>
            <span className="block w-5 h-0.5 bg-gray-600 mb-1"></span>
            <span className="block w-5 h-0.5 bg-gray-600"></span>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
            <Link href="/properties" className="block px-4 py-2 text-sm text-gray-600" onClick={() => setMenuOpen(false)}>Browse Properties</Link>
            {user ? (
              <>
                <Link href={dashboardLink} className="block px-4 py-2 text-sm text-gray-600" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600">Logout</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block px-4 py-2 text-sm text-gray-600" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link href="/auth/register" className="block px-4 py-2 text-sm text-blue-600 font-medium" onClick={() => setMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
