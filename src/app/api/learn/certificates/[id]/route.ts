import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getDb } from '@/lib/db';

/**
 * GET /api/learn/certificates/[id]
 * Get certificate details by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = params;
    const db = await getDb();

    const certificate = db.data.courseCertificates?.find((c: any) => c.id === id);

    if (!certificate) {
      return NextResponse.json(
        { success: false, error: 'Certificate not found' },
        { status: 404 }
      );
    }

    // Verify user owns this certificate
    const user = db.data.users.find((u: any) => u.email === session.user?.email);
    if (!user || certificate.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      certificate,
    });
  } catch (error: any) {
    console.error('Error fetching certificate:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch certificate', details: error.message },
      { status: 500 }
    );
  }
}
