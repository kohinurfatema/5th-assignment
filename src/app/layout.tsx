import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/providers/query-provider';
import { Toaster } from 'sonner';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });

export const metadata: Metadata = {
  title: 'RentNest — Find & List Rental Properties',
  description: 'Find your perfect rental property with ease.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        <QueryProvider>
          {children}
          <Toaster position="top-right" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
