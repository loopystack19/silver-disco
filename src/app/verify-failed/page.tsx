'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { XCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function VerifyFailedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reason = searchParams.get('reason');
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [resendError, setResendError] = useState('');

  const getErrorMessage = () => {
    switch (reason) {
      case 'expired':
        return 'This verification link has expired. Verification links are valid for 30 minutes.';
      case 'invalid-token':
        return 'This verification link is invalid or has already been used.';
      case 'missing-token':
        return 'No verification token was provided.';
      case 'error':
        return 'An error occurred while verifying your email.';
      default:
        return 'This verification link is invalid or has expired.';
    }
  };

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResending(true);
    setResendMessage('');
    setResendError('');

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setResendMessage('Verification email sent! Please check your inbox.');
        setEmail('');
      } else {
        setResendError(data.error || 'Failed to send verification email');
      }
    } catch (error) {
      setResendError('An error occurred. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-red-100 p-4">
            <XCircle className="w-16 h-16 text-red-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          Verification Failed
        </h1>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-red-800 text-sm">{getErrorMessage()}</p>
          </div>
        </div>
        
        {reason === 'expired' && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Resend Verification Email
            </h2>
            <form onSubmit={handleResendVerification} className="space-y-3">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isResending}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isResending ? 'Sending...' : 'Resend Verification Email'}
              </button>
            </form>
            
            {resendMessage && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm">{resendMessage}</p>
              </div>
            )}
            
            {resendError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{resendError}</p>
              </div>
            )}
          </div>
        )}
        
        <div className="space-y-3 mt-6">
          <Link
            href="/register"
            className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors"
          >
            Create New Account
          </Link>
          
          <Link
            href="/login"
            className="block w-full bg-white hover:bg-gray-50 text-green-600 font-semibold py-3 px-6 rounded-lg border-2 border-green-600 text-center transition-colors"
          >
            Go to Login
          </Link>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact support at support@umojahub.com
          </p>
        </div>
      </div>
    </div>
  );
}
