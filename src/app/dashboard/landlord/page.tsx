'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Home, ClipboardList, LogOut } from 'lucide-react';
import api from '@/lib/api';
import { clearAuth, getUser } from '@/lib/auth';
import { formatPrice, formatDate } from '@/lib/utils';
import { Property } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';

export default function LandlordDashboard() {
  const user = getUser();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: propertiesData, isLoading } = useQuery({
    queryKey: ['landlord-properties'],
    queryFn: () => api.get('/landlord/properties').then(r => r.data),
  });

  const { data: requestsData } = useQuery({
    queryKey: ['landlord-requests'],
    queryFn: () => api.get('/landlord/requests').then(r => r.data),
  });

  const { mutate: deleteProperty } = useMutation({
    mutationFn: (id: string) => api.delete(`/landlord/properties/${id}`),
    onSuccess: () => {
      toast.success('Property deleted');
      queryClient.invalidateQueries({ queryKey: ['landlord-properties'] });
    },
    onError: () => toast.error('Failed to delete property'),
  });

  const properties: Property[] = (propertiesData?.data as any)?.data ?? propertiesData?.data ?? [];
  const requests = requestsData?.data ?? [];
  const pendingCount = requests.filter((r: any) => r.status === 'PENDING').length;

  const handleLogout = () => { clearAuth(); router.push('/'); };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <span className="font-bold text-blue-600">RentNest</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <p className="text-xs text-gray-400 uppercase tracking-wider px-3 mb-2">Landlord</p>
          <a href="#properties" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
            <Home size={16} /> My Properties
          </a>
          <Link href="/dashboard/landlord/requests" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
            <ClipboardList size={16} /> Requests
            {pendingCount > 0 && <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{pendingCount}</span>}
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
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name} 👋</h1>
          <Link
            href="/dashboard/landlord/properties/new"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition"
          >
            <Plus size={16} /> Add Property
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total Properties', value: properties.length },
            { label: 'Pending Requests', value: pendingCount },
            { label: 'Active Rentals', value: requests.filter((r: any) => r.status === 'ACTIVE').length },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Properties */}
        <section id="properties">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">My Properties</h2>
          {isLoading ? (
            <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}</div>
          ) : properties.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
              <p className="text-gray-400 mb-3">No properties listed yet.</p>
              <Link href="/dashboard/landlord/properties/new" className="text-blue-600 text-sm font-medium hover:underline">Add your first property →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {properties.map((p: Property) => (
                <div key={p.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-gray-900">{p.title}</p>
                    <p className="text-sm text-gray-500">{p.location} · {p.bedrooms} bed · {p.bathrooms} bath</p>
                    <p className="text-sm text-blue-600 font-semibold mt-1">{formatPrice(p.pricePerMonth)}/mo</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={p.status} />
                    <Link href={`/dashboard/landlord/properties/${p.id}/edit`} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                      <Pencil size={15} />
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm('Delete this property?')) deleteProperty(p.id);
                      }}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
