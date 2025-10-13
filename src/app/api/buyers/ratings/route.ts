import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { v4 as uuidv4 } from 'uuid';
import { getDb, saveDb } from '@/lib/db';
import { Rating } from '@/types/user';

/**
 * GET /api/buyers/ratings
 * Get ratings - either by buyer or for a specific farmer
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const farmerId = searchParams.get('farmerId');
    const listingId = searchParams.get('listingId');

    const db = await getDb();

    if (farmerId) {
      // Get all ratings for a specific farmer
      const ratings = db.data.ratings.filter((r) => r.farmerId === farmerId);

      // Calculate average rating
      const averageRating = ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;

      return NextResponse.json({
        ratings,
        averageRating: Math.round(averageRating * 10) / 10,
        totalRatings: ratings.length,
      });
    }

    if (listingId) {
      // Get all ratings for a specific listing
      const ratings = db.data.ratings.filter((r) => r.listingId === listingId);
      return NextResponse.json({ ratings });
    }

    // Get ratings by authenticated buyer
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const buyer = db.data.users.find((u) => u.email === session.user?.email);
    if (!buyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 });
    }

    const ratings = db.data.ratings.filter((r) => r.buyerId === buyer.id);

    // Sort by most recent first
    ratings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ ratings });
  } catch (error: any) {
    console.error('Error fetching ratings:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/buyers/ratings
 * Create a rating for a completed order
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
    const { orderId, rating, comment } = body;

    // Validate required fields
    if (!orderId || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId and rating' },
        { status: 400 }
      );
    }

    // Validate rating value
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const buyer = db.data.users.find((u) => u.email === session.user?.email);

    if (!buyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 });
    }

    // Get order
    const order = db.data.orders.find((o) => o.id === orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Verify order belongs to buyer
    if (order.buyerId !== buyer.id) {
      return NextResponse.json(
        { error: 'Unauthorized access to this order' },
        { status: 403 }
      );
    }

    // Check if order is completed
    if (order.status !== 'completed') {
      return NextResponse.json(
        { error: 'Can only rate completed orders' },
        { status: 400 }
      );
    }

    // Check if already rated
    const existingRating = db.data.ratings.find(
      (r) => r.orderId === orderId && r.buyerId === buyer.id
    );

    if (existingRating) {
      return NextResponse.json(
        { error: 'You have already rated this order' },
        { status: 400 }
      );
    }

    // Create rating
    const newRating: Rating = {
      id: uuidv4(),
      orderId,
      buyerId: buyer.id,
      buyerName: buyer.name,
      farmerId: order.farmerId,
      farmerName: order.farmerName,
      listingId: order.listingId,
      cropName: order.cropName,
      rating,
      comment: comment || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    db.data.ratings.push(newRating);
    await saveDb(db);

    return NextResponse.json({
      success: true,
      message: 'Rating submitted successfully',
      rating: newRating,
    });
  } catch (error: any) {
    console.error('Error creating rating:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/buyers/ratings/[id]
 * Update a rating (future feature)
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { ratingId, rating, comment } = body;

    if (!ratingId) {
      return NextResponse.json(
        { error: 'Missing required field: ratingId' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const buyer = db.data.users.find((u) => u.email === session.user?.email);

    if (!buyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 });
    }

    const existingRating = db.data.ratings.find((r) => r.id === ratingId);

    if (!existingRating) {
      return NextResponse.json({ error: 'Rating not found' }, { status: 404 });
    }

    // Verify rating belongs to buyer
    if (existingRating.buyerId !== buyer.id) {
      return NextResponse.json(
        { error: 'Unauthorized access to this rating' },
        { status: 403 }
      );
    }

    // Update rating
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return NextResponse.json(
          { error: 'Rating must be between 1 and 5' },
          { status: 400 }
        );
      }
      existingRating.rating = rating;
    }

    if (comment !== undefined) {
      existingRating.comment = comment;
    }

    existingRating.updatedAt = new Date();

    await saveDb(db);

    return NextResponse.json({
      success: true,
      message: 'Rating updated successfully',
      rating: existingRating,
    });
  } catch (error: any) {
    console.error('Error updating rating:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
