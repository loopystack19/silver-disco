'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  ArrowLeft,
  CheckCircle,
  Circle,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  PlayCircle,
  FileText,
  Award,
  Clock,
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'reading' | 'assignment';
  duration: number;
  order: number;
  videoUrl?: string;
  content?: string;
  isPreview?: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
  provider: { name: string; url: string };
  lessons: Lesson[];
  certificate: boolean;
}

interface Enrollment {
  id: string;
  progressPercent: number;
  lessonsCompleted: number;
  totalLessons: number;
  lessonProgress: Record<string, { completed: boolean; completedAt: string | null }>;
}

export default function LearnCoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [markingComplete, setMarkingComplete] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push(`/login?redirect=/learn/courses/${params.courseId}/learn`);
      return;
    }
    fetchCourseAndEnrollment();
  }, [params.courseId, session]);

  const fetchCourseAndEnrollment = async () => {
    try {
      // Fetch course
      const courseRes = await fetch(`/api/learn/courses/${params.courseId}`);
      const courseData = await courseRes.json();

      if (courseData.success) {
        setCourse(courseData.course);
      }

      // Fetch enrollment
      const enrollRes = await fetch('/api/learn/enroll');
      const enrollData = await enrollRes.json();

      if (enrollData.success) {
        const userEnrollment = enrollData.enrollments.find(
          (e: any) => e.courseId === params.courseId
        );

        if (!userEnrollment) {
          // Not enrolled, redirect to course detail page
          router.push(`/learn/courses/${params.courseId}`);
          return;
        }

        setEnrollment(userEnrollment);

        // Find first incomplete lesson or start at beginning
        const firstIncompleteIndex = courseData.course.lessons.findIndex(
          (lesson: Lesson) => !userEnrollment.lessonProgress?.[lesson.id]?.completed
        );
        if (firstIncompleteIndex !== -1) {
          setCurrentLessonIndex(firstIncompleteIndex);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    if (!enrollment || !course) return;

    const currentLesson = course.lessons[currentLessonIndex];
    const isCurrentlyComplete = enrollment.lessonProgress?.[currentLesson.id]?.completed;

    setMarkingComplete(true);
    try {
      const res = await fetch(`/api/learn/progress/${enrollment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: currentLesson.id,
          completed: !isCurrentlyComplete,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setEnrollment(data.enrollment);

        // If course completed, generate certificate and redirect
        if (data.progressPercent === 100) {
          // Generate certificate
          const certRes = await fetch('/api/learn/certificates/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ enrollmentId: enrollment.id }),
          });

          const certData = await certRes.json();

          if (certData.success) {
            alert('🎉 Congratulations! You have completed this course! Your certificate has been generated.');
            router.push('/dashboard/learners/certificates');
          } else {
            alert('🎉 Congratulations! You have completed this course!');
            router.push('/dashboard/learners');
          }
          return;
        }
      } else {
        alert(data.error || 'Failed to update progress');
      }
    } catch (error) {
      console.error('Error marking lesson complete:', error);
      alert('Failed to update progress');
    } finally {
      setMarkingComplete(false);
    }
  };

  const goToNextLesson = () => {
    if (course && currentLessonIndex < course.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const goToPreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course || !enrollment) {
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

  const currentLesson = course.lessons[currentLessonIndex];
  const isLessonComplete = enrollment.lessonProgress?.[currentLesson.id]?.completed || false;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push(`/learn/courses/${params.courseId}`)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Course
            </button>

            <div className="flex items-center gap-6">
              <div className="text-sm">
                <span className="text-gray-600">Progress:</span>
                <span className="font-semibold text-blue-600 ml-2">
                  {enrollment.progressPercent}%
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Lessons:</span>
                <span className="font-semibold text-gray-900 ml-2">
                  {enrollment.lessonsCompleted} / {enrollment.totalLessons}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${enrollment.progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Title */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
              <p className="text-gray-600">{course.provider.name}</p>
            </div>

            {/* Lesson Content */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                {currentLesson.type === 'video' ? (
                  <PlayCircle className="w-6 h-6 text-blue-600" />
                ) : currentLesson.type === 'assignment' ? (
                  <FileText className="w-6 h-6 text-purple-600" />
                ) : (
                  <BookOpen className="w-6 h-6 text-green-600" />
                )}
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Lesson {currentLessonIndex + 1}: {currentLesson.title}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{currentLesson.duration} minutes</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-6">{currentLesson.description}</p>

              {/* Video Embed */}
              {currentLesson.type === 'video' && currentLesson.videoUrl && (
                <div className="mb-6">
                  <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                    <iframe
                      src={currentLesson.videoUrl.replace('watch?v=', 'embed/')}
                      className="w-full h-full"
                      allowFullScreen
                      title={currentLesson.title}
                    />
                  </div>
                </div>
              )}

              {/* Reading Content */}
              {currentLesson.type === 'reading' && currentLesson.content && (
                <div className="prose max-w-none mb-6">
                  <p className="text-gray-700 whitespace-pre-wrap">{currentLesson.content}</p>
                </div>
              )}

              {/* Mark Complete Button */}
              <div className="flex items-center justify-between pt-6 border-t">
                <button
                  onClick={handleMarkComplete}
                  disabled={markingComplete}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                    isLessonComplete
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  } disabled:bg-gray-400`}
                >
                  {isLessonComplete ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Completed
                    </>
                  ) : (
                    <>
                      <Circle className="w-5 h-5" />
                      Mark as Complete
                    </>
                  )}
                </button>

                {course.certificate && enrollment.progressPercent === 100 && (
                  <button
                    onClick={() => router.push('/dashboard/learners/certificates')}
                    className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition"
                  >
                    <Award className="w-5 h-5" />
                    View Certificate
                  </button>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={goToPreviousLesson}
                disabled={currentLessonIndex === 0}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous Lesson
              </button>

              <button
                onClick={goToNextLesson}
                disabled={currentLessonIndex === course.lessons.length - 1}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Next Lesson
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sidebar - Lessons List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="font-bold text-gray-900 mb-4">Course Content</h3>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {course.lessons.map((lesson, index) => {
                  const isComplete = enrollment.lessonProgress?.[lesson.id]?.completed;
                  const isCurrent = index === currentLessonIndex;

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setCurrentLessonIndex(index)}
                      className={`w-full text-left p-3 rounded-lg transition ${
                        isCurrent
                          ? 'bg-blue-50 border-2 border-blue-600'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {isComplete ? (
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${
                            isCurrent ? 'text-blue-600' : 'text-gray-900'
                          }`}>
                            {index + 1}. {lesson.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {lesson.duration} min
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
