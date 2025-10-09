import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getDb, saveDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { Project } from '@/types/user';

// GET /api/projects - List all projects with filters
export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    
    const role = searchParams.get('role');
    const difficulty = searchParams.get('difficulty');
    const dataSource = searchParams.get('dataSource');
    const search = searchParams.get('search');
    
    let projects = db.data?.projects || [];
    
    // Apply filters
    if (role) {
      projects = projects.filter(p => p.role === role);
    }
    if (difficulty) {
      projects = projects.filter(p => p.difficulty === difficulty);
    }
    if (dataSource) {
      projects = projects.filter(p => p.dataSource === dataSource);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      projects = projects.filter(p => 
        p.title.toLowerCase().includes(searchLower) ||
        p.projectGoal.toLowerCase().includes(searchLower) ||
        p.skills.some(s => s.toLowerCase().includes(searchLower))
      );
    }
    
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create new project (admin only)
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
    
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can create projects' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'title', 'role', 'difficulty', 'dataSource', 'estimatedHours',
      'skills', 'clientBackground', 'projectGoal', 'businessValue',
      'dataSourceLink', 'requiredTools', 'deliverables', 'detailedRequirements',
      'stakeholderFeedback'
    ];
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    const newProject: Project = {
      id: uuidv4(),
      title: body.title,
      role: body.role,
      difficulty: body.difficulty,
      dataSource: body.dataSource,
      estimatedHours: body.estimatedHours,
      skills: body.skills,
      clientBackground: body.clientBackground,
      projectGoal: body.projectGoal,
      businessValue: body.businessValue,
      dataSourceLink: body.dataSourceLink,
      requiredTools: body.requiredTools,
      deliverables: body.deliverables.map((d: any, index: number) => ({
        id: uuidv4(),
        title: d.title,
        description: d.description,
        completed: false
      })),
      detailedRequirements: body.detailedRequirements,
      stakeholderFeedback: body.stakeholderFeedback,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    db.data!.projects.push(newProject);
    await saveDb(db);
    
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
