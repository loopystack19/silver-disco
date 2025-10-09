'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';

export default function StudentDashboard() {
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
            <h1 className="text-2xl font-bold text-blue-600">UmojaHub - Student Dashboard</h1>
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
            Welcome to your Student Dashboard
          </h2>
          <p className="text-gray-600">
            Access courses, earn certificates, find jobs, and connect with employers.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Enrolled Courses</div>
            <div className="text-3xl font-bold text-blue-600">0</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Completed Courses</div>
            <div className="text-3xl font-bold text-green-600">0</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Certificates Earned</div>
            <div className="text-3xl font-bold text-purple-600">0</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Job Applications</div>
            <div className="text-3xl font-bold text-orange-600">0</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button className="p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 transition text-left">
              <div className="font-semibold text-gray-900 mb-1">📚 Browse Courses</div>
              <div className="text-sm text-gray-600">Explore available courses</div>
            </button>
            <button className="p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 transition text-left">
              <div className="font-semibold text-gray-900 mb-1">💼 Find Jobs</div>
              <div className="text-sm text-gray-600">Search for job opportunities</div>
            </button>
            <button className="p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 transition text-left">
              <div className="font-semibold text-gray-900 mb-1">🎓 My Certificates</div>
              <div className="text-sm text-gray-600">View earned certificates</div>
            </button>
            <button className="p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 transition text-left">
              <div className="font-semibold text-gray-900 mb-1">📝 Optimize CV</div>
              <div className="text-sm text-gray-600">Get AI-powered CV suggestions</div>
            </button>
            <Link 
              href="/projects"
              className="p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 transition text-left block"
            >
              <div className="font-semibold text-gray-900 mb-1">🚀 Project Sprints</div>
              <div className="text-sm text-gray-600">Build portfolio with real data</div>
            </Link>
            <Link 
              href="/jobs"
              className="p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 transition text-left block"
            >
              <div className="font-semibold text-gray-900 mb-1">💼 Job Board</div>
              <div className="text-sm text-gray-600">Find job opportunities</div>
            </Link>
            <Link 
              href="/applications"
              className="p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 transition text-left block"
            >
              <div className="font-semibold text-gray-900 mb-1">📋 My Applications</div>
              <div className="text-sm text-gray-600">Track application status</div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
