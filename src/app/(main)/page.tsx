'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import api from '@/lib/api';
import { ApiResponse, Property } from '@/types';
import PropertyCard from '@/components/properties/PropertyCard';
import PropertyCardSkeleton from '@/components/properties/PropertyCardSkeleton';

const CATEGORIES = ['Apartment', 'House', 'Studio', 'Villa', 'Duplex', 'Room', 'Office Space'];

export default function HomePage() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['properties-featured'],
    queryFn: () => api.get<ApiResponse<{ data: Property[] }>>('/properties?limit=6').then(r => r.data),
  });

  const properties: Property[] = (data?.data as any)?.data ?? data?.data ?? [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/properties?location=${encodeURIComponent(search)}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="relative max-w-4xl mx-auto px-4 py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            2,000+ properties available now
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-5 leading-tight tracking-tight">
            Find Your Perfect<br />
            <span className="text-blue-200">Rental Home</span>
          </h1>
          <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Browse thousands of verified rental properties across Bangladesh — apartments, houses, studios and more.
          </p>
          <form onSubmit={handleSearch} className="flex max-w-xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by location (e.g. Dhaka, Gulshan...)"
              className="flex-1 px-5 py-4 text-gray-800 text-sm outline-none"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-6 flex items-center gap-2 text-white transition font-medium text-sm">
              <Search size={18} />
              Search
            </button>
          </form>
          <div className="flex flex-wrap justify-center gap-3 mt-6 text-sm text-blue-100">
            {['Dhaka', 'Chittagong', 'Gulshan', 'Mirpur', 'Sylhet'].map(city => (
              <button key={city} onClick={() => { setSearch(city); }} className="hover:text-white underline-offset-2 hover:underline transition">
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '2,000+', label: 'Properties Listed' },
            { value: '1,500+', label: 'Happy Tenants' },
            { value: '800+', label: 'Verified Landlords' },
            { value: '20+', label: 'Cities Covered' },
          ].map(stat => (
            <div key={stat.label}>
              <p className="text-2xl md:text-3xl font-bold text-blue-600">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold text-gray-900 mb-5">Browse by Type</h2>
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map(cat => (
            <Link
              key={cat}
              href={`/properties?category=${cat}`}
              className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-blue-500 hover:text-blue-600 transition shadow-sm"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Featured Properties</h2>
          <Link href="/properties" className="text-sm text-blue-600 hover:underline font-medium">View all →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)
            : properties.map((p: Property) => <PropertyCard key={p.id} property={p} />)
          }
        </div>
        {!isLoading && properties.length === 0 && (
          <p className="text-center text-gray-500 py-12">No properties found.</p>
        )}
      </section>

      {/* How it Works */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">How RentNest Works</h2>
            <p className="text-gray-500 mt-2">Find and rent your home in 3 simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: '🔍', title: 'Search Properties', desc: 'Browse thousands of verified rental properties by location, price, and type.' },
              { step: '02', icon: '📋', title: 'Send a Request', desc: 'Choose a property you love and send a rental request directly to the landlord.' },
              { step: '03', icon: '🏠', title: 'Move In', desc: 'Get approved, complete your payment securely, and move into your new home.' },
            ].map(item => (
              <div key={item.step} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl mx-auto mb-4">
                  {item.icon}
                </div>
                <span className="text-xs font-bold text-blue-500 tracking-widest">STEP {item.step}</span>
                <h3 className="font-semibold text-gray-900 mt-1 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-50 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Have a property to rent out?</h2>
          <p className="text-gray-500 mb-6">List your property on RentNest and reach thousands of tenants.</p>
          <Link href="/auth/register" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-xl transition">
            List Your Property
          </Link>
        </div>
      </section>
    </div>
  );
}
