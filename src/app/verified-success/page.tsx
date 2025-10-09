'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function VerifiedSuccessPage() {
  const searchParams = useSearchParams();
  const already = searchParams.get('already');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-100 p-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {already ? 'Already Verified!' : 'Email Verified Successfully!'}
        </h1>
        
        <p className="text-gray-600 mb-8">
          {already
            ? 'Your email has already been verified. You can now access your dashboard.'
            : 'Your email has been verified successfully. You can now access all features of your UmojaHub account.'}
        </p>
        
        <div className="space-y-3">
          <Link
            href="/login"
            className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Go to Login
          </Link>
          
          <Link
            href="/"
            className="block w-full bg-white hover:bg-gray-50 text-green-600 font-semibold py-3 px-6 rounded-lg border-2 border-green-600 transition-colors"
          >
            Go to Home
          </Link>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Welcome to UmojaHub - Building a better future together
          </p>
        </div>
      </div>
    </div>
  );
}
