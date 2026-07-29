'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import api from '@/lib/api';
import { Category } from '@/types';

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(2, 'Location is required'),
  pricePerMonth: z.coerce.number().min(1, 'Price must be greater than 0'),
  bedrooms: z.coerce.number().min(1, 'At least 1 bedroom required'),
  bathrooms: z.coerce.number().min(1, 'At least 1 bathroom required'),
  categoryId: z.string().min(1, 'Please select a category'),
  amenities: z.string().optional(),
  images: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NewPropertyPage() {
  const router = useRouter();

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(r => r.data),
  });
  const categories: Category[] = categoriesData?.data ?? [];

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormData) => {
      const payload = {
        ...data,
        amenities: data.amenities ? data.amenities.split(',').map(s => s.trim()).filter(Boolean) : [],
        images: data.images ? data.images.split(',').map(s => s.trim()).filter(Boolean) : [],
      };
      return api.post('/landlord/properties', payload);
    },
    onSuccess: () => {
      toast.success('Property created successfully!');
      router.push('/dashboard/landlord');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to create property'),
  });

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard/landlord" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <div className="bg-white rounded-2xl shadow p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Property</h1>
          <form onSubmit={handleSubmit(d => mutate(d))} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input {...register('title')} placeholder="Modern 2BR Apartment in Dhaka" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea {...register('description')} rows={3} placeholder="Describe your property..." className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input {...register('location')} placeholder="Gulshan, Dhaka" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price/Month (BDT)</label>
                <input {...register('pricePerMonth')} type="number" placeholder="25000" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                {errors.pricePerMonth && <p className="mt-1 text-xs text-red-500">{errors.pricePerMonth.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select {...register('categoryId')} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {errors.categoryId && <p className="mt-1 text-xs text-red-500">{errors.categoryId.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                <input {...register('bedrooms')} type="number" min={1} placeholder="2" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                {errors.bedrooms && <p className="mt-1 text-xs text-red-500">{errors.bedrooms.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                <input {...register('bathrooms')} type="number" min={1} placeholder="1" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                {errors.bathrooms && <p className="mt-1 text-xs text-red-500">{errors.bathrooms.message}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Amenities <span className="text-gray-400 font-normal">(comma separated)</span></label>
                <input {...register('amenities')} placeholder="WiFi, AC, Parking, Generator" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs <span className="text-gray-400 font-normal">(comma separated)</span></label>
                <input {...register('images')} placeholder="https://example.com/img1.jpg, https://..." className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <button type="submit" disabled={isPending} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-3 rounded-xl transition">
              {isPending ? 'Creating...' : 'Create Property'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
