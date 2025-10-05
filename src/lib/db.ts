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
  db = new Low<Database>(adapter, { users: [] });
  
  await db.read();
  
  // Initialize with default data if empty
  if (!db.data) {
    db.data = { users: [], cropListings: [] };
    await db.write();
  }
  
  return db;
}

export async function saveDb(database: Low<Database>): Promise<void> {
  await database.write();
}
