import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join } from 'path';
import { seedProjects } from '../src/lib/projectAggregator';

interface Database {
  users: any[];
  farmers: any[];
  buyers: any[];
  listings: any[];
  orders: any[];
  realCourses: any[];
  courseEnrollments: any[];
  courseCertificates: any[];
  courseCache: any[];
  quizzes: any[];
  quizAttempts: any[];
  lessonSummaries: any[];
  courseQA: any[];
  // Employment Hub Collections
  employmentProjects: any[];
  applications: any[];
  approvals: any[];
  teams: any[];
  reviews: any[];
  portfolios: any[];
  jobs: any[];
  employmentNotifications: any[];
  careerChats: any[];
}

async function seedEmploymentProjects() {
  console.log('🚀 Starting Employment Hub project seeding...\n');

  // Initialize database
  const file = join(process.cwd(), 'db.json');
  const adapter = new JSONFile<Database>(file);
  const db = new Low(adapter, {} as Database);

  await db.read();

  // Seed projects
  console.log('📦 Generating curated real-world projects...');
  const projects = await seedProjects();

  console.log(`✅ Generated ${projects.length} projects\n`);

  // Display project summary
  console.log('📊 Project Summary:');
  console.log('──────────────────────────────────────');

  const byDifficulty = projects.reduce(
    (acc, p) => {
      acc[p.difficulty] = (acc[p.difficulty] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const byCategory = projects.reduce(
    (acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  console.log('\n📈 By Difficulty:');
  Object.entries(byDifficulty).forEach(([level, count]) => {
    console.log(`   ${level}: ${count}`);
  });

  console.log('\n📁 By Category:');
  Object.entries(byCategory).forEach(([category, count]) => {
    console.log(`   ${category}: ${count}`);
  });

  console.log('\n🏢 Organizations:');
  const organizations = [...new Set(projects.map((p) => p.organization))];
  organizations.slice(0, 10).forEach((org) => {
    console.log(`   • ${org}`);
  });
  if (organizations.length > 10) {
    console.log(`   ... and ${organizations.length - 10} more`);
  }

  // Save to database
  db.data.employmentProjects = projects;

  // Initialize empty collections if they don't exist
  db.data.applications = db.data.applications || [];
  db.data.approvals = db.data.approvals || [];
  db.data.teams = db.data.teams || [];
  db.data.reviews = db.data.reviews || [];
  db.data.portfolios = db.data.portfolios || [];
  db.data.jobs = db.data.jobs || [];
  db.data.employmentNotifications = db.data.employmentNotifications || [];
  db.data.careerChats = db.data.careerChats || [];

  await db.write();

  console.log('\n✅ Successfully seeded employment projects!');
  console.log('──────────────────────────────────────\n');
  console.log('🎯 Next Steps:');
  console.log('   1. Run: npm run dev');
  console.log('   2. Visit: http://localhost:3001/employment');
  console.log('   3. Browse projects and start applying!\n');
}

// Run the seeding
seedEmploymentProjects().catch((error) => {
  console.error('❌ Error seeding employment projects:', error);
  process.exit(1);
});
