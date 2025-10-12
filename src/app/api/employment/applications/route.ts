import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '@/lib/db';
import { Application } from '@/types/employment';

/**
 * POST /api/employment/applications
 * Submit application for a project
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

    const applicationData = await request.json();
    const db = await getDb();

    // Get user
    const user = db.data.users.find((u: any) => u.email === session.user?.email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is a student
    if (user.role !== 'learner' && user.role !== 'student') {
      return NextResponse.json(
        { success: false, error: 'Only students can apply for projects' },
        { status: 403 }
      );
    }

    // Get project
    const project = db.data.employmentProjects?.find(
      (p: any) => p.id === applicationData.projectId
    );
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Check if project is open
    if (project.status !== 'Open') {
      return NextResponse.json(
        { success: false, error: 'This project is no longer accepting applications' },
        { status: 400 }
      );
    }

    // Check if already applied
    const existingApplication = db.data.applications?.find(
      (a: any) => a.projectId === applicationData.projectId && a.studentId === user.id
    );

    if (existingApplication) {
      return NextResponse.json(
        { success: false, error: 'You have already applied for this project' },
        { status: 400 }
      );
    }

    // Create application
    const application: Application = {
      id: uuidv4(),
      projectId: applicationData.projectId,
      projectTitle: project.title,
      studentId: user.id,
      studentName: applicationData.name || user.name,
      studentEmail: user.email,
      institution: applicationData.institution,
      course: applicationData.course,
      skills: applicationData.skills,
      statement: applicationData.statement,
      hoursPerWeek: applicationData.hoursPerWeek,
      cvLink: applicationData.cvLink,
      portfolioLink: applicationData.portfolioLink,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    // Save application
    db.data.applications = db.data.applications || [];
    db.data.applications.push(application);

    // Create notification for lecturer
    // TODO: Implement email notification

    await db.write();

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      application,
    });
  } catch (error: any) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit application', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/employment/applications
 * Get all applications (lecturer only)
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

    // Check if user is a lecturer
    if (user.role !== 'lecturer' && user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Only lecturers can view all applications' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const projectId = searchParams.get('projectId');

    let applications = db.data.applications || [];

    // Apply filters
    if (status) {
      applications = applications.filter((a: any) => a.status === status);
    }

    if (projectId) {
      applications = applications.filter((a: any) => a.projectId === projectId);
    }

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
