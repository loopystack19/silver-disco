import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getDb, saveDb } from '@/lib/db';
import { CropListing, User } from '@/types/user';

// GET single crop listing
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDb();
    const listing = db.data.cropListings.find((l) => l.id === params.id);

    if (!listing) {
      return NextResponse.json(
        { error: 'Crop listing not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ listing }, { status: 200 });
  } catch (error) {
    console.error('Error fetching crop listing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT/PATCH update crop listing
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    const db = await getDb();

    // Find the user
    const user = db.data.users.find(
      (u: User) => u.email === session.user.email
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find the listing
    const listingIndex = db.data.cropListings.findIndex(
      (l) => l.id === params.id
    );

    if (listingIndex === -1) {
      return NextResponse.json(
        { error: 'Crop listing not found' },
        { status: 404 }
      );
    }

    const listing = db.data.cropListings[listingIndex];

    // Check if user owns this listing
    if (listing.farmerId !== user.id) {
      return NextResponse.json(
        { error: 'You can only update your own listings' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      cropName,
      quantity,
      unit,
      pricePerUnit,
      description,
      location,
      status,
      image,
    } = body;

    // Update listing
    const updatedListing: CropListing = {
      ...listing,
      cropName: cropName || listing.cropName,
      quantity: quantity !== undefined ? parseFloat(quantity) : listing.quantity,
      unit: unit || listing.unit,
      pricePerUnit:
        pricePerUnit !== undefined
          ? parseFloat(pricePerUnit)
          : listing.pricePerUnit,
      description: description || listing.description,
      location: location || listing.location,
      status: status || listing.status,
      image: image || listing.image,
      updatedAt: new Date(),
    };

    db.data.cropListings[listingIndex] = updatedListing;
    await saveDb(db);

    return NextResponse.json(
      {
        message: 'Crop listing updated successfully',
        listing: updatedListing,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating crop listing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return PUT(request, { params });
}

// DELETE crop listing
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    const db = await getDb();

    // Find the user
    const user = db.data.users.find(
      (u: User) => u.email === session.user.email
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find the listing
    const listingIndex = db.data.cropListings.findIndex(
      (l) => l.id === params.id
    );

    if (listingIndex === -1) {
      return NextResponse.json(
        { error: 'Crop listing not found' },
        { status: 404 }
      );
    }

    const listing = db.data.cropListings[listingIndex];

    // Check if user owns this listing or is admin
    if (listing.farmerId !== user.id && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'You can only delete your own listings' },
        { status: 403 }
      );
    }

    // Remove listing
    db.data.cropListings.splice(listingIndex, 1);
    await saveDb(db);

    return NextResponse.json(
      { message: 'Crop listing deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting crop listing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
