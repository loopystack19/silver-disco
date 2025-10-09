'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Users, BookOpen, Briefcase, ShoppingBag, Award, TrendingUp } from 'lucide-react';

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
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

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007F4E] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
              <p className="mt-2 text-gray-600">Key metrics and insights</p>
            </div>
            <Link
              href="/dashboard/admin"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
              </div>
              <Users className="w-12 h-12 text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.totalCourses || 0}</p>
              </div>
              <BookOpen className="w-12 h-12 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Jobs</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.activeJobs || 0}</p>
              </div>
              <Briefcase className="w-12 h-12 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Listings</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.activeListings || 0}</p>
              </div>
              <ShoppingBag className="w-12 h-12 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Users by Role */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Users by Role</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {stats?.usersByRole && Object.entries(stats.usersByRole).map(([role, count]: [string, any]) => (
              <div key={role} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className="text-sm text-gray-600 capitalize">{role}s</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${stats.totalUsers > 0 ? (count / stats.totalUsers) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education Hub Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Education Hub</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Enrollments</span>
                <span className="text-2xl font-bold text-blue-600">{stats?.totalEnrollments || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Completed</span>
                <span className="text-2xl font-bold text-green-600">{stats?.completedEnrollments || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Certificates Issued</span>
                <span className="text-2xl font-bold text-purple-600">{stats?.certificatesIssued || 0}</span>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-semibold text-gray-900">
                    {stats?.totalEnrollments > 0
                      ? Math.round((stats.completedEnrollments / stats.totalEnrollments) * 100)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Employment Hub</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Applications</span>
                <span className="text-2xl font-bold text-orange-600">{stats?.totalApplications || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Verified Projects</span>
                <span className="text-2xl font-bold text-green-600">{stats?.verifiedProjects || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Pending Verifications</span>
                <span className="text-2xl font-bold text-yellow-600">{stats?.pendingVerifications || 0}</span>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Active Jobs</span>
                  <span className="font-semibold text-gray-900">{stats?.activeJobs || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Food Security Hub Metrics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Food Security Hub</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">{stats?.activeListings || 0}</p>
              <p className="text-sm text-gray-600 mt-1">Active Listings</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">{stats?.verifiedFarmers || 0}</p>
              <p className="text-sm text-gray-600 mt-1">Verified Farmers</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">
                {stats?.usersByRole?.farmer || 0}
              </p>
              <p className="text-sm text-gray-600 mt-1">Total Farmers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
