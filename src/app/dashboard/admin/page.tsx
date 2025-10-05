'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminDashboard() {
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
            <h1 className="text-2xl font-bold text-purple-600">UmojaHub - Admin Dashboard</h1>
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
            Welcome to the Admin Dashboard
          </h2>
          <p className="text-gray-600">
            Manage users, verify farmers, moderate content, and view platform analytics.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Users</div>
            <div className="text-3xl font-bold text-purple-600">0</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Pending Verifications</div>
            <div className="text-3xl font-bold text-yellow-600">0</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Active Listings</div>
            <div className="text-3xl font-bold text-green-600">0</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Courses</div>
            <div className="text-3xl font-bold text-blue-600">0</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button className="p-4 border-2 border-gray-300 rounded-lg hover:border-purple-500 transition text-left">
              <div className="font-semibold text-gray-900 mb-1">✓ Farmer Verifications</div>
              <div className="text-sm text-gray-600">Review pending farmer verifications</div>
            </button>
            <button className="p-4 border-2 border-gray-300 rounded-lg hover:border-purple-500 transition text-left">
              <div className="font-semibold text-gray-900 mb-1">👥 User Management</div>
              <div className="text-sm text-gray-600">View and manage all users</div>
            </button>
            <button className="p-4 border-2 border-gray-300 rounded-lg hover:border-purple-500 transition text-left">
              <div className="font-semibold text-gray-900 mb-1">📚 Course Management</div>
              <div className="text-sm text-gray-600">Create and manage courses</div>
            </button>
            <button className="p-4 border-2 border-gray-300 rounded-lg hover:border-purple-500 transition text-left">
              <div className="font-semibold text-gray-900 mb-1">🛡️ Content Moderation</div>
              <div className="text-sm text-gray-600">Review flagged content</div>
            </button>
            <button className="p-4 border-2 border-gray-300 rounded-lg hover:border-purple-500 transition text-left">
              <div className="font-semibold text-gray-900 mb-1">📊 Analytics</div>
              <div className="text-sm text-gray-600">View platform statistics</div>
            </button>
            <button className="p-4 border-2 border-gray-300 rounded-lg hover:border-purple-500 transition text-left">
              <div className="font-semibold text-gray-900 mb-1">📋 Audit Logs</div>
              <div className="text-sm text-gray-600">View admin action history</div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="text-center text-gray-500 py-8">
            No recent activity to display
          </div>
        </div>
      </main>
    </div>
  );
}
