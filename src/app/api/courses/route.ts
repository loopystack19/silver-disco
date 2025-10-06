import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { getServerSession } from 'next-auth';

// GET /api/courses - List all courses with optional filtering
export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    const search = searchParams.get('search');
    
    let courses = db.data.courses;
    
    // Filter by category
    if (category && category !== 'all') {
      courses = courses.filter(c => c.category === category);
    }
    
    // Filter by level
    if (level && level !== 'all') {
      courses = courses.filter(c => c.level === level);
    }
    
    // Search in title and description
    if (search) {
      const searchLower = search.toLowerCase();
      courses = courses.filter(c => 
        c.title.toLowerCase().includes(searchLower) ||
        c.description.toLowerCase().includes(searchLower) ||
        c.instructor.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort by enrollment count (popular courses first)
    courses.sort((a, b) => b.enrollmentCount - a.enrollmentCount);
    
    return NextResponse.json({
      success: true,
      courses,
      total: courses.length
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

// POST /api/courses - Create new course (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const db = await getDb();
    const user = db.data.users.find(u => u.email === session.user?.email);
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Only admins can create courses' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { title, description, category, level, duration, instructor, instructorBio, image, lessons } = body;
    
    // Validation
    if (!title || !description || !category || !level || !duration || !instructor || !lessons) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create new course
    const newCourse = {
      id: `course-${Date.now()}`,
      title,
      description,
      category,
      level,
      duration,
      instructor,
      instructorBio: instructorBio || '',
      image: image || '/images/learners/default-course.jpg',
      lessons,
      enrollmentCount: 0,
      rating: 5.0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    db.data.courses.push(newCourse);
    await saveDb(db);
    
    return NextResponse.json({
      success: true,
      course: newCourse,
      message: 'Course created successfully'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create course' },
      { status: 500 }
    );
  }
}
