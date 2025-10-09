'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { JobListing, Certificate } from '@/types/user';
import { Briefcase, MapPin, DollarSign, Clock, Building2, Send, CheckCircle2 } from 'lucide-react';

export default function JobDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const jobId = params?.id as string;

  const [job, setJob] = useState<JobListing | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [cvUrl, setCvUrl] = useState('');
  const [selectedCerts, setSelectedCerts] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (jobId) {
      fetchJob();
      fetchCertificates();
      checkIfApplied();
    }
  }, [jobId]);

  const fetchJob = async () => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`);
      if (response.ok) {
        setJob(await response.json());
      }
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCertificates = async () => {
    try {
      const response = await fetch('/api/certificates');
      if (response.ok) {
        setCertificates(await response.json());
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
    }
  };

  const checkIfApplied = async () => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/check-application`);
      if (response.ok) {
        const data = await response.json();
        setApplied(data.applied);
      }
    } catch (error) {
      // Not applied yet
    }
  };

  const handleApply = async () => {
    if (!coverLetter.trim()) {
      setError('Please write a cover letter');
      return;
    }

    setApplying(true);
    setError('');

    try {
      const response = await fetch(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coverLetter,
          cvUrl,
          linkedCertificates: selectedCerts
        })
      });

      if (response.ok) {
        setSuccess('Application submitted successfully!');
        setApplied(true);
        setTimeout(() => router.push('/applications'), 2000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to submit application');
      }
    } catch (error) {
      setError('An error occurred while submitting');
    } finally {
      setApplying(false);
    }
  };

  const toggleCertificate = (certId: string) => {
    setSelectedCerts(prev =>
      prev.includes(certId) ? prev.filter(id => id !== certId) : [...prev, certId]
    );
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007F4E] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job not found</h2>
          <Link href="/jobs" className="text-[#3DB2FF] hover:underline">
            ← Back to jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/jobs" className="text-[#3DB2FF] hover:underline mb-4 inline-block">
          ← Back to jobs
        </Link>

        {/* Job Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <Building2 className="w-5 h-5" />
                  <span className="font-medium text-lg">{job.company}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-5 h-5" />
                  <span>{job.location} ({job.locationType})</span>
                </div>
              </div>
            </div>
            {job.salary && (
              <div className="text-right">
                <div className="text-sm text-gray-600">Salary</div>
                <div className="text-xl font-bold text-[#007F4E]">{job.salary}</div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
              {job.jobType}
            </span>
            {job.skills.map((skill, idx) => (
              <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
            {job.deadline && (
              <>
                <span>•</span>
                <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
              </>
            )}
            <span>•</span>
            <span>{job.applicationsCount} applications</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Job Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Responsibilities</h2>
              <ul className="list-disc list-inside space-y-2">
                {job.responsibilities.map((resp, idx) => (
                  <li key={idx} className="text-gray-700">{resp}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
              <ul className="list-disc list-inside space-y-2">
                {job.requirements.map((req, idx) => (
                  <li key={idx} className="text-gray-700">{req}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Application Form */}
          <div>
            {applied ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 sticky top-4">
                <div className="flex items-center gap-2 text-green-800 mb-2">
                  <CheckCircle2 className="w-6 h-6" />
                  <h3 className="font-bold text-lg">Already Applied</h3>
                </div>
                <p className="text-green-700 mb-4">
                  You've already applied to this position. Track your application status in your dashboard.
                </p>
                <Link
                  href="/applications"
                  className="block w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-center font-semibold"
                >
                  View Applications
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Apply for this job</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block font-semibold text-gray-900 mb-2">
                      Cover Letter *
                    </label>
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      rows={6}
                      placeholder="Tell us why you're a great fit for this role..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3DB2FF]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-900 mb-2">
                      CV/Resume URL (optional)
                    </label>
                    <input
                      type="url"
                      value={cvUrl}
                      onChange={(e) => setCvUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3DB2FF]"
                    />
                  </div>

                  {certificates.length > 0 && (
                    <div>
                      <label className="block font-semibold text-gray-900 mb-2">
                        Link Certificates (optional)
                      </label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {certificates.map((cert) => (
                          <label key={cert.id} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedCerts.includes(cert.id)}
                              onChange={() => toggleCertificate(cert.id)}
                            />
                            <span className="text-sm text-gray-700">{cert.courseTitle}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  )}

                  {success && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">{success}</p>
                    </div>
                  )}

                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className={`w-full px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                      applying ? 'bg-gray-300 text-gray-500' : 'bg-[#007F4E] text-white hover:bg-[#006A42]'
                    }`}
                  >
                    {applying ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit Application
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
