import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { getServerSession } from 'next-auth';

// GET /api/enrollments - Get user's enrollments
export async function GET(request: NextRequest) {
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
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get user's enrollments
    const enrollments = db.data.enrollments.filter(e => e.userId === user.id);
    
    return NextResponse.json({
      success: true,
      enrollments
    });
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch enrollments' },
      { status: 500 }
    );
  }
}

// POST /api/enrollments - Enroll in a course
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
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    const body = await request.json();
    const { courseId } = body;
    
    if (!courseId) {
      return NextResponse.json(
        { success: false, error: 'Course ID is required' },
        { status: 400 }
      );
    }
    
    // Check if course exists
    const course = db.data.courses.find(c => c.id === courseId);
    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }
    
    // Check if already enrolled
    const existingEnrollment = db.data.enrollments.find(
      e => e.userId === user.id && e.courseId === courseId
    );
    
    if (existingEnrollment) {
      return NextResponse.json(
        { success: false, error: 'Already enrolled in this course' },
        { status: 400 }
      );
    }
    
    // Create enrollment
    const newEnrollment = {
      id: `enrollment-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      courseId: course.id,
      courseTitle: course.title,
      progress: 0,
      completedLessons: [],
      currentLessonId: course.lessons[0]?.id,
      completed: false,
      enrolledAt: new Date(),
      lastAccessedAt: new Date()
    };
    
    db.data.enrollments.push(newEnrollment);
    
    // Update course enrollment count
    course.enrollmentCount += 1;
    
    // Update user's enrolled courses
    if (!user.enrolledCourses) user.enrolledCourses = [];
    user.enrolledCourses.push(courseId);
    
    await saveDb(db);
    
    return NextResponse.json({
      success: true,
      enrollment: newEnrollment,
      message: 'Successfully enrolled in course'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error enrolling in course:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to enroll in course' },
      { status: 500 }
    );
  }
}
