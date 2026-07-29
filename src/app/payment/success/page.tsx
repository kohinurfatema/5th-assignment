import Link from 'next/link';

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow p-10 w-full max-w-md text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <span className="text-3xl">✅</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-500 mb-8">
          Your rental payment has been confirmed. Your rental is now <span className="text-green-600 font-semibold">ACTIVE</span>.
        </p>
        <div className="space-y-3">
          <Link
            href="/dashboard/tenant"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/properties"
            className="block w-full border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium py-3 rounded-xl transition"
          >
            Browse More Properties
          </Link>
        </div>
      </div>
    </div>
  );
}
