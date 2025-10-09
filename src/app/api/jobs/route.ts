import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getDb, saveDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { JobListing } from '@/types/user';

// GET /api/jobs - List all jobs with filters
export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    
    const jobType = searchParams.get('jobType');
    const locationType = searchParams.get('locationType');
    const search = searchParams.get('search');
    
    let jobs = db.data?.jobListings || [];
    
    // Filter active jobs only
    jobs = jobs.filter(j => j.isActive);
    
    // Apply filters
    if (jobType) {
      jobs = jobs.filter(j => j.jobType === jobType);
    }
    if (locationType) {
      jobs = jobs.filter(j => j.locationType === locationType);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      jobs = jobs.filter(j => 
        j.title.toLowerCase().includes(searchLower) ||
        j.company.toLowerCase().includes(searchLower) ||
        j.description.toLowerCase().includes(searchLower) ||
        j.skills.some(s => s.toLowerCase().includes(searchLower))
      );
    }
    
    // Sort by date (newest first)
    jobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

// POST /api/jobs - Create new job (employers/admins only)
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
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.company || !body.description || !body.jobType || !body.location || !body.locationType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const newJob: JobListing = {
      id: uuidv4(),
      title: body.title,
      company: body.company,
      description: body.description,
      requirements: body.requirements || [],
      responsibilities: body.responsibilities || [],
      jobType: body.jobType,
      location: body.location,
      locationType: body.locationType,
      salary: body.salary,
      skills: body.skills || [],
      postedBy: currentUser.id,
      postedByName: currentUser.name,
      applicationsCount: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deadline: body.deadline ? new Date(body.deadline) : undefined
    };
    
    db.data!.jobListings.push(newJob);
    await saveDb(db);
    
    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}
