'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle, XCircle, LogOut, Home, ClipboardList, Menu } from 'lucide-react';
import { useState } from 'react';
import api from '@/lib/api';
import { clearAuth, getUser } from '@/lib/auth';
import { formatDate, formatPrice } from '@/lib/utils';
import { RentalRequest } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';

export default function LandlordRequestsPage() {
  const user = getUser();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['landlord-requests'],
    queryFn: () => api.get('/landlord/requests').then(r => r.data),
  });

  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/landlord/requests/${id}`, { status }),
    onSuccess: (_, vars) => {
      toast.success(`Request ${vars.status === 'APPROVED' ? 'approved' : 'rejected'}`);
      queryClient.invalidateQueries({ queryKey: ['landlord-requests'] });
    },
    onError: () => toast.error('Failed to update request'),
  });

  const requests: RentalRequest[] = data?.data ?? [];
  const pending = requests.filter(r => r.status === 'PENDING');
  const others = requests.filter(r => r.status !== 'PENDING');

  const handleLogout = () => { clearAuth(); router.push('/'); };

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🏠</span>
          <span className="font-bold text-blue-600">RentNest</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        <p className="text-xs text-gray-400 uppercase tracking-wider px-3 mb-2">Landlord</p>
        <Link href="/dashboard/landlord" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
          <Home size={16} /> My Properties
        </Link>
        <Link href="/dashboard/landlord/requests" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm bg-blue-50 text-blue-600 font-medium">
          <ClipboardList size={16} /> Requests
          {pending.length > 0 && <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{pending.length}</span>}
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
          <span className="font-semibold text-gray-900">Rental Requests</span>
        </div>

        <div className="p-4 sm:p-8">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard/landlord" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Rental Requests</h1>
          </div>

          {isLoading ? (
            <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />)}</div>
          ) : requests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-14 text-center">
              <p className="text-5xl mb-3">📋</p>
              <p className="text-gray-400">No rental requests yet.</p>
            </div>
          ) : (
            <>
              {pending.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-sm font-semibold text-yellow-700 bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-lg inline-flex items-center gap-2 mb-4">
                    ⏳ Pending Requests ({pending.length})
                  </h2>
                  <div className="space-y-3">
                    {pending.map((r: RentalRequest) => (
                      <div key={r.id} className="bg-white border border-yellow-100 rounded-2xl p-5 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold text-gray-900">{r.property?.title}</p>
                            <p className="text-sm text-gray-500 mt-0.5">{r.property?.location}</p>
                            <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                              <span>Tenant: <span className="font-medium">{r.tenant?.name ?? 'Unknown'}</span></span>
                              <span>Move-in: <span className="font-medium">{formatDate(r.moveInDate)}</span></span>
                              <span className="text-blue-600 font-semibold">{formatPrice(r.property?.pricePerMonth)}/mo</span>
                            </div>
                            {r.message && <p className="text-sm text-gray-500 mt-2 italic">"{r.message}"</p>}
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => updateStatus({ id: r.id, status: 'APPROVED' })}
                              disabled={isPending}
                              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                            >
                              <CheckCircle size={15} /> Approve
                            </button>
                            <button
                              onClick={() => updateStatus({ id: r.id, status: 'REJECTED' })}
                              disabled={isPending}
                              className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                            >
                              <XCircle size={15} /> Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {others.length > 0 && (
                <section>
                  <h2 className="text-sm font-semibold text-gray-500 mb-4">Previous Requests</h2>
                  <div className="space-y-3">
                    {others.map((r: RentalRequest) => (
                      <div key={r.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="font-medium text-gray-900">{r.property?.title}</p>
                          <p className="text-sm text-gray-500">
                            Tenant: {r.tenant?.name ?? 'Unknown'} · Move-in: {formatDate(r.moveInDate)}
                          </p>
                          <p className="text-sm text-blue-600 font-medium mt-1">{formatPrice(r.property?.pricePerMonth)}/mo</p>
                        </div>
                        <StatusBadge status={r.status} />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
