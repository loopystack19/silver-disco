import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { v4 as uuidv4 } from 'uuid';
import { getDb, saveDb } from '@/lib/db';
import { Favorite } from '@/types/user';

/**
 * GET /api/buyers/favorites
 * Get buyer's favorite listings
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

    // Get favorites for this buyer
    const favorites = db.data.favorites.filter((fav) => fav.buyerId === buyer.id);

    // Enrich favorites with listing details
    const enrichedFavorites = favorites.map((fav) => {
      const listing = db.data.cropListings.find((l) => l.id === fav.listingId);
      return {
        ...fav,
        listing,
      };
    }).filter((fav) => fav.listing); // Remove favorites where listing no longer exists

    // Sort by most recent first
    enrichedFavorites.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());

    return NextResponse.json({ favorites: enrichedFavorites });
  } catch (error: any) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/buyers/favorites
 * Add listing to favorites
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
    const { listingId } = body;

    if (!listingId) {
      return NextResponse.json(
        { error: 'Missing required field: listingId' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const buyer = db.data.users.find((u) => u.email === session.user?.email);

    if (!buyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 });
    }

    // Check if listing exists
    const listing = db.data.cropListings.find((l) => l.id === listingId);
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Check if already favorited
    const existingFavorite = db.data.favorites.find(
      (fav) => fav.buyerId === buyer.id && fav.listingId === listingId
    );

    if (existingFavorite) {
      return NextResponse.json(
        { error: 'Listing already in favorites' },
        { status: 400 }
      );
    }

    // Add to favorites
    const favorite: Favorite = {
      id: uuidv4(),
      buyerId: buyer.id,
      listingId,
      cropName: listing.cropName,
      farmerName: listing.farmerName,
      addedAt: new Date(),
    };

    db.data.favorites.push(favorite);
    await saveDb(db);

    return NextResponse.json({
      success: true,
      message: 'Added to favorites',
      favorite,
    });
  } catch (error: any) {
    console.error('Error adding to favorites:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/buyers/favorites?listingId=xxx
 * Remove listing from favorites
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get('listingId');

    if (!listingId) {
      return NextResponse.json(
        { error: 'Missing required parameter: listingId' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const buyer = db.data.users.find((u) => u.email === session.user?.email);

    if (!buyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 });
    }

    // Find and remove favorite
    const favoriteIndex = db.data.favorites.findIndex(
      (fav) => fav.buyerId === buyer.id && fav.listingId === listingId
    );

    if (favoriteIndex === -1) {
      return NextResponse.json(
        { error: 'Favorite not found' },
        { status: 404 }
      );
    }

    db.data.favorites.splice(favoriteIndex, 1);
    await saveDb(db);

    return NextResponse.json({
      success: true,
      message: 'Removed from favorites',
    });
  } catch (error: any) {
    console.error('Error removing from favorites:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
