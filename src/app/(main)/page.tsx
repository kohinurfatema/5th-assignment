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
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Rental Home</h1>
          <p className="text-blue-100 text-lg mb-10">Browse thousands of rental properties across Bangladesh</p>
          <form onSubmit={handleSearch} className="flex max-w-xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by location (e.g. Dhaka, Gulshan...)"
              className="flex-1 px-5 py-4 text-gray-800 text-sm outline-none"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-6 flex items-center gap-2 text-white transition">
              <Search size={18} />
            </button>
          </form>
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
