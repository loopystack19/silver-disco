import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join } from 'path';
import { Database } from '@/types/user';

let db: Low<Database> | null = null;

export async function getDb(): Promise<Low<Database>> {
  if (db) {
    return db;
  }

  const file = join(process.cwd(), 'db.json');
  const adapter = new JSONFile<Database>(file);
  db = new Low<Database>(adapter, {
    users: [],
    cropListings: [],
    courses: [],
    enrollments: [],
    certificates: [],
    projects: [],
    projectSubmissions: [],
    lecturerVerifications: [],
    jobListings: [],
    jobApplications: [],
    transactions: [],
    employmentProjects: [],
    employmentApplications: [],
    employmentTeams: [],
    orders: [],
    ratings: [],
    favorites: [],
    cartItems: []
  });
  
  await db.read();
  
  // Initialize with default data if empty
  if (!db.data) {
    db.data = {
      users: [],
      cropListings: [],
      courses: [],
      enrollments: [],
      certificates: [],
      projects: [],
      projectSubmissions: [],
      lecturerVerifications: [],
      jobListings: [],
      jobApplications: [],
      transactions: [],
      employmentProjects: [],
      employmentApplications: [],
      employmentTeams: [],
      orders: [],
      ratings: [],
      favorites: [],
      cartItems: []
    };
    await db.write();
  }

  // Ensure new collections exist (for existing databases)
  if (!db.data.courses) db.data.courses = [];
  if (!db.data.enrollments) db.data.enrollments = [];
  if (!db.data.certificates) db.data.certificates = [];
  if (!db.data.projects) db.data.projects = [];
  if (!db.data.projectSubmissions) db.data.projectSubmissions = [];
  if (!db.data.lecturerVerifications) db.data.lecturerVerifications = [];
  if (!db.data.jobListings) db.data.jobListings = [];
  if (!db.data.jobApplications) db.data.jobApplications = [];
  if (!db.data.transactions) db.data.transactions = [];
  if (!db.data.employmentProjects) db.data.employmentProjects = [];
  if (!db.data.employmentApplications) db.data.employmentApplications = [];
  if (!db.data.employmentTeams) db.data.employmentTeams = [];
  if (!db.data.orders) db.data.orders = [];
  if (!db.data.ratings) db.data.ratings = [];
  if (!db.data.favorites) db.data.favorites = [];
  if (!db.data.cartItems) db.data.cartItems = [];
  
  return db;
}

export async function saveDb(database: Low<Database>): Promise<void> {
  await database.write();
}
