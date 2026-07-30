'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Users, Home, ClipboardList, LogOut, ShieldAlert, ShieldCheck, Menu } from 'lucide-react';
import { useState } from 'react';
import api from '@/lib/api';
import { clearAuth, getUser } from '@/lib/auth';
import { formatDate } from '@/lib/utils';
import { User } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';

export default function AdminDashboard() {
  const user = getUser();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.get('/admin/users').then(r => r.data),
  });

  const { data: propertiesData } = useQuery({
    queryKey: ['admin-properties'],
    queryFn: () => api.get('/admin/properties').then(r => r.data),
  });

  const { data: rentalsData } = useQuery({
    queryKey: ['admin-rentals'],
    queryFn: () => api.get('/admin/rentals').then(r => r.data),
  });

  const { mutate: toggleBan, isPending } = useMutation({
    mutationFn: ({ id, isBanned }: { id: string; isBanned: boolean }) =>
      api.patch(`/admin/users/${id}`, { isBanned }),
    onSuccess: (_, vars) => {
      toast.success(vars.isBanned ? 'User banned' : 'User unbanned');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: () => toast.error('Failed to update user'),
  });

  const users: User[] = usersData?.data ?? [];
  const properties = (propertiesData?.data as any)?.data ?? propertiesData?.data ?? [];
  const rentals = rentalsData?.data ?? [];

  const handleLogout = () => { clearAuth(); router.push('/'); };

  const stats = [
    { label: 'Total Users', value: users.length, icon: Users, color: 'blue' },
    { label: 'Total Properties', value: properties.length, icon: Home, color: 'green' },
    { label: 'Total Rentals', value: rentals.length, icon: ClipboardList, color: 'purple' },
    { label: 'Banned Users', value: users.filter((u: User) => u.isBanned).length, icon: ShieldAlert, color: 'red' },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🏠</span>
          <span className="font-bold text-blue-600">RentNest</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        <p className="text-xs text-gray-400 uppercase tracking-wider px-3 mb-2">Admin</p>
        <a href="#users" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
          <Users size={16} /> Users
        </a>
        <a href="#properties" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
          <Home size={16} /> Properties
        </a>
        <a href="#rentals" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
          <ClipboardList size={16} /> Rentals
        </a>
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
          <span className="font-semibold text-gray-900">Admin Dashboard</span>
        </div>

        <div className="p-4 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {stats.map(stat => (
              <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${stat.color}-100 flex-shrink-0`}>
                  <stat.icon size={18} className={`text-${stat.color}-600`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 truncate">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Users Table */}
          <section id="users" className="mb-10">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">User Management</h2>
            {usersLoading ? (
              <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}</div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[600px]">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                      <tr>
                        <th className="text-left px-5 py-3">Name</th>
                        <th className="text-left px-5 py-3">Email</th>
                        <th className="text-left px-5 py-3">Role</th>
                        <th className="text-left px-5 py-3">Status</th>
                        <th className="text-left px-5 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {users.map((u: User) => (
                        <tr key={u.id} className="hover:bg-gray-50 transition">
                          <td className="px-5 py-3 font-medium text-gray-800">{u.name}</td>
                          <td className="px-5 py-3 text-gray-500">{u.email}</td>
                          <td className="px-5 py-3">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                              u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                              u.role === 'LANDLORD' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>{u.role}</span>
                          </td>
                          <td className="px-5 py-3">
                            {u.isBanned
                              ? <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-100 text-red-600">Banned</span>
                              : <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-600">Active</span>
                            }
                          </td>
                          <td className="px-5 py-3">
                            {u.role !== 'ADMIN' && (
                              <button
                                onClick={() => toggleBan({ id: u.id, isBanned: !u.isBanned })}
                                disabled={isPending}
                                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition disabled:opacity-60 ${
                                  u.isBanned
                                    ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                                }`}
                              >
                                {u.isBanned ? <><ShieldCheck size={13} /> Unban</> : <><ShieldAlert size={13} /> Ban</>}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>

          {/* Properties */}
          <section id="properties" className="mb-10">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">All Properties ({properties.length})</h2>
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[500px]">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                    <tr>
                      <th className="text-left px-5 py-3">Title</th>
                      <th className="text-left px-5 py-3">Location</th>
                      <th className="text-left px-5 py-3">Landlord</th>
                      <th className="text-left px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {properties.slice(0, 10).map((p: any) => (
                      <tr key={p.id} className="hover:bg-gray-50 transition">
                        <td className="px-5 py-3 font-medium text-gray-800">{p.title}</td>
                        <td className="px-5 py-3 text-gray-500">{p.location}</td>
                        <td className="px-5 py-3 text-gray-500">{p.landlord?.name ?? '—'}</td>
                        <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Rentals */}
          <section id="rentals">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">All Rentals ({rentals.length})</h2>
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[480px]">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                    <tr>
                      <th className="text-left px-5 py-3">Property</th>
                      <th className="text-left px-5 py-3">Tenant</th>
                      <th className="text-left px-5 py-3">Move-in</th>
                      <th className="text-left px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {rentals.slice(0, 10).map((r: any) => (
                      <tr key={r.id} className="hover:bg-gray-50 transition">
                        <td className="px-5 py-3 font-medium text-gray-800">{r.property?.title ?? '—'}</td>
                        <td className="px-5 py-3 text-gray-500">{r.tenant?.name ?? '—'}</td>
                        <td className="px-5 py-3 text-gray-500">{formatDate(r.moveInDate)}</td>
                        <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
