import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getDb } from '@/lib/db';

/**
 * GET /api/employment/applications/my-applications
 * Get current user's applications
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

    const applications = db.data.applications?.filter(
      (a: any) => a.studentId === user.id
    ) || [];

    // Sort by submission date (newest first)
    applications.sort(
      (a: any, b: any) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );

    return NextResponse.json({
      success: true,
      applications,
      count: applications.length,
    });
  } catch (error: any) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch applications', details: error.message },
      { status: 500 }
    );
  }
}
