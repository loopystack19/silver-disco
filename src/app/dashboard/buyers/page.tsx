'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function BuyerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-orange-600">UmojaHub - Buyer Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Welcome, {session.user.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Welcome to your Buyer Dashboard
          </h2>
          <p className="text-gray-600">
            Browse fresh crops from verified farmers and connect directly with sellers.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Saved Listings</div>
            <div className="text-3xl font-bold text-orange-600">0</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Contacted Farmers</div>
            <div className="text-3xl font-bold text-green-600">0</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Recent Purchases</div>
            <div className="text-3xl font-bold text-blue-600">0</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="p-4 border-2 border-gray-300 rounded-lg hover:border-orange-500 transition text-left">
              <div className="font-semibold text-gray-900 mb-1">🌾 Browse Marketplace</div>
              <div className="text-sm text-gray-600">View available crops from farmers</div>
            </button>
            <button className="p-4 border-2 border-gray-300 rounded-lg hover:border-orange-500 transition text-left">
              <div className="font-semibold text-gray-900 mb-1">✓ Verified Farmers</div>
              <div className="text-sm text-gray-600">Browse listings from verified farmers only</div>
            </button>
            <button className="p-4 border-2 border-gray-300 rounded-lg hover:border-orange-500 transition text-left">
              <div className="font-semibold text-gray-900 mb-1">💾 My Saved Items</div>
              <div className="text-sm text-gray-600">View your bookmarked listings</div>
            </button>
            <button className="p-4 border-2 border-gray-300 rounded-lg hover:border-orange-500 transition text-left">
              <div className="font-semibold text-gray-900 mb-1">👤 Edit Profile</div>
              <div className="text-sm text-gray-600">Update your information</div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
