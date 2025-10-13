import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '@/lib/db';
import { sendEmail } from '@/lib/email';
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

    // Send email notification to student
    try {
      const student = db.data.users.find((u: any) => u.id === application.studentId);
      const project = db.data.employmentProjects?.find(
        (p: any) => p.id === application.projectId
      );

      if (student && project) {
        let emailSubject = '';
        let emailText = '';
        let emailHtml = '';

        if (decision === 'approved') {
          emailSubject = `Application Approved: ${project.title}`;
          emailText = `Dear ${student.name},\n\nCongratulations! Your application for "${project.title}" has been approved.\n\nYou have been added to the project team. Please check the Employment Hub dashboard to view project details and milestones.\n\nBest regards,\nUmoja Hub Team`;
          emailHtml = `
            <h2>Application Approved! 🎉</h2>
            <p>Dear ${student.name},</p>
            <p>Congratulations! Your application for <strong>"${project.title}"</strong> has been approved.</p>
            <h3>Next Steps:</h3>
            <ul>
              <li>You have been added to the project team</li>
              <li>Check the Employment Hub dashboard to view project details</li>
              <li>Review project milestones and deliverables</li>
              <li>Connect with your team members</li>
            </ul>
            ${feedback ? `<p><strong>Lecturer's Note:</strong> ${feedback}</p>` : ''}
            <p>Best regards,<br/>Umoja Hub Team</p>
          `;
        } else if (decision === 'rejected') {
          emailSubject = `Application Update: ${project.title}`;
          emailText = `Dear ${student.name},\n\nThank you for your interest in "${project.title}".\n\nUnfortunately, your application was not selected at this time. We encourage you to apply for other projects that match your skills and interests.\n\n${feedback ? `Feedback: ${feedback}\n\n` : ''}Best regards,\nUmoja Hub Team`;
          emailHtml = `
            <h2>Application Update</h2>
            <p>Dear ${student.name},</p>
            <p>Thank you for your interest in <strong>"${project.title}"</strong>.</p>
            <p>Unfortunately, your application was not selected at this time. We encourage you to apply for other projects that match your skills and interests.</p>
            ${feedback ? `<h3>Feedback:</h3><p>${feedback}</p>` : ''}
            <p>Best regards,<br/>Umoja Hub Team</p>
          `;
        } else if (decision === 'revision-requested') {
          emailSubject = `Revision Requested: ${project.title}`;
          emailText = `Dear ${student.name},\n\nThank you for your application to "${project.title}".\n\nThe lecturer has requested revisions to your application. Please review the feedback below and resubmit your application.\n\nFeedback: ${feedback || 'Please review and improve your application.'}\n\nBest regards,\nUmoja Hub Team`;
          emailHtml = `
            <h2>Revision Requested</h2>
            <p>Dear ${student.name},</p>
            <p>Thank you for your application to <strong>"${project.title}"</strong>.</p>
            <p>The lecturer has requested revisions to your application. Please review the feedback below and resubmit your application.</p>
            <h3>Feedback:</h3>
            <p>${feedback || 'Please review and improve your application.'}</p>
            <p>Best regards,<br/>Umoja Hub Team</p>
          `;
        }

        await sendEmail({
          to: student.email,
          subject: emailSubject,
          text: emailText,
          html: emailHtml
        });
      }
    } catch (emailError) {
      console.error('Failed to send approval notification email:', emailError);
      // Don't fail the request if email fails
    }

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
