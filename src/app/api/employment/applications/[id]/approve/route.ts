import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '@/lib/db';
import { Approval, TeamMember } from '@/types/employment';

/**
 * POST /api/employment/applications/[id]/approve
 * Approve or reject an application (lecturer only)
 */
export async function POST(
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

    const { decision, feedback } = await request.json();
    const { id: applicationId } = params;

    if (!decision || !['approved', 'rejected', 'revision-requested'].includes(decision)) {
      return NextResponse.json(
        { success: false, error: 'Invalid decision' },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Get user (must be lecturer)
    const user = db.data.users.find((u: any) => u.email === session.user?.email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.role !== 'lecturer' && user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Only lecturers can approve applications' },
        { status: 403 }
      );
    }

    // Find application
    const applicationIndex = db.data.applications?.findIndex(
      (a: any) => a.id === applicationId
    );

    if (applicationIndex === -1 || applicationIndex === undefined) {
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      );
    }

    const application = db.data.applications[applicationIndex];

    // Check if already reviewed
    if (application.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: 'Application has already been reviewed' },
        { status: 400 }
      );
    }

    // Create approval record
    const approval: Approval = {
      id: uuidv4(),
      applicationId,
      lecturerId: user.id,
      lecturerName: user.name,
      decision: decision as 'approved' | 'rejected' | 'revision-requested',
      feedback,
      reviewedAt: new Date().toISOString(),
    };

    // Save approval
    db.data.approvals = db.data.approvals || [];
    db.data.approvals.push(approval);

    // Update application status
    db.data.applications[applicationIndex].status = decision;
    db.data.applications[applicationIndex].reviewedAt = new Date().toISOString();
    db.data.applications[applicationIndex].reviewedBy = user.id;

    // If approved, add student to project team
    if (decision === 'approved') {
      const project = db.data.employmentProjects?.find(
        (p: any) => p.id === application.projectId
      );

      if (project) {
        // Find or create team
        let teamIndex = db.data.teams?.findIndex(
          (t: any) => t.projectId === application.projectId
        );

        if (teamIndex === -1 || teamIndex === undefined) {
          // Create new team
          const newTeam = {
            id: uuidv4(),
            projectId: application.projectId,
            projectTitle: project.title,
            members: [],
            milestones: [],
            createdAt: new Date().toISOString(),
            lecturerId: user.id,
            lecturerName: user.name,
          };

          db.data.teams = db.data.teams || [];
          db.data.teams.push(newTeam);
          teamIndex = db.data.teams.length - 1;
        }

        // Add member to team
        const member: TeamMember = {
          userId: application.studentId,
          userName: application.studentName,
          userEmail: application.studentEmail,
          role: 'Team Member', // Can be customized
          joinedAt: new Date().toISOString(),
        };

        db.data.teams[teamIndex].members.push(member);

        // Update project team size
        const projectIndex = db.data.employmentProjects?.findIndex(
          (p: any) => p.id === application.projectId
        );
        if (projectIndex !== -1 && projectIndex !== undefined) {
          db.data.employmentProjects[projectIndex].currentTeamSize += 1;
        }
      }
    }

    await db.write();

    // TODO: Send email notification to student

    return NextResponse.json({
      success: true,
      message: `Application ${decision} successfully`,
      approval,
      application: db.data.applications[applicationIndex],
    });
  } catch (error: any) {
    console.error('Error approving application:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process application', details: error.message },
      { status: 500 }
    );
  }
}
