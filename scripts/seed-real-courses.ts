/**
 * Seed Real Courses Script
 * Populates database with curated YouTube courses
 * Run: npm run seed:realcourses
 */

import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join } from 'path';
import { seedCourses, createCacheEntry } from '../src/lib/courseAggregator';

interface Database {
  realCourses: any[];
  courseCache: any[];
  [key: string]: any;
}

async function seedRealCourses() {
  console.log('🌱 Seeding real courses from YouTube...\n');

  // Initialize database
  const file = join(process.cwd(), 'db.json');
  const adapter = new JSONFile<Database>(file);
  const db = new Low(adapter, {} as Database);

  await db.read();

  // Generate courses
  console.log('📚 Fetching curated courses...');
  const courses = await seedCourses();
  console.log(`✅ Generated ${courses.length} courses\n`);

  // Create cache entry
  const cacheEntry = createCacheEntry('YOUTUBE_CURATED', courses);

  // Update database
  db.data.realCourses = courses;
  db.data.courseCache = db.data.courseCache || [];
  db.data.courseCache.push(cacheEntry);

  await db.write();

  console.log('✨ Database seeded successfully!\n');
  console.log('Course Summary:');
  console.log('═══════════════════════════════════════');

  courses.forEach((course, index) => {
    console.log(`${index + 1}. ${course.title}`);
    console.log(`   Provider: ${course.provider.name}`);
    console.log(`   Level: ${course.level} | Lessons: ${course.lessons.length}`);
    console.log(`   Tags: ${course.tags.join(', ')}`);
    console.log('');
  });

  console.log('═══════════════════════════════════════');
  console.log(`\n✅ Seeded ${courses.length} courses successfully!`);
  console.log(`📝 Cache entry created (expires in 24 hours)`);
  console.log(`\n🚀 You can now start the application and browse courses!\n`);
}

seedRealCourses().catch((error) => {
  console.error('❌ Error seeding courses:', error);
  process.exit(1);
});
