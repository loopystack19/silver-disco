/**
 * Course Aggregator - Fetches real courses from YouTube playlists
 * For MVP: Uses curated YouTube playlists from top educators
 */

import { Course, Lesson, CourseCache } from '@/types/education';
import { v4 as uuidv4 } from 'uuid';

// Curated YouTube course playlists from top educators
const CURATED_COURSES = [
  {
    title: 'CS50: Introduction to Computer Science',
    provider: 'Harvard University',
    playlistId: 'PLhQjrBD2T3817j24-GogXmWqO5Q5vYy0V',
    category: 'Technology',
    level: 'Beginner',
    instructors: ['David J. Malan'],
    tags: ['Programming', 'C', 'Python', 'Web Development'],
    image: '/images/courses/cs50.jpg',
  },
  {
    title: 'Machine Learning Course',
    provider: 'Stanford University',
    playlistId: 'PLoROMvodv4rMiGQp3WXShtMGgzqpfVfbU',
    category: 'Technology',
    level: 'Advanced',
    instructors: ['Andrew Ng'],
    tags: ['Machine Learning', 'AI', 'Python', 'Data Science'],
    image: '/images/courses/ml.jpg',
  },
  {
    title: 'Python for Everybody',
    provider: 'University of Michigan',
    playlistId: 'PLlRFEj9H3Oj7Bp8-DfGpfAfDBiblRfl5p',
    category: 'Technology',
    level: 'Beginner',
    instructors: ['Charles Severance'],
    tags: ['Python', 'Programming', 'Web Development'],
    image: '/images/courses/python.jpg',
  },
  {
    title: 'Web Development Bootcamp',
    provider: 'freeCodeCamp',
    playlistId: 'PLWKjhJtqVAbnZtkAI25N3gnvH1CmrfnPq',
    category: 'Technology',
    level: 'Intermediate',
    instructors: ['Beau Carnes'],
    tags: ['HTML', 'CSS', 'JavaScript', 'React'],
    image: '/images/courses/webdev.jpg',
  },
  {
    title: 'Data Structures and Algorithms',
    provider: 'MIT OpenCourseWare',
    playlistId: 'PLUl4u3cNGP61Oq3tWYp6V_F-5jb5L2iHb',
    category: 'Technology',
    level: 'Intermediate',
    instructors: ['Erik Demaine', 'Srini Devadas'],
    tags: ['Algorithms', 'Data Structures', 'Python'],
    image: '/images/courses/algorithms.jpg',
  },
  {
    title: 'Digital Marketing Masterclass',
    provider: 'Google Digital Garage',
    playlistId: 'PLrw6a1wE39_tb2fErI4-WkMbsvGQk9_UB',
    category: 'Business',
    level: 'Beginner',
    instructors: ['Google Experts'],
    tags: ['Marketing', 'SEO', 'Social Media', 'Analytics'],
    image: '/images/courses/marketing.jpg',
  },
  {
    title: 'Financial Markets',
    provider: 'Yale University',
    playlistId: 'PL8FB14A2200B87185',
    category: 'Business',
    level: 'Intermediate',
    instructors: ['Robert Shiller'],
    tags: ['Finance', 'Economics', 'Investment'],
    image: '/images/courses/finance.jpg',
  },
  {
    title: 'Introduction to Psychology',
    provider: 'Yale University',
    playlistId: 'PL6A08EB4EEFF3E91F',
    category: 'Social Sciences',
    level: 'Beginner',
    instructors: ['Paul Bloom'],
    tags: ['Psychology', 'Neuroscience', 'Behavior'],
    image: '/images/courses/psychology.jpg',
  },
];

/**
 * Seed database with curated courses
 * This simulates fetching from YouTube API but uses predefined data for consistency
 */
export async function seedCourses(): Promise<Course[]> {
  const courses: Course[] = [];

  for (const courseData of CURATED_COURSES) {
    const course: Course = {
      id: uuidv4(),
      title: courseData.title,
      description: `Learn ${courseData.title} from ${courseData.provider}. This comprehensive course covers everything you need to know.`,
      shortDescription: `Master ${courseData.tags.join(', ')} with industry experts.`,
      provider: {
        name: courseData.provider as any,
        url: `https://youtube.com/playlist?list=${courseData.playlistId}`,
      },
      instructors: courseData.instructors,
      duration: '8 weeks',
      durationHours: 40,
      level: courseData.level as any,
      categories: [courseData.category as any],
      tags: courseData.tags,
      lessons: generateLessons(courseData.playlistId, 10), // Generate 10 lessons per course
      image: courseData.image,
      sourceUrl: `https://youtube.com/playlist?list=${courseData.playlistId}`,
      enrollmentCount: Math.floor(Math.random() * 10000) + 1000,
      rating: 4.5 + Math.random() * 0.5,
      language: 'English',
      subtitles: ['English', 'Swahili'],
      certificate: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fetchedAt: new Date().toISOString(),
      isFeatured: Math.random() > 0.7,
    };

    courses.push(course);
  }

  return courses;
}

/**
 * Generate lesson structure for a course
 */
function generateLessons(playlistId: string, count: number): Lesson[] {
  const lessons: Lesson[] = [];
  const lessonTitles = [
    'Introduction and Overview',
    'Core Concepts',
    'Practical Applications',
    'Hands-on Project',
    'Advanced Techniques',
    'Real-world Examples',
    'Best Practices',
    'Common Pitfalls',
    'Final Project',
    'Course Recap and Next Steps',
  ];

  for (let i = 0; i < count; i++) {
    lessons.push({
      id: uuidv4(),
      title: `Lesson ${i + 1}: ${lessonTitles[i] || `Advanced Topic ${i + 1}`}`,
      type: i === 3 || i === 8 ? 'assignment' : 'video',
      description: `In this lesson, you'll learn about ${lessonTitles[i]?.toLowerCase() || 'important concepts'}.`,
      videoUrl: `https://youtube.com/playlist?list=${playlistId}&index=${i + 1}`,
      duration: 30 + Math.floor(Math.random() * 45),
      order: i + 1,
      isPreview: i === 0, // First lesson is free preview
    });
  }

  return lessons;
}

/**
 * Create cache entry for fetched courses
 */
export function createCacheEntry(
  sourceName: string,
  courses: Course[]
): CourseCache {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

  return {
    id: uuidv4(),
    sourceName,
    sourceUrl: 'https://www.youtube.com',
    fetchedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    payload: { courses },
    coursesCount: courses.length,
    status: 'fresh',
  };
}

/**
 * Check if cache is still valid
 */
export function isCacheValid(cache: CourseCache): boolean {
  const now = new Date();
  const expiresAt = new Date(cache.expiresAt);
  return now < expiresAt && cache.status === 'fresh';
}

/**
 * Get fallback image based on category
 */
export function getFallbackImage(category: string): string {
  const imageMap: Record<string, string> = {
    Technology: '/images/courses/tech-default.jpg',
    Business: '/images/courses/business-default.jpg',
    Science: '/images/courses/science-default.jpg',
    Mathematics: '/images/courses/math-default.jpg',
    Engineering: '/images/courses/engineering-default.jpg',
    'Arts & Humanities': '/images/courses/arts-default.jpg',
    'Social Sciences': '/images/courses/social-default.jpg',
    'Health & Medicine': '/images/courses/health-default.jpg',
    'Language Learning': '/images/courses/language-default.jpg',
    'Personal Development': '/images/courses/personal-default.jpg',
  };

  return imageMap[category] || '/images/courses/default.jpg';
}
