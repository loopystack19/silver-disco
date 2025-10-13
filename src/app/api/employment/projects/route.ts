import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getDb } from '@/lib/db';
import { Project, ProjectFilters } from '@/types/employment';

/**
 * GET /api/employment/projects
 * Get all projects with optional filters, search, and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const difficulty = searchParams.get('difficulty') || '';
    const category = searchParams.get('category') || '';
    const organization = searchParams.get('organization') || '';
    const skills = searchParams.get('skills')?.split(',').filter(Boolean) || [];
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const sortBy = searchParams.get('sortBy') || 'postedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const db = await getDb();
    let projects: Project[] = db.data.employmentProjects || [];

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      projects = projects.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.organization.toLowerCase().includes(searchLower) ||
          p.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    if (status) {
      projects = projects.filter((p) => p.status === status);
    }

    if (difficulty) {
      projects = projects.filter((p) => p.difficulty === difficulty);
    }

    if (category) {
      projects = projects.filter((p) => p.category === category);
    }

    if (organization) {
      projects = projects.filter((p) => p.organization === organization);
    }

    if (skills.length > 0) {
      projects = projects.filter((p) =>
        skills.some((skill) =>
          p.skills.some((pSkill) => pSkill.toLowerCase().includes(skill.toLowerCase()))
        )
      );
    }

    // Sort
    projects.sort((a, b) => {
      let aVal: any = a[sortBy as keyof Project];
      let bVal: any = b[sortBy as keyof Project];

      // Handle special cases
      if (sortBy === 'postedAt' || sortBy === 'deadline') {
        aVal = aVal ? new Date(aVal).getTime() : 0;
        bVal = bVal ? new Date(bVal).getTime() : 0;
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    // Pagination
    const total = projects.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProjects = projects.slice(startIndex, endIndex);

    // Get filter options for frontend
    const allProjects: Project[] = db.data.employmentProjects || [];
    const filterOptions = {
      categories: [...new Set(allProjects.map((p) => p.category))],
      organizations: [...new Set(allProjects.map((p) => p.organization))],
      skills: [...new Set(allProjects.flatMap((p) => p.skills))],
      difficulties: ['Beginner', 'Intermediate', 'Advanced'],
      statuses: ['Open', 'In Progress', 'Closed'],
    };

    return NextResponse.json({
      success: true,
      data: paginatedProjects,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
      filterOptions,
    });
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/employment/projects
 * Create a new curated project (lecturer only)
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication and lecturer role
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const user = session.user as any;
    if (user.role !== 'lecturer' && user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden. Only lecturers can create projects.' },
        { status: 403 }
      );
    }

    const projectData = await request.json();

    const db = await getDb();

    const newProject: Project = {
      ...projectData,
      id: crypto.randomUUID(),
      postedAt: new Date().toISOString(),
      currentTeamSize: 0,
      status: 'Open' as const,
      source: 'Curated' as const,
    };

    db.data.employmentProjects = db.data.employmentProjects || [];
    db.data.employmentProjects.push(newProject);

    await db.write();

    return NextResponse.json({
      success: true,
      message: 'Project created successfully',
      project: newProject,
    });
  } catch (error: any) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project', details: error.message },
      { status: 500 }
    );
  }
}
