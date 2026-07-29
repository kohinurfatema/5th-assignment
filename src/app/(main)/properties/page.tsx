'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import api from '@/lib/api';
import { Property, Category } from '@/types';
import PropertyCard from '@/components/properties/PropertyCard';
import PropertyCardSkeleton from '@/components/properties/PropertyCardSkeleton';

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('categoryId') || '');
  const [showFilters, setShowFilters] = useState(false);

  const buildQuery = () => {
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (bedrooms) params.set('bedrooms', bedrooms);
    if (categoryId) params.set('categoryId', categoryId);
    return params.toString();
  };

  const { data: propertiesData, isLoading } = useQuery({
    queryKey: ['properties', location, minPrice, maxPrice, bedrooms, categoryId],
    queryFn: () => api.get(`/properties?${buildQuery()}`).then(r => r.data),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(r => r.data),
  });

  const properties: Property[] = (propertiesData?.data as any)?.data ?? propertiesData?.data ?? [];
  const categories: Category[] = (categoriesData?.data as any) ?? [];

  const clearFilters = () => {
    setLocation(''); setMinPrice(''); setMaxPrice('');
    setBedrooms(''); setCategoryId('');
  };

  const hasFilters = location || minPrice || maxPrice || bedrooms || categoryId;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rental Properties</h1>
          <p className="text-gray-500 text-sm mt-1">{properties.length} properties found</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 transition"
        >
          <SlidersHorizontal size={16} />
          Filters
          {hasFilters && <span className="w-2 h-2 rounded-full bg-blue-600" />}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
            <input
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. Dhaka"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Min Price</label>
            <input
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
              type="number"
              placeholder="0"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Max Price</label>
            <input
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              type="number"
              placeholder="Any"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Bedrooms</label>
            <select
              value={bedrooms}
              onChange={e => setBedrooms(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any</option>
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}+</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              {categories.map((c: Category) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 col-span-full">
              <X size={14} /> Clear filters
            </button>
          )}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)
          : properties.map((p: Property) => <PropertyCard key={p.id} property={p} />)
        }
      </div>

      {!isLoading && properties.length === 0 && (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🏠</p>
          <p className="text-gray-500">No properties found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}
