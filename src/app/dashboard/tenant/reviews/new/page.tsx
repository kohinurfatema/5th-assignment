'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Star, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

const schema = z.object({
  rating: z.coerce.number().min(1, 'Rating is required').max(5),
  comment: z.string().min(5, 'Comment must be at least 5 characters'),
});

type FormData = z.infer<typeof schema>;

export default function LeaveReviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('propertyId');
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormData) => api.post('/reviews', { ...data, propertyId }),
    onSuccess: () => {
      toast.success('Review submitted!');
      router.push('/dashboard/tenant');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to submit review'),
  });

  if (!propertyId) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">No property specified.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/dashboard/tenant" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <div className="bg-white rounded-2xl shadow p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Leave a Review</h1>
          <p className="text-sm text-gray-500 mb-6">Share your experience with this property</p>

          <form onSubmit={handleSubmit(d => mutate(d))} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => { setSelected(star); setValue('rating', star); }}
                    className="transition"
                  >
                    <Star
                      size={32}
                      className={`transition ${star <= (hovered || selected) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  </button>
                ))}
              </div>
              {errors.rating && <p className="mt-1 text-xs text-red-500">{errors.rating.message}</p>}
              <input type="hidden" {...register('rating')} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
              <textarea
                {...register('comment')}
                rows={4}
                placeholder="Tell others about your experience..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              {errors.comment && <p className="mt-1 text-xs text-red-500">{errors.comment.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isPending || selected === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-3 rounded-xl transition"
            >
              {isPending ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
