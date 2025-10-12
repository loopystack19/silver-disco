'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Briefcase,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Award,
  TrendingUp,
  Eye,
  LogOut,
} from 'lucide-react';
import { Application, Project } from '@/types/employment';

export default function LecturerDashboard() {
  const router = useRouter();
  const { data: session } = useSession();
  const [applications, setApplications] = useState<Application[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'applications' | 'projects'>('applications');
  const [filterStatus, setFilterStatus] = useState<string>('pending');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  useEffect(() => {
    if (!session) {
      router.push('/login?redirect=/dashboard/lecturer');
      return;
    }
    fetchDashboardData();
  }, [session]);

  const fetchDashboardData = async () => {
    try {
      // Fetch applications
      const appRes = await fetch('/api/employment/applications');
      const appData = await appRes.json();
      if (appData.success) {
        setApplications(appData.applications);
      }

      // Fetch projects
      const projRes = await fetch('/api/employment/projects');
      const projData = await projRes.json();
      if (projData.success) {
        setProjects(projData.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (applicationId: string, feedback: string = '') => {
    try {
      const res = await fetch(`/api/employment/applications/${applicationId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision: 'approved', feedback }),
      });

      const data = await res.json();

      if (data.success) {
        alert('Application approved! Student has been added to the project team.');
        fetchDashboardData();
        setSelectedApplication(null);
      } else {
        alert(data.error || 'Failed to approve application');
      }
    } catch (error) {
      console.error('Error approving application:', error);
      alert('Failed to approve application');
    }
  };

  const handleReject = async (applicationId: string, feedback: string) => {
    if (!feedback.trim()) {
      alert('Please provide feedback for rejection');
      return;
    }

    try {
      const res = await fetch(`/api/employment/applications/${applicationId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision: 'rejected', feedback }),
      });

      const data = await res.json();

      if (data.success) {
        alert('Application rejected. Student has been notified.');
        fetchDashboardData();
        setSelectedApplication(null);
      } else {
        alert(data.error || 'Failed to reject application');
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
      alert('Failed to reject application');
    }
  };

  const filteredApplications = applications.filter((app) =>
    filterStatus ? app.status === filterStatus : true
  );

  const stats = {
    totalApplications: applications.length,
    pending: applications.filter((a) => a.status === 'pending').length,
    approved: applications.filter((a) => a.status === 'approved').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
    totalProjects: projects.length,
    openProjects: projects.filter((p) => p.status === 'Open').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
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
              <h1 className="text-3xl font-bold text-gray-900">Lecturer Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {session?.user?.name || 'Lecturer'}!
              </p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              Home
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Total Applications</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalApplications}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Pending</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Approved</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.approved}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Open Projects</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.openProjects}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-6">
              <button
                onClick={() => setActiveTab('applications')}
                className={`py-4 border-b-2 font-medium transition ${
                  activeTab === 'applications'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Applications ({stats.pending})
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`py-4 border-b-2 font-medium transition ${
                  activeTab === 'projects'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Projects ({stats.openProjects})
              </button>
            </div>
          </div>

          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <div className="p-6">
              {/* Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Applications List */}
              {filteredApplications.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No applications found
                  </h3>
                  <p className="text-gray-600">
                    {filterStatus
                      ? `No ${filterStatus} applications at the moment`
                      : 'Applications will appear here when students apply'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredApplications.map((application) => (
                    <div
                      key={application.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-gray-900">
                              {application.studentName}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                application.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : application.status === 'approved'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {application.status}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {application.projectTitle}
                          </p>
                          <p className="text-sm text-gray-500">
                            {application.institution} • {application.course}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {application.skills.slice(0, 5).map((skill) => (
                              <span
                                key={skill}
                                className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded"
                              >
                                {skill}
                              </span>
                            ))}
                            {application.skills.length > 5 && (
                              <span className="text-xs text-gray-500">
                                +{application.skills.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedApplication(application)}
                          className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.slice(0, 10).map((project) => (
                  <div
                    key={project.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition cursor-pointer"
                    onClick={() => router.push(`/employment/projects/${project.id}`)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-900 flex-1">{project.title}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          project.status === 'Open'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{project.organization}</span>
                      <span>
                        {project.currentTeamSize}/{project.maxTeamSize || '∞'} members
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedApplication && (
        <ApplicationReviewModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}

// Application Review Modal Component
function ApplicationReviewModal({
  application,
  onClose,
  onApprove,
  onReject,
}: {
  application: Application;
  onClose: () => void;
  onApprove: (id: string, feedback: string) => void;
  onReject: (id: string, feedback: string) => void;
}) {
  const [feedback, setFeedback] = useState('');
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);

  const handleSubmit = () => {
    if (action === 'approve') {
      onApprove(application.id, feedback);
    } else if (action === 'reject') {
      onReject(application.id, feedback);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-900">Review Application</h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Student Info */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Student Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Name</p>
                <p className="font-semibold">{application.studentName}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-semibold">{application.studentEmail}</p>
              </div>
              <div>
                <p className="text-gray-600">Institution</p>
                <p className="font-semibold">{application.institution}</p>
              </div>
              <div>
                <p className="text-gray-600">Course</p>
                <p className="font-semibold">{application.course}</p>
              </div>
              <div>
                <p className="text-gray-600">Hours/Week</p>
                <p className="font-semibold">{application.hoursPerWeek}</p>
              </div>
              <div>
                <p className="text-gray-600">Applied</p>
                <p className="font-semibold">
                  {new Date(application.submittedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {application.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Statement */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Statement of Interest</h3>
            <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
              {application.statement}
            </p>
          </div>

          {/* Portfolio Link */}
          {application.portfolioLink && (
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Portfolio</h3>
              <a
                href={application.portfolioLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:underline"
              >
                {application.portfolioLink}
              </a>
            </div>
          )}

          {/* Feedback */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">
              Feedback {action === 'reject' && <span className="text-red-500">*</span>}
            </h3>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              placeholder={
                action === 'approve'
                  ? 'Optional: Add encouraging feedback for the student'
                  : action === 'reject'
                  ? 'Required: Please explain why the application is being rejected'
                  : 'Feedback for the student'
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setAction('reject');
                setTimeout(handleSubmit, 100);
              }}
              className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
            >
              Reject
            </button>
            <button
              onClick={() => {
                setAction('approve');
                setTimeout(handleSubmit, 100);
              }}
              className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
            >
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
