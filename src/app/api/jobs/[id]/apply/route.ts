import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getDb, saveDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { JobApplication } from '@/types/user';

// POST /api/jobs/[id]/apply - Apply for a job
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const db = await getDb();
    const currentUser = db.data?.users.find((u: any) => u.email === session.user?.email);
    
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Check if job exists
    const jobIndex = db.data!.jobListings.findIndex(j => j.id === params.id);
    if (jobIndex === -1) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    
    const job = db.data!.jobListings[jobIndex];
    
    // Check if already applied
    const existingApp = db.data?.jobApplications.find(
      a => a.jobId === params.id && a.applicantId === currentUser.id
    );
    
    if (existingApp) {
      return NextResponse.json({ error: 'Already applied to this job' }, { status: 400 });
    }
    
    const body = await request.json();
    
    if (!body.coverLetter) {
      return NextResponse.json({ error: 'Cover letter is required' }, { status: 400 });
    }
    
    const newApplication: JobApplication = {
      id: uuidv4(),
      jobId: params.id,
      jobTitle: job.title,
      applicantId: currentUser.id,
      applicantName: currentUser.name,
      applicantEmail: currentUser.email,
      coverLetter: body.coverLetter,
      cvUrl: body.cvUrl,
      linkedCertificates: body.linkedCertificates || [],
      status: 'pending',
      appliedAt: new Date(),
      updatedAt: new Date()
    };
    
    db.data!.jobApplications.push(newApplication);
    
    // Increment applications count
    db.data!.jobListings[jobIndex].applicationsCount += 1;
    
    await saveDb(db);
    
    return NextResponse.json(newApplication, { status: 201 });
  } catch (error) {
    console.error('Error applying for job:', error);
    return NextResponse.json({ error: 'Failed to apply for job' }, { status: 500 });
  }
}
