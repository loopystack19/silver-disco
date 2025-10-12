// Employment Hub Type Definitions

export type ProjectStatus = 'Open' | 'In Progress' | 'Closed';
export type ProjectDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'revision-requested';
export type MilestoneStatus = 'not-started' | 'in-progress' | 'complete';
export type ApprovalDecision = 'approved' | 'rejected' | 'revision-requested';

/**
 * Real-world project from public APIs or curated locally
 */
export interface Project {
  id: string;
  title: string;
  description: string;
  skills: string[];
  organization: string;
  difficulty: ProjectDifficulty;
  duration: string; // e.g., "3 months"
  deadline?: string; // ISO date string
  image: string; // Path to local image in /public/images/projects/
  status: ProjectStatus;
  source: 'GitHub' | 'GSoC' | 'Kaggle' | 'Curated' | 'Other';
  sourceUrl?: string; // Original URL if from API
  maxTeamSize?: number;
  currentTeamSize: number;
  category: string; // e.g., "Web Development", "Data Science"
  tags: string[];
  postedBy?: string; // Lecturer ID if curated
  postedAt: string; // ISO date string
  startDate?: string; // ISO date string
  completedAt?: string; // ISO date string
}

/**
 * Student application for a project
 */
export interface Application {
  id: string;
  projectId: string;
  projectTitle: string; // Denormalized for easy display
  studentId: string;
  studentName: string;
  studentEmail: string;
  institution: string;
  course: string;
  skills: string[];
  statement: string; // Statement of interest
  hoursPerWeek: number;
  cvLink?: string; // Path to uploaded CV
  portfolioLink?: string;
  status: ApplicationStatus;
  submittedAt: string; // ISO date string
  reviewedAt?: string; // ISO date string
  reviewedBy?: string; // Lecturer ID
}

/**
 * Lecturer's decision on an application
 */
export interface Approval {
  id: string;
  applicationId: string;
  lecturerId: string;
  lecturerName: string;
  decision: ApprovalDecision;
  feedback?: string;
  reviewedAt: string; // ISO date string
}

/**
 * Project team member
 */
export interface TeamMember {
  userId: string;
  userName: string;
  userEmail: string;
  role: string; // e.g., "Frontend Developer", "Data Analyst"
  joinedAt: string; // ISO date string
  contribution?: string; // Brief description of contribution
}

/**
 * Project milestone
 */
export interface Milestone {
  id: string;
  title: string;
  description: string;
  status: MilestoneStatus;
  assignedTo?: string[]; // Array of user IDs
  dueDate?: string; // ISO date string
  completedAt?: string; // ISO date string
  notes?: string;
  files?: string[]; // Array of file paths
}

/**
 * Project team with members and milestones
 */
export interface Team {
  id: string;
  projectId: string;
  projectTitle: string;
  members: TeamMember[];
  milestones: Milestone[];
  createdAt: string; // ISO date string
  lecturerId: string; // Supervising lecturer
  lecturerName: string;
  notes?: string;
  chatMessages?: ChatMessage[];
}

/**
 * Chat message within a team
 */
export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string; // ISO date string
  attachments?: string[];
}

/**
 * Lecturer review/feedback on project completion
 */
export interface Review {
  id: string;
  projectId: string;
  teamId: string;
  studentId: string;
  lecturerId: string;
  lecturerName: string;
  rating: number; // 1-5
  feedback: string;
  skillsGained: string[];
  isVerified: boolean; // If true, adds to portfolio
  reviewedAt: string; // ISO date string
}

/**
 * Student portfolio entry (verified project experience)
 */
export interface PortfolioEntry {
  id: string;
  studentId: string;
  projectId: string;
  projectTitle: string;
  organization: string;
  role: string;
  duration: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  description: string;
  skillsGained: string[];
  lecturerId: string;
  lecturerName: string;
  lecturerInstitution: string;
  isVerified: boolean;
  verifiedAt: string; // ISO date string
  certificateUrl?: string;
  badgeUrl?: string;
}

/**
 * Job listing (optional feature)
 */
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Internship' | 'Contract' | 'Remote';
  description: string;
  requirements: string[];
  skills: string[];
  salary?: string;
  applicationUrl: string;
  source: 'Remotive' | 'OpenJobBoard' | 'Curated' | 'Other';
  postedAt: string; // ISO date string
  deadline?: string; // ISO date string
  isActive: boolean;
}

/**
 * Notification for various employment hub events
 */
export interface EmploymentNotification {
  id: string;
  userId: string;
  type: 'application-submitted' | 'application-approved' | 'application-rejected' |
        'application-revision' | 'project-completed' | 'milestone-complete' |
        'team-message' | 'review-received';
  title: string;
  message: string;
  link?: string; // URL to relevant page
  isRead: boolean;
  createdAt: string; // ISO date string
}

/**
 * AI Career Assistant conversation
 */
export interface CareerChat {
  id: string;
  userId: string;
  messages: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }[];
  context?: 'application-review' | 'project-recommendation' | 'interview-prep' | 'general';
  createdAt: string;
  updatedAt: string;
}

/**
 * Project statistics for dashboard
 */
export interface ProjectStats {
  totalProjects: number;
  openProjects: number;
  inProgressProjects: number;
  completedProjects: number;
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  activeTeams: number;
  totalStudents: number;
}

/**
 * Student employment profile
 */
export interface EmploymentProfile {
  userId: string;
  skills: string[];
  interests: string[];
  resumeUrl?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  bio?: string;
  availableHoursPerWeek?: number;
  lookingForOpportunities: boolean;
  projects: PortfolioEntry[];
  applications: Application[];
  reviews: Review[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Filter options for project board
 */
export interface ProjectFilters {
  search?: string;
  status?: ProjectStatus;
  difficulty?: ProjectDifficulty;
  skills?: string[];
  organization?: string;
  category?: string;
  source?: string;
}
