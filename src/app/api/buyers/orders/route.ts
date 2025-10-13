import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { v4 as uuidv4 } from 'uuid';
import { getDb, saveDb } from '@/lib/db';
import { Order } from '@/types/user';

/**
 * GET /api/buyers/orders
 * Get all orders for the authenticated buyer
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
    const buyer = db.data.users.find((u) => u.email === session.user?.email);

    if (!buyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 });
    }

    // Get all orders for this buyer
    const orders = db.data.orders.filter((order) => order.buyerId === buyer.id);

    // Sort by most recent first
    orders.sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime());

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/buyers/orders
 * Create a new order
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { listingId, quantity, deliveryDetails, transactionId } = body;

    // Validate required fields
    if (!listingId || !quantity || !deliveryDetails) {
      return NextResponse.json(
        { error: 'Missing required fields: listingId, quantity, and deliveryDetails are required' },
        { status: 400 }
      );
    }

    // Validate delivery details
    if (!deliveryDetails.name || !deliveryDetails.phone || !deliveryDetails.county) {
      return NextResponse.json(
        { error: 'Delivery details must include name, phone, and county' },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Get buyer info
    const buyer = db.data.users.find((u) => u.email === session.user?.email);
    if (!buyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 });
    }

    // Get listing
    const listing = db.data.cropListings.find((l) => l.id === listingId);
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Check if listing is available
    if (listing.status !== 'available') {
      return NextResponse.json(
        { error: 'This listing is no longer available' },
        { status: 400 }
      );
    }

    // Check quantity
    if (quantity > listing.quantity) {
      return NextResponse.json(
        { error: `Only ${listing.quantity} ${listing.unit} available` },
        { status: 400 }
      );
    }

    // Get farmer info
    const farmer = db.data.users.find((u) => u.id === listing.farmerId);
    if (!farmer) {
      return NextResponse.json({ error: 'Farmer not found' }, { status: 404 });
    }

    // Check if farmer is verified
    if (!farmer.isVerified) {
      return NextResponse.json(
        { error: 'Cannot purchase from unverified farmers' },
        { status: 400 }
      );
    }

    const totalAmount = quantity * listing.pricePerUnit;

    // Create order
    const order: Order = {
      id: uuidv4(),
      buyerId: buyer.id,
      buyerName: buyer.name,
      buyerEmail: buyer.email,
      farmerId: listing.farmerId,
      farmerName: listing.farmerName,
      listingId: listing.id,
      cropName: listing.cropName,
      quantity,
      unit: listing.unit,
      pricePerUnit: listing.pricePerUnit,
      totalAmount,
      status: 'pending',
      deliveryDetails,
      transactionId,
      placedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    db.data.orders.push(order);

    // Update listing quantity
    listing.quantity -= quantity;
    if (listing.quantity === 0) {
      listing.status = 'sold';
    }
    listing.updatedAt = new Date();

    await saveDb(db);

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      order,
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
