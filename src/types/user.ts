export type UserRole = 'farmer' | 'student' | 'learner' | 'buyer' | 'admin';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  phone?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  createdAt: Date;
  updatedAt: Date;
  
  // Email verification (replaces document-based verification)
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  verifiedAt?: Date;
  
  // Student-specific fields
  enrolledCourses?: string[];
  completedCourses?: string[];
  certificates?: string[];
  
  // Profile picture
  avatar?: string;
}

export type CropStatus = 'available' | 'sold' | 'pending';

export interface CropListing {
  id: string;
  farmerId: string;
  farmerName: string;
  cropName: string;
  quantity: number;
  unit: string; // e.g., 'bags', 'kg', 'tonnes'
  pricePerUnit: number;
  description: string;
  location: string; // Kenyan county
  datePosted: Date;
  status: CropStatus;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

// ===== LEARNERS HUB TYPES =====

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type CourseCategory = 'Technology' | 'Business' | 'Agriculture' | 'Creative';

export interface Lesson {
  id: string;
  title: string;
  content: string; // Can be text, HTML, or embedded video URL
  duration: number; // in minutes
  type: 'video' | 'text' | 'quiz';
  order: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: CourseCategory;
  level: CourseLevel;
  duration: string; // e.g., "4 weeks" or "20 hours"
  instructor: string;
  instructorBio?: string;
  image: string;
  lessons: Lesson[];
  enrollmentCount: number;
  rating: number; // 0-5
  createdAt: Date;
  updatedAt: Date;
}

export interface Enrollment {
  id: string;
  userId: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  progress: number; // 0-100
  completedLessons: string[]; // Array of lesson IDs
  currentLessonId?: string;
  completed: boolean;
  certificateId?: string;
  enrolledAt: Date;
  completedAt?: Date;
  lastAccessedAt: Date;
}

export interface Certificate {
  id: string;
  userId: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  completionDate: Date;
  certificateUrl: string; // URL to download certificate
  verificationCode: string; // Unique code for verification
  issuedAt: Date;
}

export interface Database {
  users: User[];
  cropListings: CropListing[];
  courses: Course[];
  enrollments: Enrollment[];
  certificates: Certificate[];
}
