import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Course, CourseFilters, CourseSortOptions } from '@/types/education';

/**
 * GET /api/learn/courses
 * Fetch courses with search, filters, pagination, and sorting
 * Query params:
 * - search: string
 * - category: string
 * - level: string
 * - provider: string
 * - tags: string (comma-separated)
 * - certificate: boolean
 * - page: number (default: 1)
 * - limit: number (default: 12)
 * - sortBy: 'newest' | 'popular' | 'rating' | 'duration'
 * - sortOrder: 'asc' | 'desc'
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const level = searchParams.get('level') || '';
    const provider = searchParams.get('provider') || '';
    const tagsParam = searchParams.get('tags') || '';
    const certificate = searchParams.get('certificate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const sortBy = searchParams.get('sortBy') || 'popular';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const db = await getDb();
    let courses = [...(db.data.realCourses || [])];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      courses = courses.filter(
        (course: Course) =>
          course.title.toLowerCase().includes(searchLower) ||
          course.description.toLowerCase().includes(searchLower) ||
          course.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
          course.instructors.some((instructor) =>
            instructor.toLowerCase().includes(searchLower)
          )
      );
    }

    // Apply category filter
    if (category) {
      courses = courses.filter((course: Course) =>
        course.categories.includes(category as any)
      );
    }

    // Apply level filter
    if (level) {
      courses = courses.filter((course: Course) => course.level === level);
    }

    // Apply provider filter
    if (provider) {
      courses = courses.filter(
        (course: Course) => course.provider.name === provider
      );
    }

    // Apply tags filter
    if (tagsParam) {
      const tags = tagsParam.split(',').map((t) => t.trim().toLowerCase());
      courses = courses.filter((course: Course) =>
        tags.some((tag) =>
          course.tags.some((courseTag) => courseTag.toLowerCase().includes(tag))
        )
      );
    }

    // Apply certificate filter
    if (certificate !== null) {
      const needsCertificate = certificate === 'true';
      courses = courses.filter(
        (course: Course) => course.certificate === needsCertificate
      );
    }

    // Apply sorting
    courses.sort((a: Course, b: Course) => {
      let comparison = 0;

      switch (sortBy) {
        case 'newest':
          comparison =
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
        case 'popular':
          comparison = b.enrollmentCount - a.enrollmentCount;
          break;
        case 'rating':
          comparison = (b.rating || 0) - (a.rating || 0);
          break;
        case 'duration':
          comparison = (a.durationHours || 0) - (b.durationHours || 0);
          break;
        default:
          comparison = b.enrollmentCount - a.enrollmentCount;
      }

      return sortOrder === 'asc' ? -comparison : comparison;
    });

    // Calculate total and pagination
    const total = courses.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCourses = courses.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedCourses,
      total,
      page,
      limit,
      totalPages,
      hasMore: page < totalPages,
    });
  } catch (error: any) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch courses', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/learn/courses/featured
 * Get featured courses
 */
export async function getFeaturedCourses() {
  const db = await getDb();
  const courses = db.data.realCourses || [];
  return courses.filter((course: Course) => course.isFeatured).slice(0, 6);
}

/**
 * GET /api/learn/courses/stats
 * Get course statistics
 */
export async function getCourseStats() {
  const db = await getDb();
  const courses = db.data.realCourses || [];

  const categories = courses.reduce((acc: any, course: Course) => {
    course.categories.forEach((cat) => {
      acc[cat] = (acc[cat] || 0) + 1;
    });
    return acc;
  }, {});

  const providers = courses.reduce((acc: any, course: Course) => {
    const providerName = course.provider.name;
    acc[providerName] = (acc[providerName] || 0) + 1;
    return acc;
  }, {});

  return {
    totalCourses: courses.length,
    categories: Object.entries(categories).map(([category, count]) => ({
      category,
      count,
    })),
    providers: Object.entries(providers).map(([provider, count]) => ({
      provider,
      count,
    })),
  };
}
