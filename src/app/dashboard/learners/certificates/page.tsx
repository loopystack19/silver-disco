'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Award, Download, ArrowLeft, Calendar, BookOpen, ExternalLink } from 'lucide-react';
import { generateCertificatePDF, downloadCertificate } from '@/lib/certificateGenerator';

interface Certificate {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  courseId: string;
  courseTitle: string;
  courseProvider: string;
  enrollmentId: string;
  completionDate: string;
  issuedAt: string;
}

export default function CertificatesPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      router.push('/login?redirect=/dashboard/learners/certificates');
      return;
    }
    fetchCertificates();
  }, [session]);

  const fetchCertificates = async () => {
    try {
      const res = await fetch('/api/learn/certificates/generate');
      const data = await res.json();

      if (data.success) {
        setCertificates(data.certificates);
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async (certificate: Certificate) => {
    setDownloading(certificate.id);
    try {
      const completionDate = new Date(certificate.completionDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const pdf = generateCertificatePDF({
        studentName: certificate.userName,
        courseTitle: certificate.courseTitle,
        provider: certificate.courseProvider,
        completionDate,
        certificateId: certificate.id,
      });

      const filename = `${certificate.courseTitle.replace(/[^a-z0-9]/gi, '_')}_Certificate.pdf`;
      downloadCertificate(pdf, filename);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Failed to download certificate');
    } finally {
      setDownloading(null);
    }
  };

  const handleViewCourse = (courseId: string) => {
    router.push(`/learn/courses/${courseId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => router.push('/dashboard/learners')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
              <p className="text-gray-600 mt-1">
                {certificates.length} {certificates.length === 1 ? 'certificate' : 'certificates'} earned
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {certificates.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Certificates Yet</h2>
            <p className="text-gray-600 mb-6">
              Complete a course to earn your first certificate!
            </p>
            <button
              onClick={() => router.push('/learn')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate) => (
              <div
                key={certificate.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all overflow-hidden border-2 border-gray-100"
              >
                {/* Certificate Preview */}
                <div className="h-48 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 flex items-center justify-center relative overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 translate-y-16"></div>
                  </div>

                  <div className="text-center z-10">
                    <Award className="w-16 h-16 text-white mx-auto mb-2" />
                    <p className="text-white text-sm font-semibold px-4">Certificate of Completion</p>
                  </div>

                  {/* Ribbon */}
                  <div className="absolute top-4 right-4">
                    <div className="w-10 h-12 bg-blue-600 rounded-sm shadow-lg relative">
                      <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[12px] border-t-blue-600 translate-y-full"></div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-lg">
                    {certificate.courseTitle}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BookOpen className="w-4 h-4" />
                      <span>{certificate.courseProvider}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(certificate.completionDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownloadCertificate(certificate)}
                      disabled={downloading === certificate.id}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:bg-gray-400"
                    >
                      <Download className="w-4 h-4" />
                      {downloading === certificate.id ? 'Downloading...' : 'Download'}
                    </button>
                    <button
                      onClick={() => handleViewCourse(certificate.courseId)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                      title="View Course"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 text-center">
                      Certificate ID: {certificate.id.slice(0, 8)}...
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        {certificates.length > 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">About Your Certificates</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Certificates are automatically generated when you complete a course</li>
              <li>• Download your certificates as PDF files to share with employers</li>
              <li>• Each certificate has a unique ID for verification</li>
              <li>• Certificates include your name, course title, and completion date</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
