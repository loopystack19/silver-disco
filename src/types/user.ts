export type UserRole = 'farmer' | 'student' | 'buyer' | 'admin';

export interface FarmerVerification {
  status: 'pending' | 'verified' | 'rejected';
  submittedAt?: Date;
  verifiedAt?: Date;
  documents?: {
    idDocument?: string;
    farmPhotos?: string[];
    landOwnership?: string;
  };
  rejectionReason?: string;
}

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
  
  // Farmer-specific fields
  farmerVerification?: FarmerVerification;
  
  // Student-specific fields
  enrolledCourses?: string[];
  completedCourses?: string[];
  certificates?: string[];
  
  // Profile picture
  avatar?: string;
}

export interface Database {
  users: User[];
}
