import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '@/lib/db';

/**
 * POST /api/learn/certificates/generate
 * Generate certificate for a completed course
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

    const { enrollmentId } = await request.json();

    if (!enrollmentId) {
      return NextResponse.json(
        { success: false, error: 'Enrollment ID is required' },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Get user
    const user = db.data.users.find((u: any) => u.email === session.user?.email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Find enrollment
    const enrollment = db.data.courseEnrollments?.find(
      (e: any) => e.id === enrollmentId && e.userId === user.id
    );

    if (!enrollment) {
      return NextResponse.json(
        { success: false, error: 'Enrollment not found' },
        { status: 404 }
      );
    }

    // Check if course is completed
    if (enrollment.progressPercent !== 100) {
      return NextResponse.json(
        { success: false, error: 'Course must be 100% completed to generate certificate' },
        { status: 400 }
      );
    }

    // Check if certificate already exists
    const existingCertificate = db.data.courseCertificates?.find(
      (c: any) => c.enrollmentId === enrollmentId
    );

    if (existingCertificate) {
      return NextResponse.json({
        success: true,
        message: 'Certificate already exists',
        certificate: existingCertificate,
      });
    }

    // Get course details
    const course = db.data.realCourses?.find((c: any) => c.id === enrollment.courseId);
    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    // Create certificate
    const certificate = {
      id: uuidv4(),
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      courseId: course.id,
      courseTitle: course.title,
      courseProvider: course.provider.name,
      enrollmentId: enrollment.id,
      completionDate: enrollment.completedAt || new Date().toISOString(),
      issuedAt: new Date().toISOString(),
      certificateUrl: '', // Will be generated on download
    };

    // Save certificate
    db.data.courseCertificates = db.data.courseCertificates || [];
    db.data.courseCertificates.push(certificate);

    await db.write();

    return NextResponse.json({
      success: true,
      message: 'Certificate generated successfully',
      certificate,
    });
  } catch (error: any) {
    console.error('Error generating certificate:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate certificate', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/learn/certificates/generate
 * Get all certificates for the current user
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

    const certificates = db.data.courseCertificates?.filter(
      (c: any) => c.userId === user.id
    ) || [];

    return NextResponse.json({
      success: true,
      certificates,
    });
  } catch (error: any) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch certificates', details: error.message },
      { status: 500 }
    );
  }
}
