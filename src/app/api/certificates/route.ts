import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { getServerSession } from 'next-auth';

// Generate a unique verification code
function generateVerificationCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 12; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
    if ((i + 1) % 4 === 0 && i !== 11) code += '-';
  }
  return code;
}

// POST /api/certificates - Generate certificate for completed course
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const db = await getDb();
    const user = db.data.users.find(u => u.email === session.user?.email);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    const body = await request.json();
    const { enrollmentId } = body;
    
    if (!enrollmentId) {
      return NextResponse.json(
        { success: false, error: 'Enrollment ID is required' },
        { status: 400 }
      );
    }
    
    // Find enrollment
    const enrollment = db.data.enrollments.find(e => e.id === enrollmentId);
    if (!enrollment) {
      return NextResponse.json(
        { success: false, error: 'Enrollment not found' },
        { status: 404 }
      );
    }
    
    // Verify user owns this enrollment
    if (enrollment.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Not authorized' },
        { status: 403 }
      );
    }
    
    // Check if course is completed
    if (!enrollment.completed) {
      return NextResponse.json(
        { success: false, error: 'Course not completed yet' },
        { status: 400 }
      );
    }
    
    // Check if certificate already exists
    const existingCertificate = db.data.certificates.find(
      c => c.userId === user.id && c.courseId === enrollment.courseId
    );
    
    if (existingCertificate) {
      return NextResponse.json({
        success: true,
        certificate: existingCertificate,
        message: 'Certificate already exists'
      });
    }
    
    // Create certificate
    const verificationCode = generateVerificationCode();
    const newCertificate = {
      id: `cert-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      courseId: enrollment.courseId,
      courseTitle: enrollment.courseTitle,
      completionDate: enrollment.completedAt || new Date(),
      certificateUrl: `/api/certificates/${verificationCode}/download`,
      verificationCode,
      issuedAt: new Date()
    };
    
    db.data.certificates.push(newCertificate);
    
    // Update enrollment with certificate ID
    enrollment.certificateId = newCertificate.id;
    
    // Update user's certificates
    if (!user.certificates) user.certificates = [];
    user.certificates.push(newCertificate.id);
    
    await saveDb(db);
    
    return NextResponse.json({
      success: true,
      certificate: newCertificate,
      message: 'Certificate generated successfully'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error generating certificate:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate certificate' },
      { status: 500 }
    );
  }
}

// GET /api/certificates - Get user's certificates
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const db = await getDb();
    const user = db.data.users.find(u => u.email === session.user?.email);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get user's certificates
    const certificates = db.data.certificates.filter(c => c.userId === user.id);
    
    return NextResponse.json({
      success: true,
      certificates
    });
    
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch certificates' },
      { status: 500 }
    );
  }
}
