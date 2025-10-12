import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

/**
 * GET /api/employment/projects/[id]
 * Get project details by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const db = await getDb();

    const project = db.data.employmentProjects?.find((p: any) => p.id === id);

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Get team information if exists
    const team = db.data.teams?.find((t: any) => t.projectId === id);

    // Get application count
    const applicationCount =
      db.data.applications?.filter((a: any) => a.projectId === id).length || 0;

    return NextResponse.json({
      success: true,
      project: {
        ...project,
        team,
        applicationCount,
      },
    });
  } catch (error: any) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/employment/projects/[id]
 * Update project (lecturer only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const updates = await request.json();

    const db = await getDb();

    const projectIndex = db.data.employmentProjects?.findIndex((p: any) => p.id === id);

    if (projectIndex === -1 || projectIndex === undefined) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Update project
    db.data.employmentProjects[projectIndex] = {
      ...db.data.employmentProjects[projectIndex],
      ...updates,
    };

    await db.write();

    return NextResponse.json({
      success: true,
      message: 'Project updated successfully',
      project: db.data.employmentProjects[projectIndex],
    });
  } catch (error: any) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update project', details: error.message },
      { status: 500 }
    );
  }
}
