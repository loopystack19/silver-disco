import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getDb } from '@/lib/db';

/**
 * PATCH /api/learn/progress/[enrollmentId]
 * Update progress for a course enrollment
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { enrollmentId: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { enrollmentId } = params;
    const body = await request.json();
    const { lessonId, completed } = body;

    if (!lessonId || completed === undefined) {
      return NextResponse.json(
        { success: false, error: 'Lesson ID and completion status are required' },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Find enrollment
    const enrollment = db.data.courseEnrollments?.find(
      (e: any) => e.id === enrollmentId
    );

    if (!enrollment) {
      return NextResponse.json(
        { success: false, error: 'Enrollment not found' },
        { status: 404 }
      );
    }

    // Verify user owns this enrollment
    const user = db.data.users.find((u: any) => u.email === session.user?.email);
    if (!user || enrollment.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Update lesson progress
    enrollment.lessonProgress = enrollment.lessonProgress || {};
    enrollment.lessonProgress[lessonId] = {
      completed,
      completedAt: completed ? new Date().toISOString() : null,
      lastAccessedAt: new Date().toISOString(),
    };

    // Calculate overall progress
    const totalLessons = enrollment.totalLessons || 0;
    const completedLessons = Object.values(enrollment.lessonProgress).filter(
      (p: any) => p.completed
    ).length;

    enrollment.lessonsCompleted = completedLessons;
    enrollment.progressPercent = totalLessons > 0
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;
    enrollment.lastAccessedAt = new Date().toISOString();

    // Check if course is completed
    if (enrollment.progressPercent === 100 && enrollment.status === 'active') {
      enrollment.status = 'completed';
      enrollment.completedAt = new Date().toISOString();
    }

    await db.write();

    return NextResponse.json({
      success: true,
      message: 'Progress updated successfully',
      enrollment,
      progressPercent: enrollment.progressPercent,
      lessonsCompleted: enrollment.lessonsCompleted,
    });
  } catch (error: any) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update progress', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/learn/progress/[enrollmentId]
 * Get progress for a course enrollment
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { enrollmentId: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { enrollmentId } = params;
    const db = await getDb();

    // Find enrollment
    const enrollment = db.data.courseEnrollments?.find(
      (e: any) => e.id === enrollmentId
    );

    if (!enrollment) {
      return NextResponse.json(
        { success: false, error: 'Enrollment not found' },
        { status: 404 }
      );
    }

    // Verify user owns this enrollment
    const user = db.data.users.find((u: any) => u.email === session.user?.email);
    if (!user || enrollment.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      enrollment,
      progressPercent: enrollment.progressPercent,
      lessonsCompleted: enrollment.lessonsCompleted,
      totalLessons: enrollment.totalLessons,
      lessonProgress: enrollment.lessonProgress || {},
    });
  } catch (error: any) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch progress', details: error.message },
      { status: 500 }
    );
  }
}
