'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

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
  lessons: Lesson[];
}

interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  progress: number;
  completedLessons: string[];
  currentLessonId: string;
  completed: boolean;
}

export default function LearnPage() {
  const router = useRouter();
  const params = useParams();
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [completingLesson, setCompletingLesson] = useState(false);

  useEffect(() => {
    if (params.enrollmentId) {
      fetchEnrollmentAndCourse();
    }
  }, [params.enrollmentId]);

  const fetchEnrollmentAndCourse = async () => {
    try {
      setLoading(true);

      // Fetch enrollment
      const enrollmentResponse = await fetch(`/api/enrollments/${params.enrollmentId}`);
      const enrollmentData = await enrollmentResponse.json();

      if (!enrollmentData.success) {
        console.error('Enrollment not found');
        return;
      }

      setEnrollment(enrollmentData.enrollment);

      // Fetch course
      const courseResponse = await fetch(`/api/courses/${enrollmentData.enrollment.courseId}`);
      const courseData = await courseResponse.json();

      if (courseData.success) {
        setCourse(courseData.course);

        // Set current lesson
        const lesson = courseData.course.lessons.find(
          (l: Lesson) => l.id === enrollmentData.enrollment.currentLessonId
        ) || courseData.course.lessons[0];

        setCurrentLesson(lesson);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteLesson = async () => {
    if (!enrollment || !currentLesson || !course) return;

    setCompletingLesson(true);
    try {
      const response = await fetch(`/api/enrollments/${enrollment.id}/progress`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: currentLesson.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setEnrollment(data.enrollment);

        // If course is completed, show congratulations
        if (data.enrollment.completed) {
          alert('Congratulations! You have completed the course!');
          router.push(`/dashboard/learners/courses/${course.id}`);
        } else {
          // Move to next lesson
          const currentIndex = course.lessons.findIndex(l => l.id === currentLesson.id);
          if (currentIndex < course.lessons.length - 1) {
            setCurrentLesson(course.lessons[currentIndex + 1]);
          }
        }
      }
    } catch (error) {
      console.error('Error completing lesson:', error);
      alert('Failed to mark lesson as complete');
    } finally {
      setCompletingLesson(false);
    }
  };

  const handleNavigateLesson = (direction: 'prev' | 'next') => {
    if (!course || !currentLesson) return;

    const currentIndex = course.lessons.findIndex(l => l.id === currentLesson.id);

    if (direction === 'prev' && currentIndex > 0) {
      setCurrentLesson(course.lessons[currentIndex - 1]);
    } else if (direction === 'next' && currentIndex < course.lessons.length - 1) {
      setCurrentLesson(course.lessons[currentIndex + 1]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#007F4E]"></div>
      </div>
    );
  }

  if (!enrollment || !course || !currentLesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Content not found</h2>
          <button
            onClick={() => router.push('/dashboard/learners')}
            className="text-[#007F4E] hover:underline"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentIndex = course.lessons.findIndex(l => l.id === currentLesson.id);
  const isLastLesson = currentIndex === course.lessons.length - 1;
  const isLessonCompleted = enrollment.completedLessons.includes(currentLesson.id);
  const progressPercentage = Math.round((enrollment.completedLessons.length / course.lessons.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push(`/dashboard/learners/courses/${course.id}`)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Course
            </button>

            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Lesson {currentIndex + 1} of {course.lessons.length}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#007F4E] h-2 rounded-full transition-all"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-[#007F4E]">
                  {progressPercentage}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Course Content */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">{course.title}</h3>
              <div className="space-y-2">
                {course.lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => setCurrentLesson(lesson)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      lesson.id === currentLesson.id
                        ? 'bg-[#007F4E] text-white'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0 mt-1">
                        {enrollment.completedLessons.includes(lesson.id) ? (
                          <CheckCircle className={`w-4 h-4 ${
                            lesson.id === currentLesson.id ? 'text-white' : 'text-[#007F4E]'
                          }`} />
                        ) : (
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            lesson.id === currentLesson.id ? 'border-white' : 'border-gray-300'
                          }`} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          lesson.id === currentLesson.id ? 'text-white' : 'text-gray-900'
                        }`}>
                          {index + 1}. {lesson.title}
                        </p>
                        <p className={`text-xs mt-1 ${
                          lesson.id === currentLesson.id ? 'text-white opacity-80' : 'text-gray-500'
                        }`}>
                          {lesson.duration} min
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
              {/* Lesson Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Clock className="w-4 h-4" />
                  <span>{currentLesson.duration} minutes</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {currentLesson.title}
                </h1>
                {isLessonCompleted && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#007F4E] bg-opacity-10 text-[#007F4E] rounded-full text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Completed
                  </div>
                )}
              </div>

              {/* Lesson Content */}
              <div className="prose max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({ node, ...props }) => <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-4" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2" {...props} />,
                    p: ({ node, ...props }) => <p className="text-gray-700 mb-4 leading-relaxed" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700" {...props} />,
                    li: ({ node, ...props }) => <li className="ml-4" {...props} />,
                    code: ({ node, inline, ...props }: any) => 
                      inline ? (
                        <code className="bg-gray-100 text-[#007F4E] px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
                      ) : (
                        <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono my-4" {...props} />
                      ),
                    pre: ({ node, ...props }) => <pre className="my-4" {...props} />,
                  }}
                >
                  {currentLesson.content}
                </ReactMarkdown>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => handleNavigateLesson('prev')}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>

              {!isLessonCompleted ? (
                <button
                  onClick={handleCompleteLesson}
                  disabled={completingLesson}
                  className="px-6 py-3 bg-[#007F4E] hover:bg-[#005A36] text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {completingLesson
                    ? 'Saving...'
                    : isLastLesson
                    ? 'Complete Course'
                    : 'Mark Complete & Continue'}
                </button>
              ) : (
                <button
                  onClick={() => handleNavigateLesson('next')}
                  disabled={isLastLesson}
                  className="flex items-center gap-2 px-6 py-3 bg-[#007F4E] hover:bg-[#005A36] text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Lesson
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
