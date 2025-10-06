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
    certificates: []
  });
  
  await db.read();
  
  // Initialize with default data if empty
  if (!db.data) {
    db.data = { 
      users: [], 
      cropListings: [],
      courses: [],
      enrollments: [],
      certificates: []
    };
    await db.write();
  }
  
  // Ensure new collections exist (for existing databases)
  if (!db.data.courses) db.data.courses = [];
  if (!db.data.enrollments) db.data.enrollments = [];
  if (!db.data.certificates) db.data.certificates = [];
  
  return db;
}

export async function saveDb(database: Low<Database>): Promise<void> {
  await database.write();
}
