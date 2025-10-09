import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getDb, saveDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { ProjectSubmission } from '@/types/user';

// POST /api/projects/[id]/start - Start a project sprint
export async function POST(
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
    
    // Check if user is a student or learner
    if (currentUser.role !== 'student' && currentUser.role !== 'learner') {
      return NextResponse.json(
        { error: 'Only students can start projects' },
        { status: 403 }
      );
    }
    
    // Check if project exists
    const project = db.data?.projects.find(p => p.id === params.id);
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Check if user already has a submission for this project
    const existingSubmission = db.data?.projectSubmissions.find(
      s => s.projectId === params.id && s.studentId === currentUser.id
    );
    
    if (existingSubmission) {
      return NextResponse.json(
        { error: 'You have already started this project', submission: existingSubmission },
        { status: 400 }
      );
    }
    
    // Create new submission
    const newSubmission: ProjectSubmission = {
      id: uuidv4(),
      projectId: params.id,
      projectTitle: project.title,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      status: 'in_progress',
      startedAt: new Date(),
      completedDeliverables: [],
      feedbackRevealed: false,
      deliverableLink: '',
      impactStatement: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    db.data!.projectSubmissions.push(newSubmission);
    await saveDb(db);
    
    return NextResponse.json(newSubmission, { status: 201 });
  } catch (error) {
    console.error('Error starting project:', error);
    return NextResponse.json(
      { error: 'Failed to start project' },
      { status: 500 }
    );
  }
}
