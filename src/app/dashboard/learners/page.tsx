'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { BookOpen, Award, PlayCircle, Clock, TrendingUp, ArrowRight, LogOut, Star, Users } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Enrollment {
  id: string;
  courseId: string;
  courseTitle: string;
  progress: number;
  completedLessons: string[];
  completed: boolean;
}

interface Course {
  id: string;
  title: string;
  category: string;
  level: string;
  duration: string;
  enrollmentCount: number;
  rating: number;
}

export default function LearnersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch enrollments
      const enrollmentResponse = await fetch('/api/enrollments');
      const enrollmentData = await enrollmentResponse.json();
      if (enrollmentData.success) {
        setEnrollments(enrollmentData.enrollments);
      }

      // Fetch recommended courses
      const coursesResponse = await fetch('/api/courses?limit=3');
      const coursesData = await coursesResponse.json();
      if (coursesData.success) {
        setRecommendedCourses(coursesData.courses.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const inProgressCourses = enrollments.filter(e => !e.completed && e.progress > 0);
  const completedCourses = enrollments.filter(e => e.completed);
  const totalProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#007F4E]"></div>
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
              <h1 className="text-3xl font-bold text-gray-900">Learning Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {session?.user?.name || 'Learner'}!</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#007F4E] bg-opacity-10 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-[#007F4E]" />
              </div>
              <h3 className="font-semibold text-gray-900">Enrolled Courses</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{enrollments.length}</p>
            <p className="text-sm text-gray-600 mt-1">Total enrollments</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#FFC107] bg-opacity-20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#FFC107]" />
              </div>
              <h3 className="font-semibold text-gray-900">Overall Progress</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalProgress}%</p>
            <p className="text-sm text-gray-600 mt-1">Average completion</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-600 bg-opacity-10 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Certificates</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{completedCourses.length}</p>
            <p className="text-sm text-gray-600 mt-1">Courses completed</p>
          </div>
        </div>

        {/* Continue Learning Section */}
        {inProgressCourses.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Continue Learning</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressCourses.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
                  onClick={() => router.push(`/dashboard/learners/learn/${enrollment.id}`)}
                >
                  <div className="h-32 bg-gradient-to-br from-[#007F4E] to-[#005A36] flex items-center justify-center">
                    <PlayCircle className="w-12 h-12 text-white" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2">{enrollment.courseTitle}</h3>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-[#007F4E]">{enrollment.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#007F4E] h-2 rounded-full transition-all"
                        style={{ width: `${enrollment.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => router.push('/dashboard/learners/courses')}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow text-left"
          >
            <div className="w-12 h-12 bg-[#007F4E] rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Browse Courses</h3>
            <p className="text-sm text-gray-600 mb-4">
              Explore our catalog of courses
            </p>
            <div className="flex items-center text-[#007F4E] font-medium">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </button>

          <button
            onClick={() => router.push('/dashboard/learners/certificates')}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow text-left"
          >
            <div className="w-12 h-12 bg-[#FFC107] rounded-lg flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">My Certificates</h3>
            <p className="text-sm text-gray-600 mb-4">
              View your earned certificates
            </p>
            <div className="flex items-center text-[#007F4E] font-medium">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </button>

          <button
            onClick={() => router.push('/')}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow text-left"
          >
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Back to Home</h3>
            <p className="text-sm text-gray-600 mb-4">
              Return to the main dashboard
            </p>
            <div className="flex items-center text-[#007F4E] font-medium">
              Go Home <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </button>
        </div>

        {/* Recommended Courses */}
        {recommendedCourses.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
              <button
                onClick={() => router.push('/dashboard/learners/courses')}
                className="text-[#007F4E] hover:underline font-medium"
              >
                View All
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
                  onClick={() => router.push(`/dashboard/learners/courses/${course.id}`)}
                >
                  <div className="h-32 bg-gradient-to-br from-[#007F4E] to-[#005A36] flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-white opacity-50" />
                  </div>
                  <div className="p-4">
                    <div className="flex gap-2 mb-2">
                      <span className="px-2 py-1 bg-[#FFC107] text-gray-900 text-xs font-semibold rounded">
                        {course.category}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">
                        {course.level}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{course.enrollmentCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-[#FFC107] text-[#FFC107]" />
                        <span>{course.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
