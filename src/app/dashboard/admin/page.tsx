'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingVerifications: 0,
    activeListings: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalApplications: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        setStats(await response.json());
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Link href="/dashboard/admin/users" className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
            <div className="text-xs text-gray-600 mb-1">Total Users</div>
            <div className="text-2xl font-bold text-purple-600">{loading ? '...' : stats.totalUsers}</div>
          </Link>
          <Link href="/dashboard/admin/verifications" className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
            <div className="text-xs text-gray-600 mb-1">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">{loading ? '...' : stats.pendingVerifications}</div>
          </Link>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-xs text-gray-600 mb-1">Active Listings</div>
            <div className="text-2xl font-bold text-green-600">{loading ? '...' : stats.activeListings}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-xs text-gray-600 mb-1">Courses</div>
            <div className="text-2xl font-bold text-blue-600">{loading ? '...' : stats.totalCourses}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-xs text-gray-600 mb-1">Enrollments</div>
            <div className="text-2xl font-bold text-indigo-600">{loading ? '...' : stats.totalEnrollments}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-xs text-gray-600 mb-1">Applications</div>
            <div className="text-2xl font-bold text-orange-600">{loading ? '...' : stats.totalApplications}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/dashboard/admin/verifications" className="p-4 border-2 border-gray-300 rounded-lg hover:border-purple-500 transition text-left block">
              <div className="font-semibold text-gray-900 mb-1">✓ Project Verifications</div>
              <div className="text-sm text-gray-600">Review pending project submissions</div>
            </Link>
            <Link href="/dashboard/admin/users" className="p-4 border-2 border-gray-300 rounded-lg hover:border-purple-500 transition text-left block">
              <div className="font-semibold text-gray-900 mb-1">👥 User Management</div>
              <div className="text-sm text-gray-600">View and manage all users</div>
            </Link>
            <Link href="/dashboard/admin/analytics" className="p-4 border-2 border-gray-300 rounded-lg hover:border-purple-500 transition text-left block">
              <div className="font-semibold text-gray-900 mb-1">📊 Analytics</div>
              <div className="text-sm text-gray-600">View platform statistics</div>
            </Link>
            <Link href="/dashboard/admin/jobs" className="p-4 border-2 border-gray-300 rounded-lg hover:border-purple-500 transition text-left block">
              <div className="font-semibold text-gray-900 mb-1">💼 Job Management</div>
              <div className="text-sm text-gray-600">Manage job listings</div>
            </Link>
            <Link href="/dashboard/admin/projects" className="p-4 border-2 border-gray-300 rounded-lg hover:border-purple-500 transition text-left block">
              <div className="font-semibold text-gray-900 mb-1">🚀 Project Management</div>
              <div className="text-sm text-gray-600">Create and manage projects</div>
            </Link>
            <Link href="/dashboard/admin/audit" className="p-4 border-2 border-gray-300 rounded-lg hover:border-purple-500 transition text-left block">
              <div className="font-semibold text-gray-900 mb-1">📋 Audit Logs</div>
              <div className="text-sm text-gray-600">View admin action history</div>
            </Link>
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
