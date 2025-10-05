export type UserRole = 'farmer' | 'student' | 'buyer' | 'admin';

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

export interface Database {
  users: User[];
  cropListings: CropListing[];
}
