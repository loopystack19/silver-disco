import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getDb } from '@/lib/db';

// GET /api/jobs/[id]/check-application - Check if user has applied
export async function GET(
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
    
    const application = db.data?.jobApplications.find(
      a => a.jobId === params.id && a.applicantId === currentUser.id
    );
    
    return NextResponse.json({ applied: !!application });
  } catch (error) {
    console.error('Error checking application:', error);
    return NextResponse.json({ error: 'Failed to check application' }, { status: 500 });
  }
}
