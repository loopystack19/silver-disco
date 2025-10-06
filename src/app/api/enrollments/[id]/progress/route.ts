import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { getServerSession } from 'next-auth';

// PUT /api/enrollments/[id]/progress - Update enrollment progress
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    // Find enrollment
    const enrollment = db.data.enrollments.find(e => e.id === params.id);
    
    if (!enrollment) {
      return NextResponse.json(
        { success: false, error: 'Enrollment not found' },
        { status: 404 }
      );
    }
    
    // Verify user owns this enrollment
    if (enrollment.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Not authorized' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { lessonId } = body;
    
    if (!lessonId) {
      return NextResponse.json(
        { success: false, error: 'Lesson ID is required' },
        { status: 400 }
      );
    }
    
    // Find the course
    const course = db.data.courses.find(c => c.id === enrollment.courseId);
    
    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }
    
    // Add lesson to completed lessons if not already completed
    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }
    
    // Calculate progress
    const totalLessons = course.lessons.length;
    const completedCount = enrollment.completedLessons.length;
    enrollment.progress = Math.round((completedCount / totalLessons) * 100);
    
    // Check if course is completed
    if (completedCount === totalLessons) {
      enrollment.completed = true;
      enrollment.completedAt = new Date();
      
      // Auto-generate certificate
      const verificationCode = generateVerificationCode();
      const certificate = {
        id: `cert-${Date.now()}`,
        userId: user.id,
        userName: user.name,
        courseId: course.id,
        courseTitle: course.title,
        completionDate: new Date(),
        certificateUrl: `/api/certificates/${verificationCode}/download`,
        verificationCode,
        issuedAt: new Date()
      };
      
      db.data.certificates.push(certificate);
      enrollment.certificateId = certificate.id;
      
      // Update user's certificates
      if (!user.certificates) user.certificates = [];
      user.certificates.push(certificate.id);
    } else {
      // Update current lesson to next uncompleted lesson
      const nextLesson = course.lessons.find(
        l => !enrollment.completedLessons.includes(l.id)
      );
      if (nextLesson) {
        enrollment.currentLessonId = nextLesson.id;
      }
    }
    
    // Update last accessed time
    enrollment.lastAccessedAt = new Date();
    
    await saveDb(db);
    
    return NextResponse.json({
      success: true,
      enrollment,
      message: enrollment.completed 
        ? 'Course completed! Certificate generated.'
        : 'Progress updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}

// Generate a unique verification code
function generateVerificationCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 12; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
    if ((i + 1) % 4 === 0 && i !== 11) code += '-';
  }
  return code;
}
