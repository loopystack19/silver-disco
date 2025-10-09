'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Project, ProjectSubmission, Deliverable } from '@/types/user';
import { 
  CheckCircle2, Circle, Clock, ExternalLink, ChevronDown, ChevronUp,
  AlertCircle, Send, Link as LinkIcon, FileText, Eye
} from 'lucide-react';

export default function ProjectSprintPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [submission, setSubmission] = useState<ProjectSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    client: true,
    data: true,
    deliverables: true,
    feedback: false
  });
  const [deliverableLink, setDeliverableLink] = useState('');
  const [impactStatement, setImpactStatement] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (projectId) {
      fetchProject();
      fetchSubmission();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmission = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/progress`);
      if (response.ok) {
        const data = await response.json();
        setSubmission(data);
        setDeliverableLink(data.deliverableLink || '');
        setImpactStatement(data.impactStatement || '');
      }
    } catch (error) {
      // No submission yet, that's fine
    }
  };

  const handleStartSprint = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/start`, {
        method: 'POST'
      });

      if (response.ok) {
        const data = await response.json();
        setSubmission(data);
        setSuccess('Sprint started! Begin working on your deliverables.');
      } else {
        const errorData = await response.json();
        if (errorData.submission) {
          setSubmission(errorData.submission);
        } else {
          setError(errorData.error || 'Failed to start sprint');
        }
      }
    } catch (error) {
      setError('An error occurred while starting the sprint');
    }
  };

  const toggleDeliverable = async (deliverableId: string) => {
    if (!submission) return;

    const isCompleted = submission.completedDeliverables.includes(deliverableId);
    const updatedDeliverables = isCompleted
      ? submission.completedDeliverables.filter(id => id !== deliverableId)
      : [...submission.completedDeliverables, deliverableId];

    try {
      const response = await fetch(`/api/projects/${projectId}/progress`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completedDeliverables: updatedDeliverables })
      });

      if (response.ok) {
        const data = await response.json();
        setSubmission(data);
      }
    } catch (error) {
      console.error('Error updating deliverable:', error);
    }
  };

  const revealFeedback = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/progress`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedbackRevealed: true })
      });

      if (response.ok) {
        const data = await response.json();
        setSubmission(data);
        setExpandedSections({ ...expandedSections, feedback: true });
      }
    } catch (error) {
      console.error('Error revealing feedback:', error);
    }
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      // First update the link and statement
      await fetch(`/api/projects/${projectId}/progress`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deliverableLink,
          impactStatement
        })
      });

      // Then submit
      const response = await fetch(`/api/projects/${projectId}/progress`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'submitted',
          deliverableLink,
          impactStatement
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSubmission(data);
        setSuccess('Sprint submitted successfully! Awaiting lecturer verification.');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to submit sprint');
      }
    } catch (error) {
      setError('An error occurred while submitting');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections({ ...expandedSections, [section]: !expandedSections[section] });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_started': return 'text-gray-500';
      case 'in_progress': return 'text-blue-500';
      case 'submitted': return 'text-yellow-500';
      case 'verified': return 'text-green-500';
      case 'rejected': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'not_started': return 'Not Started';
      case 'in_progress': return 'In Progress';
      case 'submitted': return 'Submitted';
      case 'under_review': return 'Under Review';
      case 'verified': return 'Verified';
      case 'rejected': return 'Rejected';
      default: return 'Unknown';
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007F4E] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project not found</h2>
          <Link href="/projects" className="text-[#3DB2FF] hover:underline">
            ← Back to projects
          </Link>
        </div>
      </div>
    );
  }

  const progress = submission 
    ? Math.round((submission.completedDeliverables.length / project.deliverables.length) * 100)
    : 0;

  const canSubmit = submission && 
    deliverableLink && 
    impactStatement && 
    impactStatement.length <= 200 &&
    submission.feedbackRevealed &&
    submission.status === 'in_progress';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar: Status Tracker (Fixed) */}
      <div className="w-80 bg-white border-r border-gray-200 fixed left-0 top-0 h-screen overflow-y-auto">
        <div className="p-6">
          {/* Back Button */}
          <Link
            href="/projects"
            className="text-[#3DB2FF] hover:underline mb-4 inline-block"
          >
            ← All Projects
          </Link>

          {/* Progress Circle */}
          <div className="mb-6">
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#E5E7EB"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#3DB2FF"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">{progress}%</span>
              </div>
            </div>
            <p className={`text-center mt-2 font-semibold ${getStatusColor(submission?.status || 'not_started')}`}>
              {getStatusText(submission?.status || 'not_started')}
            </p>
          </div>

          {/* Key Details */}
          <div className="mb-6 space-y-3">
            <div>
              <p className="text-sm text-gray-600">Role</p>
              <p className="font-semibold text-gray-900">{project.role}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Estimated Time</p>
              <p className="font-semibold text-gray-900">{project.estimatedHours} hours</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Data Source</p>
              <a
                href={project.dataSourceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#3DB2FF] hover:underline flex items-center gap-1"
              >
                {project.dataSource}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Start Sprint Button or Deliverables Checklist */}
          {!submission ? (
            <button
              onClick={handleStartSprint}
              className="w-full px-4 py-3 bg-[#3DB2FF] text-white rounded-lg hover:bg-[#2A9DE8] font-semibold"
            >
              Start Sprint
            </button>
          ) : (
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Deliverables Checklist</h3>
              <p className="text-xs text-gray-600 mb-3">
                Personal tracking only. All deliverables must be completed before submission.
              </p>
              <div className="space-y-2">
                {project.deliverables.map((deliverable) => (
                  <button
                    key={deliverable.id}
                    onClick={() => toggleDeliverable(deliverable.id)}
                    className="w-full flex items-start gap-2 p-2 hover:bg-gray-50 rounded text-left"
                    disabled={submission.status !== 'in_progress'}
                  >
                    {submission.completedDeliverables.includes(deliverable.id) ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    )}
                    <span className="text-sm text-gray-700">{deliverable.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Status Messages */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          {success && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area: The Structured Brief (Scrollable) */}
      <div className="ml-80 flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{project.title}</h1>
          <p className="text-gray-600 mb-8">Follow the structured brief below to complete your sprint</p>

          {/* The Client & Goal */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <button
              onClick={() => toggleSection('client')}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50"
            >
              <h2 className="text-2xl font-bold text-gray-900">The Client & Goal</h2>
              {expandedSections.client ? (
                <ChevronUp className="w-6 h-6 text-gray-500" />
              ) : (
                <ChevronDown className="w-6 h-6 text-gray-500" />
              )}
            </button>
            {expandedSections.client && (
              <div className="px-6 pb-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Client Background</h3>
                  <p className="text-gray-700 whitespace-pre-line">{project.clientBackground}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Project Objective</h3>
                  <p className="text-gray-700 whitespace-pre-line">{project.projectGoal}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Business Value</h3>
                  <p className="text-gray-700 whitespace-pre-line">{project.businessValue}</p>
                </div>
              </div>
            )}
          </div>

          {/* Source Data & Tools */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <button
              onClick={() => toggleSection('data')}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50"
            >
              <h2 className="text-2xl font-bold text-gray-900">Source Data & Tools</h2>
              {expandedSections.data ? (
                <ChevronUp className="w-6 h-6 text-gray-500" />
              ) : (
                <ChevronDown className="w-6 h-6 text-gray-500" />
              )}
            </button>
            {expandedSections.data && (
              <div className="px-6 pb-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Data Source</h3>
                  <a
                    href={project.dataSourceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#3DB2FF] text-white rounded-lg hover:bg-[#2A9DE8]"
                  >
                    Access {project.dataSource} Data
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Required Tools</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.requiredTools.map((tool, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Detailed Deliverables */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <button
              onClick={() => toggleSection('deliverables')}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50"
            >
              <h2 className="text-2xl font-bold text-gray-900">Detailed Deliverables</h2>
              {expandedSections.deliverables ? (
                <ChevronUp className="w-6 h-6 text-gray-500" />
              ) : (
                <ChevronDown className="w-6 h-6 text-gray-500" />
              )}
            </button>
            {expandedSections.deliverables && (
              <div className="px-6 pb-6 space-y-4">
                <div className="space-y-4">
                  {project.deliverables.map((deliverable, idx) => (
                    <div key={deliverable.id} className="border-l-4 border-[#3DB2FF] pl-4">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {idx + 1}. {deliverable.title}
                      </h3>
                      <p className="text-gray-700">{deliverable.description}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Specifications</h3>
                  <p className="text-gray-700 whitespace-pre-line">{project.detailedRequirements}</p>
                </div>
              </div>
            )}
          </div>

          {/* Simulated Stakeholder Review */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Simulated Stakeholder Review</h2>
                {submission?.feedbackRevealed && (
                  expandedSections.feedback ? (
                    <ChevronUp
                      className="w-6 h-6 text-gray-500 cursor-pointer"
                      onClick={() => toggleSection('feedback')}
                    />
                  ) : (
                    <ChevronDown
                      className="w-6 h-6 text-gray-500 cursor-pointer"
                      onClick={() => toggleSection('feedback')}
                    />
                  )
                )}
              </div>
              
              {!submission?.feedbackRevealed ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <p className="text-gray-700 mb-4">
                    This section contains critical stakeholder feedback that simulates real-world revision requests.
                  </p>
                  <p className="text-sm text-gray-600 mb-6">
                    You must review this feedback before submitting your work to ensure you understand the iterative process.
                  </p>
                  <button
                    onClick={revealFeedback}
                    className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-semibold inline-flex items-center gap-2"
                    disabled={!submission || submission.status !== 'in_progress'}
                  >
                    <Eye className="w-5 h-5" />
                    Simulate 1st Draft Review
                  </button>
                </div>
              ) : expandedSections.feedback && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    Revision Requests
                  </h3>
                  <p className="text-gray-700 whitespace-pre-line">{project.stakeholderFeedback}</p>
                </div>
              )}
            </div>
          </div>

          {/* Submission Module */}
          {submission && submission.status === 'in_progress' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit Your Sprint</h2>

                <div className="space-y-6">
                  {/* Public Link Input */}
                  <div>
                    <label className="block font-semibold text-gray-900 mb-2">
                      Public Deliverable Link *
                    </label>
                    <p className="text-sm text-gray-600 mb-2">
                      Link to your GitHub repo, Figma design, Tableau Public dashboard, etc.
                    </p>
                    <input
                      type="url"
                      value={deliverableLink}
                      onChange={(e) => setDeliverableLink(e.target.value)}
                      placeholder="https://github.com/username/project or https://..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3DB2FF]"
                    />
                  </div>

                  {/* Impact Statement */}
                  <div>
                    <label className="block font-semibold text-gray-900 mb-2">
                      Draft Your Impact-Based CV Statement * (Max 200 characters)
                    </label>
                    <p className="text-sm text-gray-600 mb-2">
                      Write in Action-Result-Impact format. Example: "Analyzed sales data for 10K customers, identified 3 key trends, increased revenue forecasts by 15%"
                    </p>
                    <textarea
                      value={impactStatement}
                      onChange={(e) => setImpactStatement(e.target.value)}
                      maxLength={200}
                      rows={3}
                      placeholder="Your impact statement here..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3DB2FF]"
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      {impactStatement.length}/200 characters
                    </p>
                  </div>

                  {/* Validation Messages */}
                  {!submission.feedbackRevealed && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-yellow-800">
                        You must reveal and review the stakeholder feedback before submitting.
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={!canSubmit || submitting}
                    className={`w-full px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                      canSubmit && !submitting
                        ? 'bg-[#007F4E] text-white hover:bg-[#006A42]'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Complete & Submit Sprint
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Submitted Status */}
          {submission && submission.status !== 'in_progress' && (
            <div className={`p-6 rounded-lg ${
              submission.status === 'verified' ? 'bg-green-50 border border-green-200' :
              submission.status === 'rejected' ? 'bg-red-50 border border-red-200' :
              'bg-blue-50 border border-blue-200'
            }`}>
              <h3 className="font-bold text-lg mb-2">
                {submission.status === 'verified' && '✅ Sprint Verified!'}
                {submission.status === 'rejected' && '❌ Sprint Rejected'}
                {submission.status === 'submitted' && '⏳ Awaiting Verification'}
                {submission.status === 'under_review' && '👀 Under Review'}
              </h3>
              {submission.status === 'submitted' && (
                <p className="text-gray-700">
                  Your sprint has been submitted and is awaiting lecturer verification.
                </p>
              )}
              {submission.status === 'verified' && (
                <div>
                  <p className="text-gray-700 mb-2">
                    Your work has been verified by {submission.lecturerName}!
                  </p>
                  {submission.verificationNotes && (
                    <p className="text-gray-600 text-sm italic">"{submission.verificationNotes}"</p>
                  )}
                </div>
              )}
              {submission.status === 'rejected' && (
                <div>
                  <p className="text-gray-700 mb-2">
                    Your submission needs revision. Please review the feedback and resubmit.
                  </p>
                  {submission.verificationNotes && (
                    <p className="text-gray-600 text-sm italic">"{submission.verificationNotes}"</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
