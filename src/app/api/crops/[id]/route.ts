import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getDb, saveDb } from '@/lib/db';
import { CropListing, User } from '@/types/user';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

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

    // Parse FormData for file upload
    const formData = await request.formData();
    const cropName = formData.get('cropName') as string;
    const quantity = formData.get('quantity') as string;
    const unit = formData.get('unit') as string;
    const pricePerUnit = formData.get('pricePerUnit') as string;
    const description = formData.get('description') as string;
    const location = formData.get('location') as string;
    const statusValue = formData.get('status') as string;
    const imageFile = formData.get('image') as File | null;

    let imagePath = listing.image;

    // Handle new image upload if provided
    if (imageFile && imageFile.size > 0) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(imageFile.type)) {
        return NextResponse.json(
          { error: 'Invalid file type. Only JPG, JPEG, PNG, and WEBP images are allowed.' },
          { status: 400 }
        );
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (imageFile.size > maxSize) {
        return NextResponse.json(
          { error: 'File size exceeds 5MB limit.' },
          { status: 400 }
        );
      }

      // Generate unique filename
      const fileExtension = imageFile.name.split('.').pop();
      const uniqueFilename = `${uuidv4()}.${fileExtension}`;
      const uploadPath = join(process.cwd(), 'public', 'uploads', 'crops', uniqueFilename);

      // Convert file to buffer
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Compress and optimize image using sharp
      try {
        await sharp(buffer)
          .resize(1200, 1200, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .jpeg({ quality: 85 })
          .toFile(uploadPath);
        
        // Update image path
        imagePath = `/uploads/crops/${uniqueFilename}`;
      } catch (imageError) {
        console.error('Error processing image:', imageError);
        return NextResponse.json(
          { error: 'Failed to process image' },
          { status: 500 }
        );
      }
    }

    // Update listing
    const updatedListing: CropListing = {
      ...listing,
      cropName: cropName || listing.cropName,
      quantity: quantity ? parseFloat(quantity) : listing.quantity,
      unit: unit || listing.unit,
      pricePerUnit: pricePerUnit ? parseFloat(pricePerUnit) : listing.pricePerUnit,
      description: description || listing.description,
      location: location || listing.location,
      status: (statusValue as CropListing['status']) || listing.status,
      image: imagePath,
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
