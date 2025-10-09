import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getDb } from '@/lib/db';

// GET /api/admin/users - Get all users (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const db = await getDb();
    const currentUser = db.data?.users.find((u: any) => u.email === session.user?.email);
    
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Only admins can view users' }, { status: 403 });
    }
    
    const users = db.data?.users || [];
    
    // Remove sensitive password data
    const sanitizedUsers = users.map(u => ({
      ...u,
      password: undefined
    }));
    
    return NextResponse.json(sanitizedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
