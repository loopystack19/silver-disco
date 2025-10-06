'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Award, Download, Share2, CheckCircle, ArrowLeft } from 'lucide-react';

interface Certificate {
  id: string;
  courseTitle: string;
  completionDate: string;
  verificationCode: string;
  certificateUrl: string;
}

export default function CertificatesPage() {
  const router = useRouter();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await fetch('/api/certificates');
      const data = await response.json();

      if (data.success) {
        setCertificates(data.certificates);
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
          <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
          <p className="text-gray-600 mt-2">View and download your earned certificates</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#007F4E]"></div>
          </div>
        ) : certificates.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No certificates yet</h3>
            <p className="text-gray-600 mb-6">
              Complete courses to earn certificates
            </p>
            <button
              onClick={() => router.push('/dashboard/learners/courses')}
              className="px-6 py-3 bg-[#007F4E] hover:bg-[#005A36] text-white font-semibold rounded-lg transition"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((certificate) => (
              <div
                key={certificate.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Certificate Header */}
                <div className="bg-gradient-to-r from-[#007F4E] to-[#005A36] p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">
                        Certificate of Completion
                      </h3>
                      <p className="text-white text-opacity-90 text-sm">
                        UmojaHub Education
                      </p>
                    </div>
                  </div>
                  <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
                    <p className="text-white font-semibold text-sm mb-1">
                      Course Completed:
                    </p>
                    <h4 className="text-white font-bold text-xl">
                      {certificate.courseTitle}
                    </h4>
                  </div>
                </div>

                {/* Certificate Body */}
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Completion Date</p>
                      <p className="text-gray-900 font-medium">
                        {formatDate(certificate.completionDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Verification Code</p>
                      <div className="flex items-center gap-2">
                        <code className="text-[#007F4E] font-mono font-semibold bg-gray-100 px-3 py-1 rounded">
                          {certificate.verificationCode}
                        </code>
                        <CheckCircle className="w-5 h-5 text-[#007F4E]" />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => window.open(certificate.certificateUrl, '_blank')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#007F4E] hover:bg-[#005A36] text-white font-semibold rounded-lg transition"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      onClick={() => {
                        const shareText = `I just completed "${certificate.courseTitle}" on UmojaHub! Verification: ${certificate.verificationCode}`;
                        if (navigator.share) {
                          navigator.share({
                            title: 'My Certificate',
                            text: shareText,
                          });
                        } else {
                          navigator.clipboard.writeText(shareText);
                          alert('Certificate details copied to clipboard!');
                        }
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Banner */}
        {certificates.length > 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">About Your Certificates</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Each certificate includes a unique verification code</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Certificates can be shared on social media and professional networks</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Download as PDF for printing or digital portfolios</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
