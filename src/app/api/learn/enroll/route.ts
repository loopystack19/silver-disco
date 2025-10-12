import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '@/lib/db';
import { CourseEnrollment } from '@/types/education';

/**
 * POST /api/learn/enroll
 * Enroll user in a course
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { courseId } = await request.json();

    if (!courseId) {
      return NextResponse.json(
        { success: false, error: 'Course ID is required' },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Check if course exists
    const course = db.data.realCourses?.find((c: any) => c.id === courseId);
    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    // Get user
    const user = db.data.users.find((u: any) => u.email === session.user?.email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if already enrolled
    const existingEnrollment = db.data.courseEnrollments?.find(
      (e: any) => e.userId === user.id && e.courseId === courseId
    );

    if (existingEnrollment) {
      return NextResponse.json(
        { success: false, error: 'Already enrolled in this course' },
        { status: 400 }
      );
    }

    // Create enrollment
    const enrollment: CourseEnrollment = {
      id: uuidv4(),
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      courseId: course.id,
      courseTitle: course.title,
      courseProvider: course.provider.name,
      courseImage: course.image,
      status: 'active',
      progressPercent: 0,
      lessonsCompleted: 0,
      totalLessons: course.lessons.length,
      lessonProgress: {},
      enrolledAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
    };

    // Save to database
    db.data.courseEnrollments = db.data.courseEnrollments || [];
    db.data.courseEnrollments.push(enrollment);

    // Update course enrollment count
    course.enrollmentCount += 1;

    await db.write();

    return NextResponse.json({
      success: true,
      message: 'Successfully enrolled in course',
      enrollment,
    });
  } catch (error: any) {
    console.error('Error enrolling in course:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to enroll in course', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/learn/enroll
 * Get user's enrollments
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const db = await getDb();
    const user = db.data.users.find((u: any) => u.email === session.user?.email);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const enrollments = db.data.courseEnrollments?.filter(
      (e: any) => e.userId === user.id
    ) || [];

    return NextResponse.json({
      success: true,
      enrollments,
    });
  } catch (error: any) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch enrollments', details: error.message },
      { status: 500 }
    );
  }
}
