/**
 * Education Hub Types - Coursera-style Learning Platform
 * Real courses from MIT OCW, YouTube, and other public sources
 */

// ===== COURSE TYPES =====

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type CourseCategory =
  | 'Technology'
  | 'Business'
  | 'Science'
  | 'Mathematics'
  | 'Engineering'
  | 'Arts & Humanities'
  | 'Social Sciences'
  | 'Health & Medicine'
  | 'Language Learning'
  | 'Personal Development';

export type LessonType = 'text' | 'video' | 'reading' | 'quiz' | 'assignment';
export type CourseProvider = 'MIT OCW' | 'YouTube' | 'Coursera' | 'edX' | 'Custom';

export interface CourseProvider {
  name: CourseProvider;
  url: string;
  logoUrl?: string;
}

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  description?: string;
  content?: string; // Text content or summary
  videoUrl?: string; // YouTube or provider video URL
  resourceUrl?: string; // External resource link
  duration?: number; // Minutes
  order: number;
  isPreview?: boolean; // Can be viewed without enrollment
}

export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription?: string; // For cards
  provider: {
    name: CourseProvider;
    url: string;
    logoUrl?: string;
  };
  instructors: string[]; // List of instructor names
  duration: string; // "4 weeks" or "20 hours"
  durationHours?: number; // Numeric for sorting
  level: CourseLevel;
  categories: CourseCategory[];
  tags: string[]; // Skill tags (e.g., "Python", "Machine Learning")
  lessons: Lesson[];
  image: string; // Provider image or local fallback
  sourceUrl: string; // Link to original course on provider site
  enrollmentCount: number;
  rating?: number; // 0-5
  language?: string;
  subtitles?: string[];
  certificate: boolean; // Does this course offer a certificate?

  // Metadata
  createdAt: string;
  updatedAt: string;
  fetchedAt?: string; // When this course was last fetched from provider
  isFeatured?: boolean;
}

// ===== ENROLLMENT TYPES =====

export type EnrollmentStatus = 'active' | 'completed' | 'dropped';

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  completedAt?: string;
  timeSpent?: number; // Minutes
  score?: number; // For quizzes
}

export interface CourseEnrollment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  courseId: string;
  courseTitle: string;
  courseProvider: string;
  courseImage: string;

  // Progress tracking
  status: EnrollmentStatus;
  progressPercent: number; // 0-100
  lessonsCompleted: number;
  totalLessons: number;
  lessonProgress: Record<string, LessonProgress>; // Map of lessonId to progress
  currentLessonId?: string; // Last accessed lesson

  // Timestamps
  enrolledAt: string;
  lastAccessedAt: string;
  completedAt?: string;

  // Certificate
  certificateId?: string;
  certificateUrl?: string;

  // Quiz/Assignment scores
  quizScores?: Record<string, number>; // Map of quiz lesson ID to score
  overallScore?: number; // Average score across all quizzes
}

// ===== CERTIFICATE TYPES =====

export interface Certificate {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  courseId: string;
  courseTitle: string;
  courseProvider: string;
  instructors: string[];
  completionDate: string;
  issueDate: string;
  filePath: string; // /public/certificates/{id}.pdf
  downloadUrl: string; // Public URL to download
  verificationCode: string; // Unique code for verification
  skills: string[]; // Skills earned from this course
}

// ===== QUIZ TYPES =====

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
  explanation?: string;
}

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  passingScore: number; // Percentage required to pass
  timeLimit?: number; // Minutes (optional)
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  enrollmentId: string;
  answers: Record<string, number>; // Map of question ID to selected answer index
  score: number; // Percentage
  passed: boolean;
  attemptedAt: string;
  completedAt: string;
  timeSpent: number; // Seconds
}

// ===== CACHE TYPES =====

export interface CourseCache {
  id: string;
  sourceName: string; // 'MIT_OCW', 'YOUTUBE', 'COURSERA', etc.
  sourceUrl: string;
  fetchedAt: string;
  expiresAt: string; // fetchedAt + 24 hours
  payload: any; // Raw response from provider
  coursesCount: number;
  status: 'fresh' | 'stale' | 'error';
  errorMessage?: string;
}

// ===== INSTRUCTOR TYPES =====

export interface Instructor {
  id: string;
  name: string;
  title?: string; // "Professor", "Senior Engineer", etc.
  organization?: string; // "MIT", "Google", etc.
  bio?: string;
  image?: string;
  socialLinks?: {
    website?: string;
    linkedin?: string;
    twitter?: string;
  };
  coursesCount: number;
  rating?: number;
}

// ===== RECOMMENDATION TYPES =====

export interface CourseRecommendation {
  courseId: string;
  reason: string; // "Based on your interest in Python"
  score: number; // Relevance score
}

// ===== OLLAMA INTEGRATION TYPES =====

export interface OllamaRequest {
  prompt: string;
  context?: string; // Lesson content or course description
  model?: string; // Default: 'phi3'
}

export interface OllamaResponse {
  response: string;
  model: string;
  createdAt: string;
  done: boolean;
}

export interface LessonSummary {
  lessonId: string;
  summary: string;
  keyPoints: string[];
  generatedAt: string;
}

export interface CourseQA {
  id: string;
  userId: string;
  courseId: string;
  lessonId?: string;
  question: string;
  answer: string;
  helpful: boolean;
  createdAt: string;
}

// ===== API RESPONSE TYPES =====

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CourseFilters {
  search?: string;
  category?: CourseCategory;
  level?: CourseLevel;
  provider?: CourseProvider;
  tags?: string[];
  minDuration?: number; // Hours
  maxDuration?: number; // Hours
  certificate?: boolean;
  language?: string;
}

export interface CourseSortOptions {
  sortBy?: 'relevance' | 'newest' | 'popular' | 'rating' | 'duration';
  sortOrder?: 'asc' | 'desc';
}

// ===== DATABASE SCHEMA =====

export interface EducationDatabase {
  courses: Course[];
  enrollments: CourseEnrollment[];
  certificates: Certificate[];
  courseCache: CourseCache[];
  quizzes: Quiz[];
  quizAttempts: QuizAttempt[];
  instructors: Instructor[];
  lessonSummaries: LessonSummary[];
  courseQA: CourseQA[];
}

// ===== UTILITY TYPES =====

export interface CourseStats {
  totalCourses: number;
  totalEnrollments: number;
  totalCertificates: number;
  averageProgress: number;
  topCategories: { category: CourseCategory; count: number }[];
  topProviders: { provider: CourseProvider; count: number }[];
}

export interface StudentStats {
  userId: string;
  totalEnrollments: number;
  completedCourses: number;
  totalCertificates: number;
  totalHoursLearned: number;
  skillsAcquired: string[];
  averageScore: number;
  currentStreak: number; // Days
}
