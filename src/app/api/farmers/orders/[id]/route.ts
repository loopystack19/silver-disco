import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getDb, saveDb } from '@/lib/db';

/**
 * GET /api/farmers/orders/[id]
 * Get specific order details for farmer
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const order = db.data.orders.find((o) => o.id === params.id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if this order belongs to the authenticated farmer
    if (order.farmerId !== farmer.id) {
      return NextResponse.json(
        { error: 'Unauthorized access to this order' },
        { status: 403 }
      );
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/farmers/orders/[id]
 * Update order status (confirm, ship, complete)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action } = body; // 'confirm', 'ship', 'complete'

    if (!action || !['confirm', 'ship', 'complete'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be: confirm, ship, or complete' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const farmer = db.data.users.find((u) => u.email === session.user?.email);

    if (!farmer) {
      return NextResponse.json({ error: 'Farmer not found' }, { status: 404 });
    }

    const order = db.data.orders.find((o) => o.id === params.id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if this order belongs to the authenticated farmer
    if (order.farmerId !== farmer.id) {
      return NextResponse.json(
        { error: 'Unauthorized access to this order' },
        { status: 403 }
      );
    }

    // Validate status transitions
    if (action === 'confirm') {
      if (order.status !== 'pending') {
        return NextResponse.json(
          { error: 'Only pending orders can be confirmed' },
          { status: 400 }
        );
      }
      order.status = 'confirmed';
      order.confirmedAt = new Date();
    } else if (action === 'ship') {
      if (order.status !== 'confirmed') {
        return NextResponse.json(
          { error: 'Only confirmed orders can be shipped' },
          { status: 400 }
        );
      }
      order.status = 'shipped';
      order.shippedAt = new Date();
    } else if (action === 'complete') {
      if (order.status !== 'shipped') {
        return NextResponse.json(
          { error: 'Only shipped orders can be completed' },
          { status: 400 }
        );
      }
      order.status = 'completed';
      order.completedAt = new Date();
    }

    order.updatedAt = new Date();

    await saveDb(db);

    return NextResponse.json({
      success: true,
      message: `Order ${action}ed successfully`,
      order,
    });
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
