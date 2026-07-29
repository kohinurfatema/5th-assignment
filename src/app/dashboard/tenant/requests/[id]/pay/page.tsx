'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CreditCard, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';

export default function PayPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['rental', id],
    queryFn: () => api.get(`/rentals/${id}`).then(r => r.data),
  });

  const { mutate: createSession, isPending } = useMutation({
    mutationFn: () => api.post('/payments/create', { rentalRequestId: id }),
    onSuccess: (res) => {
      const sessionUrl = res.data?.data?.sessionUrl;
      if (sessionUrl) {
        window.location.href = sessionUrl;
      } else {
        toast.error('Could not get payment URL');
      }
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Payment initiation failed'),
  });

  const rental = data?.data;

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse space-y-4 w-full max-w-md">
        <div className="h-8 bg-gray-200 rounded w-1/2" />
        <div className="h-48 bg-gray-200 rounded-2xl" />
      </div>
    </div>
  );

  if (!rental) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Rental request not found.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/dashboard/tenant" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="bg-white rounded-2xl shadow p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <CreditCard size={20} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Complete Payment</h1>
              <p className="text-sm text-gray-500">Secure checkout via Stripe</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Property</span>
              <span className="font-medium text-gray-800 text-right max-w-[60%]">{rental.property?.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Location</span>
              <span className="font-medium text-gray-800">{rental.property?.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Move-in Date</span>
              <span className="font-medium text-gray-800">{formatDate(rental.moveInDate)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
              <span className="text-gray-700 font-semibold">Total Amount</span>
              <span className="text-blue-600 font-bold text-base">{formatPrice(rental.property?.pricePerMonth)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400 mb-6 bg-gray-50 rounded-lg px-3 py-2">
            <span>🔒</span>
            <span>You will be redirected to Stripe's secure payment page</span>
          </div>

          <button
            onClick={() => createSession()}
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-3 rounded-xl transition flex items-center justify-center gap-2"
          >
            <CreditCard size={18} />
            {isPending ? 'Redirecting to Stripe...' : 'Pay Now'}
          </button>

          <Link href="/dashboard/tenant" className="block text-center text-sm text-gray-400 hover:text-gray-600 mt-4">
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
