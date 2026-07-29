'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { MapPin, Bed, Bath, Star, X } from 'lucide-react';
import api from '@/lib/api';
import { getUser } from '@/lib/auth';
import { formatPrice, formatDate } from '@/lib/utils';
import { Property, Review } from '@/types';

const requestSchema = z.object({
  moveInDate: z.string().refine(v => new Date(v) > new Date(), { message: 'Move-in date must be in the future' }),
  message: z.string().optional(),
});
type RequestForm = z.infer<typeof requestSchema>;

export default function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const user = getUser();
  const [showModal, setShowModal] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: () => api.get(`/properties/${id}`).then(r => r.data),
  });

  const { data: reviewsData } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => api.get(`/reviews/property/${id}`).then(r => r.data),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<RequestForm>({
    resolver: zodResolver(requestSchema),
  });

  const { mutate: submitRequest, isPending } = useMutation({
    mutationFn: (data: RequestForm) => api.post('/rentals', { ...data, propertyId: id }),
    onSuccess: () => {
      toast.success('Rental request submitted!');
      setShowModal(false);
      reset();
      router.push('/dashboard/tenant');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to submit request'),
  });

  const property: Property = data?.data;
  const reviews: Review[] = reviewsData?.data ?? [];

  if (isLoading) return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-pulse space-y-4">
      <div className="h-72 bg-gray-200 rounded-2xl" />
      <div className="h-8 w-2/3 bg-gray-200 rounded" />
      <div className="h-4 w-1/3 bg-gray-200 rounded" />
    </div>
  );

  if (!property) return (
    <div className="text-center py-20">
      <p className="text-5xl mb-4">🏠</p>
      <p className="text-gray-500">Property not found.</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Image */}
      <div className="h-72 md:h-96 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl overflow-hidden mb-6 flex items-center justify-center">
        {property.images?.[0]
          ? <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
          : <span className="text-8xl opacity-30">🏠</span>
        }
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">{property.category?.name}</span>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">{property.title}</h1>
            <div className="flex items-center gap-1 text-gray-500 mt-1">
              <MapPin size={15} />
              <span className="text-sm">{property.location}</span>
            </div>
          </div>

          <div className="flex gap-6 text-sm text-gray-600">
            <span className="flex items-center gap-1.5"><Bed size={16} />{property.bedrooms} Bedrooms</span>
            <span className="flex items-center gap-1.5"><Bath size={16} />{property.bathrooms} Bathrooms</span>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{property.description}</p>
          </div>

          {property.amenities?.length > 0 && (
            <div>
              <h2 className="font-semibold text-gray-900 mb-2">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((a: string) => (
                  <span key={a} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">{a}</span>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div>
            <h2 className="font-semibold text-gray-900 mb-3">Reviews ({reviews.length})</h2>
            {reviews.length === 0
              ? <p className="text-gray-400 text-sm">No reviews yet.</p>
              : reviews.map((r: any) => (
                <div key={r.id} className="border border-gray-100 rounded-xl p-4 mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={13} className={i < r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">{r.comment}</p>
                </div>
              ))
            }
          </div>
        </div>

        {/* Right - Booking Card */}
        <div className="md:col-span-1">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm sticky top-24">
            <p className="text-2xl font-bold text-blue-600">{formatPrice(property.pricePerMonth)}<span className="text-gray-400 text-sm font-normal">/month</span></p>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <div className="flex justify-between"><span>Status</span>
                <span className={`font-medium ${property.status === 'AVAILABLE' ? 'text-green-600' : 'text-red-500'}`}>{property.status}</span>
              </div>
              <div className="flex justify-between"><span>Listed by</span><span className="font-medium">{property.landlord?.name}</span></div>
              <div className="flex justify-between"><span>Listed on</span><span>{formatDate(property.createdAt)}</span></div>
            </div>

            {property.status === 'AVAILABLE' && user?.role === 'TENANT' && (
              <button
                onClick={() => setShowModal(true)}
                className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition"
              >
                Request to Rent
              </button>
            )}
            {!user && (
              <button
                onClick={() => router.push('/auth/login')}
                className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition"
              >
                Login to Request
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Submit Rental Request</h2>
              <button onClick={() => setShowModal(false)}><X size={20} className="text-gray-500" /></button>
            </div>
            <form onSubmit={handleSubmit(d => submitRequest(d))} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Move-in Date</label>
                <input
                  {...register('moveInDate')}
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.moveInDate && <p className="mt-1 text-xs text-red-500">{errors.moveInDate.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message (optional)</label>
                <textarea
                  {...register('message')}
                  rows={3}
                  placeholder="Tell the landlord about yourself..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition"
              >
                {isPending ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
