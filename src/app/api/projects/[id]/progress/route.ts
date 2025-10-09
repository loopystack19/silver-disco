import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getDb, saveDb } from '@/lib/db';

// PUT /api/projects/[id]/progress - Update project submission progress
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const body = await request.json();
    
    // Find the submission
    const submissionIndex = db.data!.projectSubmissions.findIndex(
      s => s.projectId === params.id && s.studentId === currentUser.id
    );
    
    if (submissionIndex === -1) {
      return NextResponse.json(
        { error: 'Submission not found. Please start the project first.' },
        { status: 404 }
      );
    }
    
    const submission = db.data!.projectSubmissions[submissionIndex];
    
    // Update fields if provided
    if (body.completedDeliverables !== undefined) {
      submission.completedDeliverables = body.completedDeliverables;
    }
    
    if (body.feedbackRevealed !== undefined) {
      submission.feedbackRevealed = body.feedbackRevealed;
    }
    
    if (body.deliverableLink !== undefined) {
      submission.deliverableLink = body.deliverableLink;
    }
    
    if (body.impactStatement !== undefined) {
      submission.impactStatement = body.impactStatement;
    }
    
    // If submitting for the first time
    if (body.status === 'submitted' && submission.status === 'in_progress') {
      // Validate submission requirements
      if (!submission.deliverableLink) {
        return NextResponse.json(
          { error: 'Deliverable link is required' },
          { status: 400 }
        );
      }
      
      if (!submission.impactStatement) {
        return NextResponse.json(
          { error: 'Impact statement is required' },
          { status: 400 }
        );
      }
      
      if (!submission.feedbackRevealed) {
        return NextResponse.json(
          { error: 'You must reveal and review stakeholder feedback before submitting' },
          { status: 400 }
        );
      }
      
      submission.status = 'submitted';
      submission.submittedAt = new Date();
    }
    
    submission.updatedAt = new Date();
    
    db.data!.projectSubmissions[submissionIndex] = submission;
    await saveDb(db);
    
    return NextResponse.json(submission);
  } catch (error) {
    console.error('Error updating project progress:', error);
    return NextResponse.json(
      { error: 'Failed to update project progress' },
      { status: 500 }
    );
  }
}

// GET /api/projects/[id]/progress - Get user's submission for this project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const submission = db.data?.projectSubmissions.find(
      s => s.projectId === params.id && s.studentId === currentUser.id
    );
    
    if (!submission) {
      return NextResponse.json(
        { error: 'No submission found for this project' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(submission);
  } catch (error) {
    console.error('Error fetching submission:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submission' },
      { status: 500 }
    );
  }
}
