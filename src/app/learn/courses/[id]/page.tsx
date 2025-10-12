'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Users,
  Star,
  Award,
  PlayCircle,
  CheckCircle,
  Globe,
  Calendar,
  TrendingUp,
  FileText,
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  provider: { name: string; url: string };
  instructors: string[];
  duration: string;
  durationHours: number;
  level: string;
  categories: string[];
  tags: string[];
  lessons: any[];
  image: string;
  sourceUrl: string;
  enrollmentCount: number;
  rating: number;
  language: string;
  subtitles: string[];
  certificate: boolean;
}

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);

  useEffect(() => {
    fetchCourse();
    if (session) {
      checkEnrollment();
    }
  }, [params.id, session]);

  const fetchCourse = async () => {
    try {
      const res = await fetch(`/api/learn/courses/${params.id}`);
      const data = await res.json();

      if (data.success) {
        setCourse(data.course);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const res = await fetch('/api/learn/enroll');
      const data = await res.json();

      if (data.success) {
        const enrolled = data.enrollments.some(
          (e: any) => e.courseId === params.id
        );
        setIsEnrolled(enrolled);
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const handleEnroll = async () => {
    if (!session) {
      router.push('/login?redirect=/learn/courses/' + params.id);
      return;
    }

    setEnrolling(true);
    try {
      const res = await fetch('/api/learn/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: params.id }),
      });

      const data = await res.json();

      if (data.success) {
        setIsEnrolled(true);
        alert('Successfully enrolled! Check your dashboard to start learning.');
        router.push('/dashboard/learners');
      } else {
        alert(data.error || 'Failed to enroll');
      }
    } catch (error) {
      alert('Error enrolling in course');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course not found</h2>
          <button
            onClick={() => router.push('/learn')}
            className="text-blue-600 hover:underline"
          >
            Back to courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => router.push('/learn')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                  {course.level}
                </span>
                <span className="text-sm text-white/80">{course.provider.name}</span>
              </div>

              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-blue-100 mb-6">{course.description}</p>

              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{course.rating.toFixed(1)}</span>
                  <span className="text-white/80">rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span className="font-semibold">
                    {(course.enrollmentCount / 1000).toFixed(1)}K
                  </span>
                  <span className="text-white/80">students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  <span className="font-semibold">{course.language}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-6">
                {course.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Enrollment Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 shadow-xl">
                <div className="aspect-video bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg mb-4 flex items-center justify-center">
                  <PlayCircle className="w-16 h-16 text-white" />
                </div>

                {isEnrolled ? (
                  <div className="space-y-3">
                    <button
                      onClick={() => router.push(`/learn/courses/${params.id}/learn`)}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <PlayCircle className="w-5 h-5" />
                      Continue Learning
                    </button>
                    <button
                      onClick={() => router.push('/dashboard/learners')}
                      className="w-full py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition flex items-center justify-center gap-2 border border-gray-300"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Go to Dashboard
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:bg-gray-400"
                  >
                    {enrolling ? 'Enrolling...' : 'Enroll for Free'}
                  </button>
                )}

                <div className="mt-4 space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Start anytime</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{course.durationHours} hours to complete</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>100% online</span>
                  </div>
                  {course.certificate && (
                    <div className="flex items-center gap-2 text-yellow-600 font-semibold">
                      <Award className="w-4 h-4" />
                      <span>Certificate upon completion</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <a
                    href={course.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm flex items-center gap-2"
                  >
                    <Globe className="w-4 h-4" />
                    View on {course.provider.name}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What You'll Learn */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                What You'll Learn
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.tags.slice(0, 6).map((skill) => (
                  <div key={skill} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Content */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Course Content
              </h2>
              <p className="text-gray-600 mb-6">
                {course.lessons.length} lessons • {course.duration}
              </p>

              <div className="space-y-2">
                {course.lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setExpandedLesson(
                          expandedLesson === lesson.id ? null : lesson.id
                        )
                      }
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center gap-3">
                        {lesson.type === 'video' ? (
                          <PlayCircle className="w-5 h-5 text-blue-600" />
                        ) : lesson.type === 'assignment' ? (
                          <FileText className="w-5 h-5 text-purple-600" />
                        ) : (
                          <BookOpen className="w-5 h-5 text-green-600" />
                        )}
                        <div className="text-left">
                          <p className="font-medium text-gray-900">
                            {lesson.title}
                          </p>
                          {lesson.isPreview && (
                            <span className="text-xs text-blue-600 font-semibold">
                              FREE PREVIEW
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">
                          {lesson.duration} min
                        </span>
                        <svg
                          className={`w-5 h-5 text-gray-400 transition-transform ${
                            expandedLesson === lesson.id ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </button>

                    {expandedLesson === lesson.id && (
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-700 text-sm mb-3">
                          {lesson.description}
                        </p>
                        {lesson.videoUrl && (
                          <a
                            href={lesson.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm flex items-center gap-2"
                          >
                            <PlayCircle className="w-4 h-4" />
                            Watch on YouTube
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Instructors */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Instructors
              </h2>
              <div className="space-y-4">
                {course.instructors.map((instructor) => (
                  <div key={instructor} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {instructor.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{instructor}</h3>
                      <p className="text-sm text-gray-600">{course.provider.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Skills You'll Gain */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Skills You'll Gain</h3>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Course Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Course Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Level</p>
                  <p className="font-semibold text-gray-900">{course.level}</p>
                </div>
                <div>
                  <p className="text-gray-600">Duration</p>
                  <p className="font-semibold text-gray-900">{course.duration}</p>
                </div>
                <div>
                  <p className="text-gray-600">Language</p>
                  <p className="font-semibold text-gray-900">{course.language}</p>
                </div>
                <div>
                  <p className="text-gray-600">Subtitles</p>
                  <p className="font-semibold text-gray-900">
                    {course.subtitles.join(', ')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
