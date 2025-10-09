import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getDb } from '@/lib/db';

// GET /api/admin/stats - Get admin dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const db = await getDb();
    const currentUser = db.data?.users.find((u: any) => u.email === session.user?.email);
    
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Only admins can view stats' }, { status: 403 });
    }
    
    const stats = {
      totalUsers: db.data?.users.length || 0,
      pendingVerifications: db.data?.projectSubmissions.filter(s => s.status === 'submitted').length || 0,
      activeListings: db.data?.cropListings.filter(c => c.status === 'available').length || 0,
      totalCourses: db.data?.courses.length || 0,
      totalEnrollments: db.data?.enrollments.length || 0,
      totalApplications: db.data?.jobApplications.length || 0,
      usersByRole: {
        farmer: db.data?.users.filter(u => u.role === 'farmer').length || 0,
        student: db.data?.users.filter(u => u.role === 'student').length || 0,
        learner: db.data?.users.filter(u => u.role === 'learner').length || 0,
        buyer: db.data?.users.filter(u => u.role === 'buyer').length || 0,
        admin: db.data?.users.filter(u => u.role === 'admin').length || 0
      },
      verifiedFarmers: db.data?.users.filter(u => u.role === 'farmer' && u.isVerified).length || 0,
      completedEnrollments: db.data?.enrollments.filter(e => e.completed).length || 0,
      certificatesIssued: db.data?.certificates.length || 0,
      verifiedProjects: db.data?.projectSubmissions.filter(s => s.status === 'verified').length || 0,
      activeJobs: db.data?.jobListings.filter(j => j.isActive).length || 0
    };
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
