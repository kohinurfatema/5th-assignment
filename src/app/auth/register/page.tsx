'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import api from '@/lib/api';
import { saveAuth } from '@/lib/auth';
import { ApiResponse, AuthUser } from '@/types';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['TENANT', 'LANDLORD'], { required_error: 'Please select a role' }),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'TENANT' },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      await api.post('/auth/register', data);
      // Register doesn't return a token — login immediately after
      const loginRes = await api.post<ApiResponse<{ token: string; user: AuthUser }>>('/auth/login', {
        email: data.email,
        password: data.password,
      });
      return { loginRes, role: data.role };
    },
    onSuccess: ({ loginRes, role }) => {
      const { token, user } = loginRes.data.data;
      saveAuth(token, user);
      toast.success('Account created successfully!');
      if (role === 'LANDLORD') router.push('/dashboard/landlord');
      else router.push('/dashboard/tenant');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Registration failed');
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
          <p className="text-gray-500 mt-1">Join RentNest today</p>
        </div>

        <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              {...register('name')}
              type="text"
              placeholder="John Doe"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              {...register('email')}
              type="email"
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              {(['TENANT', 'LANDLORD'] as const).map((r) => (
                <label key={r} className="relative cursor-pointer">
                  <input {...register('role')} type="radio" value={r} className="peer sr-only" />
                  <div className="border-2 border-gray-200 peer-checked:border-blue-600 peer-checked:bg-blue-50 rounded-lg p-3 text-center transition">
                    <p className="text-sm font-medium text-gray-700 peer-checked:text-blue-700">
                      {r === 'TENANT' ? '🏠 Tenant' : '🏘️ Landlord'}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {r === 'TENANT' ? 'Looking to rent' : 'Have a property'}
                    </p>
                  </div>
                </label>
              ))}
            </div>
            {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition"
          >
            {isPending ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-blue-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
