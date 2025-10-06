'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Clock, Users, Star, BookOpen, CheckCircle, PlayCircle, Award } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Lesson {
  id: string;
  title: string;
  content: string;
  duration: number;
  type: string;
  order: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  instructor: string;
  instructorBio: string;
  image: string;
  lessons: Lesson[];
  enrollmentCount: number;
  rating: number;
}

interface Enrollment {
  id: string;
  courseId: string;
  progress: number;
  completedLessons: string[];
  completed: boolean;
}

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchCourse();
      checkEnrollment();
    }
  }, [params.id]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${params.id}`);
      const data = await response.json();

      if (data.success) {
        setCourse(data.course);
      } else {
        console.error('Course not found');
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    if (!session) return;

    try {
      const response = await fetch('/api/enrollments');
      const data = await response.json();

      if (data.success) {
        const existingEnrollment = data.enrollments.find(
          (e: Enrollment) => e.courseId === params.id
        );
        if (existingEnrollment) {
          setEnrollment(existingEnrollment);
        }
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const handleEnroll = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    setEnrolling(true);
    try {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: params.id }),
      });

      const data = await response.json();

      if (data.success) {
        setEnrollment(data.enrollment);
        alert('Successfully enrolled in course!');
      } else {
        alert(data.error || 'Failed to enroll');
      }
    } catch (error) {
      console.error('Error enrolling:', error);
      alert('Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  const handleStartCourse = () => {
    if (enrollment && course) {
      router.push(`/dashboard/learners/learn/${enrollment.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#007F4E]"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h2>
          <button
            onClick={() => router.push('/dashboard/learners/courses')}
            className="text-[#007F4E] hover:underline"
          >
            Back to courses
          </button>
        </div>
      </div>
    );
  }

  const totalLessons = course.lessons.length;
  const completedLessons = enrollment?.completedLessons.length || 0;
  const progressPercentage = enrollment ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => router.push('/dashboard/learners/courses')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-[#FFC107] text-gray-900 text-sm font-semibold rounded">
                  {course.category}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded">
                  {course.level}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {course.title}
              </h1>

              <p className="text-lg text-gray-600 mb-6">
                {course.description}
              </p>

              {/* Course Stats */}
              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{course.enrollmentCount} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-[#FFC107] text-[#FFC107]" />
                  <span>{course.rating} rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span>{totalLessons} lessons</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Instructor
                </h3>
                <p className="text-gray-900 font-medium mb-1">{course.instructor}</p>
                <p className="text-gray-600">{course.instructorBio}</p>
              </div>
            </div>

            {/* Course Content */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Course Content
              </h2>

              <div className="space-y-3">
                {course.lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-[#007F4E] transition"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {enrollment?.completedLessons.includes(lesson.id) ? (
                          <CheckCircle className="w-6 h-6 text-[#007F4E]" />
                        ) : (
                          <PlayCircle className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">
                              Lesson {index + 1}: {lesson.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {lesson.duration} minutes
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              {/* Course Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-[#007F4E] to-[#005A36] rounded-lg mb-6 flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-white opacity-50" />
              </div>

              {enrollment ? (
                <>
                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Your Progress
                      </span>
                      <span className="text-sm font-bold text-[#007F4E]">
                        {progressPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#007F4E] h-2 rounded-full transition-all"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {completedLessons} of {totalLessons} lessons completed
                    </p>
                  </div>

                  {/* Continue Learning Button */}
                  <button
                    onClick={handleStartCourse}
                    className="w-full bg-[#007F4E] hover:bg-[#005A36] text-white font-semibold py-3 px-4 rounded-lg transition mb-4"
                  >
                    {progressPercentage === 0 ? 'Start Learning' : 'Continue Learning'}
                  </button>

                  {enrollment.completed && (
                    <div className="bg-[#FFC107] bg-opacity-10 border border-[#FFC107] rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-5 h-5 text-[#007F4E]" />
                        <span className="font-semibold text-gray-900">
                          Course Completed!
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Congratulations! You've completed this course.
                      </p>
                      <button
                        onClick={() => router.push('/dashboard/learners/certificates')}
                        className="text-sm text-[#007F4E] hover:underline font-medium"
                      >
                        View Certificate →
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Enroll Button */}
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full bg-[#007F4E] hover:bg-[#005A36] text-white font-semibold py-3 px-4 rounded-lg transition mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                  </button>
                  <p className="text-sm text-gray-600 text-center">
                    Free course • No credit card required
                  </p>
                </>
              )}

              {/* What You'll Learn */}
              <div className="border-t pt-6 mt-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  What You'll Learn
                </h3>
                <ul className="space-y-2">
                  {course.lessons.slice(0, 4).map((lesson) => (
                    <li key={lesson.id} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-5 h-5 text-[#007F4E] flex-shrink-0 mt-0.5" />
                      <span>{lesson.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
