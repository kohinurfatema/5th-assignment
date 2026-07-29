import { RentalStatus, PaymentStatus } from '@/types';
import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<string, string> = {
  PENDING:   'bg-yellow-100 text-yellow-700',
  APPROVED:  'bg-blue-100 text-blue-700',
  REJECTED:  'bg-red-100 text-red-700',
  ACTIVE:    'bg-green-100 text-green-700',
  COMPLETED: 'bg-gray-100 text-gray-600',
  FAILED:    'bg-red-100 text-red-700',
};

export default function StatusBadge({ status }: { status: RentalStatus | PaymentStatus | string }) {
  return (
    <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full', STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-600')}>
      {status}
    </span>
  );
}
