'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProjectSubmission, Project } from '@/types/user';
import { CheckCircle2, XCircle, Clock, Eye, ExternalLink, AlertCircle } from 'lucide-react';

export default function VerificationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);
  const [projects, setProjects] = useState<Record<string, Project>>({});
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ProjectSubmission | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationForm, setVerificationForm] = useState({
    functionalityVerified: false,
    skillLevelVerified: false,
    originalWorkVerified: false,
    approved: true,
    comments: ''
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      // Fetch all submissions
      const db = await fetch('/api/projects/submissions');
      
      // For now, we'll fetch projects and filter submissions
      const projectsRes = await fetch('/api/projects');
      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        const projectsMap: Record<string, Project> = {};
        projectsData.forEach((p: Project) => {
          projectsMap[p.id] = p;
        });
        setProjects(projectsMap);
      }
      
      // We need to create an endpoint to get all submissions
      // For now, let's create a simple fetch
      const response = await fetch('/api/submissions');
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = (submission: ProjectSubmission) => {
    setSelectedSubmission(submission);
    setVerificationForm({
      functionalityVerified: false,
      skillLevelVerified: false,
      originalWorkVerified: false,
      approved: true,
      comments: ''
    });
    setShowModal(true);
  };

  const submitVerification = async () => {
    if (!selectedSubmission) return;
    
    // Validate all checkboxes
    if (!verificationForm.functionalityVerified || 
        !verificationForm.skillLevelVerified || 
        !verificationForm.originalWorkVerified) {
      alert('All integrity checks must be verified');
      return;
    }

    setVerifying(true);
    try {
      const response = await fetch('/api/verifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: selectedSubmission.id,
          ...verificationForm
        })
      });

      if (response.ok) {
        alert('Verification submitted successfully!');
        setShowModal(false);
        fetchSubmissions(); // Refresh list
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to verify submission');
      }
    } catch (error) {
      alert('An error occurred while verifying');
    } finally {
      setVerifying(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-yellow-100 text-yellow-800';
      case 'verified': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007F4E] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  const submittedSubmissions = submissions.filter(s => s.status === 'submitted');
  const verifiedSubmissions = submissions.filter(s => s.status === 'verified');
  const rejectedSubmissions = submissions.filter(s => s.status === 'rejected');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Project Verifications</h1>
              <p className="mt-2 text-gray-600">Review and verify student project submissions</p>
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

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Verification</p>
                <p className="text-3xl font-bold text-yellow-600">{submittedSubmissions.length}</p>
              </div>
              <Clock className="w-12 h-12 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Verified</p>
                <p className="text-3xl font-bold text-green-600">{verifiedSubmissions.length}</p>
              </div>
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-3xl font-bold text-red-600">{rejectedSubmissions.length}</p>
              </div>
              <XCircle className="w-12 h-12 text-red-500" />
            </div>
          </div>
        </div>

        {/* Pending Submissions */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-gray-900">Pending Verification</h2>
          </div>
          <div className="divide-y">
            {submittedSubmissions.length === 0 ? (
              <div className="p-8 text-center">
                <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No submissions pending verification</p>
              </div>
            ) : (
              submittedSubmissions.map((submission) => (
                <div key={submission.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {submission.projectTitle}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(submission.status)}`}>
                          {submission.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">
                        <span className="font-medium">Student:</span> {submission.studentName} ({submission.studentEmail})
                      </p>
                      <p className="text-gray-600 mb-2">
                        <span className="font-medium">Submitted:</span> {new Date(submission.submittedAt!).toLocaleDateString()}
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <a
                          href={submission.deliverableLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[#3DB2FF] hover:underline"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View Deliverable
                        </a>
                      </div>
                      <div className="mt-3 p-3 bg-gray-50 rounded">
                        <p className="text-sm font-medium text-gray-900 mb-1">Impact Statement:</p>
                        <p className="text-sm text-gray-700 italic">"{submission.impactStatement}"</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleVerify(submission)}
                      className="ml-4 px-4 py-2 bg-[#007F4E] text-white rounded-lg hover:bg-[#006A42] flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Review & Verify
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Verification History */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-gray-900">Verification History</h2>
          </div>
          <div className="divide-y max-h-96 overflow-y-auto">
            {[...verifiedSubmissions, ...rejectedSubmissions].length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-600">No verification history yet</p>
              </div>
            ) : (
              [...verifiedSubmissions, ...rejectedSubmissions].map((submission) => (
                <div key={submission.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{submission.projectTitle}</h4>
                      <p className="text-sm text-gray-600">{submission.studentName}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(submission.status)}`}>
                        {submission.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(submission.verifiedAt!).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      {showModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Verify Submission</h2>
              <p className="text-gray-600 mt-1">{selectedSubmission.projectTitle}</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Student Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Student Information</h3>
                <p className="text-gray-700">{selectedSubmission.studentName}</p>
                <p className="text-sm text-gray-600">{selectedSubmission.studentEmail}</p>
              </div>

              {/* Deliverable Link */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Deliverable</h3>
                <a
                  href={selectedSubmission.deliverableLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#3DB2FF] hover:underline flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  {selectedSubmission.deliverableLink}
                </a>
              </div>

              {/* Impact Statement */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Impact Statement</h3>
                <p className="text-gray-700 italic">"{selectedSubmission.impactStatement}"</p>
              </div>

              {/* Project Brief Link */}
              <div>
                <Link
                  href={`/projects/${selectedSubmission.projectId}`}
                  target="_blank"
                  className="text-[#3DB2FF] hover:underline flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Original Project Brief
                </Link>
              </div>

              {/* Integrity Checkboxes */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  Mandatory Integrity Checks
                </h3>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={verificationForm.functionalityVerified}
                      onChange={(e) => setVerificationForm({...verificationForm, functionalityVerified: e.target.checked})}
                      className="mt-1"
                    />
                    <span className="text-gray-700">
                      I have verified the submission is functional and matches the original brief
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={verificationForm.skillLevelVerified}
                      onChange={(e) => setVerificationForm({...verificationForm, skillLevelVerified: e.target.checked})}
                      className="mt-1"
                    />
                    <span className="text-gray-700">
                      The work demonstrates the expected level of skill
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={verificationForm.originalWorkVerified}
                      onChange={(e) => setVerificationForm({...verificationForm, originalWorkVerified: e.target.checked})}
                      className="mt-1"
                    />
                    <span className="text-gray-700">
                      The work is the student's original effort
                    </span>
                  </label>
                </div>
              </div>

              {/* Approval */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Decision</h3>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={verificationForm.approved}
                      onChange={() => setVerificationForm({...verificationForm, approved: true})}
                    />
                    <span className="text-green-700 font-medium">Approve</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={!verificationForm.approved}
                      onChange={() => setVerificationForm({...verificationForm, approved: false})}
                    />
                    <span className="text-red-700 font-medium">Reject</span>
                  </label>
                </div>
              </div>

              {/* Comments */}
              <div>
                <label className="block font-semibold text-gray-900 mb-2">
                  Comments {!verificationForm.approved && <span className="text-red-600">*</span>}
                </label>
                <textarea
                  value={verificationForm.comments}
                  onChange={(e) => setVerificationForm({...verificationForm, comments: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3DB2FF]"
                  placeholder={verificationForm.approved ? "Optional feedback for the student..." : "Required: Explain why the submission needs revision..."}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t flex items-center justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={submitVerification}
                disabled={verifying}
                className={`px-6 py-2 rounded-lg font-semibold ${
                  verifying ? 'bg-gray-300 text-gray-500' : 'bg-[#007F4E] text-white hover:bg-[#006A42]'
                }`}
              >
                {verifying ? 'Submitting...' : 'Submit Verification'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
