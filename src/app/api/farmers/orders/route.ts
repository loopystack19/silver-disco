import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getDb } from '@/lib/db';

/**
 * GET /api/farmers/orders
 * Get all orders for the authenticated farmer's listings
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const db = await getDb();
    const farmer = db.data.users.find((u) => u.email === session.user?.email);

    if (!farmer) {
      return NextResponse.json({ error: 'Farmer not found' }, { status: 404 });
    }

    // Check if user is a farmer
    if (farmer.role !== 'farmer') {
      return NextResponse.json(
        { error: 'Only farmers can access this endpoint' },
        { status: 403 }
      );
    }

    // Get all orders for this farmer's listings
    const orders = db.data.orders.filter((order) => order.farmerId === farmer.id);

    // Sort by most recent first
    orders.sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime());

    // Group orders by status for dashboard stats
    const stats = {
      pending: orders.filter((o) => o.status === 'pending').length,
      confirmed: orders.filter((o) => o.status === 'confirmed').length,
      shipped: orders.filter((o) => o.status === 'shipped').length,
      completed: orders.filter((o) => o.status === 'completed').length,
      cancelled: orders.filter((o) => o.status === 'cancelled').length,
      total: orders.length,
    };

    return NextResponse.json({ orders, stats });
  } catch (error: any) {
    console.error('Error fetching farmer orders:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
