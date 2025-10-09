'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { JobApplication } from '@/types/user';
import { Briefcase, Clock, CheckCircle2, XCircle, AlertCircle, Eye } from 'lucide-react';

export default function ApplicationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications');
      if (response.ok) {
        setApplications(await response.json());
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewing': return 'bg-blue-100 text-blue-800';
      case 'shortlisted': return 'bg-purple-100 text-purple-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'reviewing': return <Eye className="w-5 h-5 text-blue-600" />;
      case 'shortlisted': return <AlertCircle className="w-5 h-5 text-purple-600" />;
      case 'accepted': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007F4E] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  const pendingApps = applications.filter(a => a.status === 'pending');
  const reviewingApps = applications.filter(a => a.status === 'reviewing');
  const shortlistedApps = applications.filter(a => a.status === 'shortlisted');
  const acceptedApps = applications.filter(a => a.status === 'accepted');
  const rejectedApps = applications.filter(a => a.status === 'rejected');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
              <p className="mt-2 text-gray-600">Track your job applications</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/jobs"
                className="px-4 py-2 bg-[#3DB2FF] text-white rounded-lg hover:bg-[#2A9DE8]"
              >
                Browse Jobs
              </Link>
              <Link
                href="/dashboard/students"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                ← Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-gray-900">{applications.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-yellow-800">{pendingApps.length}</div>
            <div className="text-sm text-yellow-700">Pending</div>
          </div>
          <div className="bg-blue-50 rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-blue-800">{reviewingApps.length}</div>
            <div className="text-sm text-blue-700">Reviewing</div>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-green-800">{acceptedApps.length}</div>
            <div className="text-sm text-green-700">Accepted</div>
          </div>
          <div className="bg-red-50 rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-red-800">{rejectedApps.length}</div>
            <div className="text-sm text-red-700">Rejected</div>
          </div>
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-600 mb-4">Start applying to jobs to see your applications here</p>
            <Link
              href="/jobs"
              className="inline-block px-6 py-2 bg-[#3DB2FF] text-white rounded-lg hover:bg-[#2A9DE8]"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{app.jobTitle}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(app.status)}`}>
                        {getStatusIcon(app.status)}
                        {app.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                      </div>
                      {app.updatedAt && new Date(app.updatedAt).getTime() !== new Date(app.appliedAt).getTime() && (
                        <>
                          <span>•</span>
                          <span>Updated {new Date(app.updatedAt).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>

                    {app.cvUrl && (
                      <div className="mb-2">
                        <span className="text-sm text-gray-600">CV: </span>
                        <a
                          href={app.cvUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#3DB2FF] hover:underline"
                        >
                          View CV
                        </a>
                      </div>
                    )}

                    {app.linkedCertificates && app.linkedCertificates.length > 0 && (
                      <div className="mb-2">
                        <span className="text-sm text-gray-600">
                          Linked {app.linkedCertificates.length} certificate(s)
                        </span>
                      </div>
                    )}

                    {app.reviewNotes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded border-l-4 border-blue-500">
                        <p className="text-sm font-medium text-gray-900 mb-1">Review Notes:</p>
                        <p className="text-sm text-gray-700">{app.reviewNotes}</p>
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/jobs/${app.jobId}`}
                    className="ml-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
                  >
                    View Job
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
