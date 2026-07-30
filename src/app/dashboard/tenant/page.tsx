'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { formatDate, formatPrice } from '@/lib/utils';
import { getUser } from '@/lib/auth';
import api from '@/lib/api';
import { RentalRequest, Payment } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';
import { Home, CreditCard, ClipboardList, LogOut, Menu, X } from 'lucide-react';
import { clearAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function TenantDashboard() {
  const user = getUser();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: rentalsData, isLoading: rentalsLoading } = useQuery({
    queryKey: ['tenant-rentals'],
    queryFn: () => api.get('/rentals').then(r => r.data),
  });

  const { data: paymentsData, isLoading: paymentsLoading } = useQuery({
    queryKey: ['tenant-payments'],
    queryFn: () => api.get('/payments').then(r => r.data),
  });

  const rentals: RentalRequest[] = rentalsData?.data ?? [];
  const payments: Payment[] = paymentsData?.data ?? [];

  const handleLogout = () => {
    clearAuth();
    router.push('/');
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🏠</span>
          <span className="font-bold text-blue-600">RentNest</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        <p className="text-xs text-gray-400 uppercase tracking-wider px-3 mb-2">Tenant</p>
        <a href="#rentals" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
          <ClipboardList size={16} /> My Requests
        </a>
        <a href="#payments" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
          <CreditCard size={16} /> Payments
        </a>
        <Link href="/properties" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
          <Home size={16} /> Browse Properties
        </Link>
      </nav>
      <div className="p-4 border-t border-gray-100">
        <div className="mb-3 px-3">
          <p className="text-xs text-gray-500">{user?.email}</p>
          <p className="text-sm font-medium text-gray-800">{user?.name}</p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg w-full transition">
          <LogOut size={15} /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white flex flex-col shadow-xl z-50">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-gray-100 transition">
            <Menu size={20} />
          </button>
          <span className="font-semibold text-gray-900">Tenant Dashboard</span>
        </div>

        <div className="p-4 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Welcome, {user?.name} 👋</h1>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              { label: 'Total Requests', value: rentals.length },
              { label: 'Active Rentals', value: rentals.filter(r => r.status === 'ACTIVE').length },
              { label: 'Completed', value: rentals.filter(r => r.status === 'COMPLETED').length },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Rental Requests */}
          <section id="rentals" className="mb-10">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">My Rental Requests</h2>
            {rentalsLoading ? (
              <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}</div>
            ) : rentals.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                <p className="text-gray-400 mb-3">No rental requests yet.</p>
                <Link href="/properties" className="text-blue-600 text-sm font-medium hover:underline">Browse properties →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {rentals.map((r: RentalRequest) => (
                  <div key={r.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-gray-900">{r.property?.title}</p>
                      <p className="text-sm text-gray-500">{r.property?.location} · Move-in: {formatDate(r.moveInDate)}</p>
                      <p className="text-sm text-blue-600 font-medium mt-1">{formatPrice(r.property?.pricePerMonth)}/mo</p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <StatusBadge status={r.status} />
                      {r.status === 'APPROVED' && (
                        <Link
                          href={`/dashboard/tenant/requests/${r.id}/pay`}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition"
                        >
                          Pay Now
                        </Link>
                      )}
                      {r.status === 'ACTIVE' && (
                        <Link
                          href={`/dashboard/tenant/reviews/new?propertyId=${r.propertyId}`}
                          className="bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition"
                        >
                          Leave Review
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Payments */}
          <section id="payments">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h2>
            {paymentsLoading ? (
              <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
            ) : payments.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 text-sm">No payments yet.</div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[480px]">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                      <tr>
                        <th className="text-left px-5 py-3">Property</th>
                        <th className="text-left px-5 py-3">Amount</th>
                        <th className="text-left px-5 py-3">Status</th>
                        <th className="text-left px-5 py-3">Paid At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {payments.map((p: Payment) => (
                        <tr key={p.id} className="hover:bg-gray-50 transition">
                          <td className="px-5 py-4 font-medium text-gray-800">{p.rentalRequest?.property?.title ?? '—'}</td>
                          <td className="px-5 py-4 text-blue-600 font-semibold">{formatPrice(p.amount)}</td>
                          <td className="px-5 py-4"><StatusBadge status={p.status} /></td>
                          <td className="px-5 py-4 text-gray-500">{p.paidAt ? formatDate(p.paidAt) : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
