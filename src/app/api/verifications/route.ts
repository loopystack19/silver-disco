import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getDb, saveDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { LecturerVerification } from '@/types/user';

// GET /api/verifications - Get all verifications (for lecturers/admins)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const db = await getDb();
    const currentUser = db.data?.users.find((u: any) => u.email === session.user?.email);
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Only admins can see all verifications
    if (currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can view all verifications' },
        { status: 403 }
      );
    }
    
    const verifications = db.data?.lecturerVerifications || [];
    return NextResponse.json(verifications);
  } catch (error) {
    console.error('Error fetching verifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch verifications' },
      { status: 500 }
    );
  }
}

// POST /api/verifications - Create a verification (lecturer verifies a submission)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const db = await getDb();
    const currentUser = db.data?.users.find((u: any) => u.email === session.user?.email);
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Only admins can act as lecturers for now
    if (currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can verify submissions' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.submissionId) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      );
    }
    
    // Find the submission
    const submissionIndex = db.data!.projectSubmissions.findIndex(
      s => s.id === body.submissionId
    );
    
    if (submissionIndex === -1) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }
    
    const submission = db.data!.projectSubmissions[submissionIndex];
    
    // Check if submission is in submitted status
    if (submission.status !== 'submitted') {
      return NextResponse.json(
        { error: 'Submission must be submitted before verification' },
        { status: 400 }
      );
    }
    
    // Validate integrity checkboxes
    if (!body.functionalityVerified || !body.skillLevelVerified || !body.originalWorkVerified) {
      return NextResponse.json(
        { error: 'All integrity checks must be verified' },
        { status: 400 }
      );
    }
    
    // Check if already verified
    const existingVerification = db.data?.lecturerVerifications.find(
      v => v.submissionId === body.submissionId
    );
    
    if (existingVerification) {
      return NextResponse.json(
        { error: 'This submission has already been verified' },
        { status: 400 }
      );
    }
    
    // Create verification record
    const verification: LecturerVerification = {
      id: uuidv4(),
      submissionId: body.submissionId,
      projectId: submission.projectId,
      studentId: submission.studentId,
      lecturerId: currentUser.id,
      lecturerName: currentUser.name,
      lecturerEmail: currentUser.email,
      functionalityVerified: body.functionalityVerified,
      skillLevelVerified: body.skillLevelVerified,
      originalWorkVerified: body.originalWorkVerified,
      approved: body.approved !== false, // Default to true if not specified
      comments: body.comments || '',
      digitalBadgeUrl: body.digitalBadgeUrl || '',
      verifiedAt: new Date()
    };
    
    db.data!.lecturerVerifications.push(verification);
    
    // Update submission status
    submission.status = verification.approved ? 'verified' : 'rejected';
    submission.lecturerId = currentUser.id;
    submission.lecturerName = currentUser.name;
    submission.verifiedAt = new Date();
    submission.verificationNotes = body.comments || '';
    
    if (verification.approved && body.certificateId) {
      submission.certificateId = body.certificateId;
    }
    
    db.data!.projectSubmissions[submissionIndex] = submission;
    await saveDb(db);
    
    return NextResponse.json(verification, { status: 201 });
  } catch (error) {
    console.error('Error creating verification:', error);
    return NextResponse.json(
      { error: 'Failed to create verification' },
      { status: 500 }
    );
  }
}
