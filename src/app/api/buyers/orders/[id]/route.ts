import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getDb, saveDb } from '@/lib/db';

/**
 * GET /api/buyers/orders/[id]
 * Get a specific order by ID
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
    const buyer = db.data.users.find((u) => u.email === session.user?.email);

    if (!buyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 });
    }

    const order = db.data.orders.find((o) => o.id === params.id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if this order belongs to the authenticated buyer
    if (order.buyerId !== buyer.id) {
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
 * PATCH /api/buyers/orders/[id]
 * Update order status (cancel order)
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
    const { status, cancellationReason } = body;

    const db = await getDb();
    const buyer = db.data.users.find((u) => u.email === session.user?.email);

    if (!buyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 });
    }

    const order = db.data.orders.find((o) => o.id === params.id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if this order belongs to the authenticated buyer
    if (order.buyerId !== buyer.id) {
      return NextResponse.json(
        { error: 'Unauthorized access to this order' },
        { status: 403 }
      );
    }

    // Only allow cancellation if order is pending or confirmed
    if (status === 'cancelled') {
      if (order.status === 'shipped' || order.status === 'completed') {
        return NextResponse.json(
          { error: 'Cannot cancel order that has been shipped or completed' },
          { status: 400 }
        );
      }

      order.status = 'cancelled';
      order.cancelledAt = new Date();
      order.cancellationReason = cancellationReason || 'Cancelled by buyer';
      order.updatedAt = new Date();

      // Restore listing quantity
      const listing = db.data.cropListings.find((l) => l.id === order.listingId);
      if (listing) {
        listing.quantity += order.quantity;
        if (listing.status === 'sold' && listing.quantity > 0) {
          listing.status = 'available';
        }
        listing.updatedAt = new Date();
      }

      await saveDb(db);

      return NextResponse.json({
        success: true,
        message: 'Order cancelled successfully',
        order,
      });
    }

    return NextResponse.json(
      { error: 'Invalid status update' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
