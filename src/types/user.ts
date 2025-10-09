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

// ===== EMPLOYMENT HUB - PROJECT SPRINT MODULE =====

export type ProjectRole = 
  | 'Data Analyst' 
  | 'UX Designer' 
  | 'Frontend Developer' 
  | 'Backend Developer' 
  | 'Full Stack Developer'
  | 'Content Writer'
  | 'Digital Marketer'
  | 'Product Manager';

export type DataSource = 
  | 'Kaggle' 
  | 'GitHub' 
  | 'Public API' 
  | 'Open Dataset' 
  | 'Research Paper';

export type ProjectDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type ProjectStatus = 
  | 'not_started' 
  | 'in_progress' 
  | 'submitted' 
  | 'under_review' 
  | 'verified'
  | 'rejected';

export interface Deliverable {
  id: string;
  title: string;
  description: string;
  completed: boolean; // For student's personal tracking
}

export interface Project {
  id: string;
  title: string;
  role: ProjectRole;
  difficulty: ProjectDifficulty;
  dataSource: DataSource;
  estimatedHours: number; // e.g., 30
  skills: string[]; // e.g., ['Python', 'Pandas', 'Data Visualization']
  
  // The Brief sections
  clientBackground: string; // Fictional company story
  projectGoal: string; // What needs to be achieved
  businessValue: string; // Why it matters
  
  // Source data and tools
  dataSourceLink: string; // Direct link to Kaggle, GitHub, etc.
  requiredTools: string[]; // e.g., ['Tableau', 'Python', 'SQL']
  
  // Deliverables
  deliverables: Deliverable[];
  detailedRequirements: string; // Strict specifications
  
  // Simulated feedback (hidden until revealed)
  stakeholderFeedback: string; // Pre-written revision requests
  
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectSubmission {
  id: string;
  projectId: string;
  projectTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  
  // Progress tracking
  status: ProjectStatus;
  startedAt: Date;
  submittedAt?: Date;
  
  // Deliverable tracking
  completedDeliverables: string[]; // Array of deliverable IDs
  feedbackRevealed: boolean; // Has student revealed stakeholder feedback?
  
  // Final submission
  deliverableLink: string; // Public link to GitHub, Figma, etc.
  impactStatement: string; // CV-ready bullet point (max 200 chars)
  
  // Verification
  lecturerId?: string;
  lecturerName?: string;
  verifiedAt?: Date;
  verificationNotes?: string;
  certificateId?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface LecturerVerification {
  id: string;
  submissionId: string;
  projectId: string;
  studentId: string;
  lecturerId: string;
  lecturerName: string;
  lecturerEmail: string;
  
  // Integrity checks
  functionalityVerified: boolean;
  skillLevelVerified: boolean;
  originalWorkVerified: boolean;
  
  // Output
  approved: boolean;
  comments?: string;
  digitalBadgeUrl?: string;
  verifiedAt: Date;
}

// ===== JOB BOARD TYPES =====

export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
export type JobLocation = 'remote' | 'on-site' | 'hybrid';
export type ApplicationStatus = 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'accepted';

export interface JobListing {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  jobType: JobType;
  location: string; // City or "Remote"
  locationType: JobLocation;
  salary?: string; // e.g., "50K-80K KSh/month"
  skills: string[];
  postedBy: string; // User ID
  postedByName: string;
  applicationsCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deadline?: Date;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  coverLetter: string;
  cvUrl?: string;
  linkedCertificates?: string[]; // Certificate IDs
  status: ApplicationStatus;
  appliedAt: Date;
  updatedAt: Date;
  reviewedBy?: string;
  reviewNotes?: string;
}

export interface Database {
  users: User[];
  cropListings: CropListing[];
  courses: Course[];
  enrollments: Enrollment[];
  certificates: Certificate[];
  projects: Project[];
  projectSubmissions: ProjectSubmission[];
  lecturerVerifications: LecturerVerification[];
  jobListings: JobListing[];
  jobApplications: JobApplication[];
}
