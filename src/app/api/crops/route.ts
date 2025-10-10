import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { v4 as uuidv4 } from 'uuid';
import { getDb, saveDb } from '@/lib/db';
import { CropListing, User } from '@/types/user';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';

// GET all crop listings (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const location = searchParams.get('location');
    const status = searchParams.get('status');
    const farmerId = searchParams.get('farmerId');
    const sort = searchParams.get('sort') || 'newest';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const db = await getDb();
    let listings = [...db.data.cropListings];

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      listings = listings.filter(
        (listing) =>
          listing.cropName.toLowerCase().includes(searchLower) ||
          listing.farmerName.toLowerCase().includes(searchLower) ||
          listing.description.toLowerCase().includes(searchLower)
      );
    }

    if (location) {
      listings = listings.filter(
        (listing) => listing.location.toLowerCase() === location.toLowerCase()
      );
    }

    if (status) {
      listings = listings.filter((listing) => listing.status === status);
    }

    if (farmerId) {
      listings = listings.filter((listing) => listing.farmerId === farmerId);
    }

    if (minPrice) {
      listings = listings.filter(
        (listing) => listing.pricePerUnit >= parseFloat(minPrice)
      );
    }

    if (maxPrice) {
      listings = listings.filter(
        (listing) => listing.pricePerUnit <= parseFloat(maxPrice)
      );
    }

    // Apply sorting
    switch (sort) {
      case 'newest':
        listings.sort(
          (a, b) =>
            new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime()
        );
        break;
      case 'oldest':
        listings.sort(
          (a, b) =>
            new Date(a.datePosted).getTime() - new Date(b.datePosted).getTime()
        );
        break;
      case 'price-low':
        listings.sort((a, b) => a.pricePerUnit - b.pricePerUnit);
        break;
      case 'price-high':
        listings.sort((a, b) => b.pricePerUnit - a.pricePerUnit);
        break;
      case 'location':
        listings.sort((a, b) => a.location.localeCompare(b.location));
        break;
    }

    return NextResponse.json({ listings }, { status: 200 });
  } catch (error) {
    console.error('Error fetching crop listings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new crop listing (authenticated farmers only)
export async function POST(request: NextRequest) {
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

    // Check if user is a farmer
    if (user.role !== 'farmer') {
      return NextResponse.json(
        { error: 'Only farmers can create crop listings' },
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
    const imageFile = formData.get('image') as File | null;

    // Validate required fields
    if (
      !cropName ||
      !quantity ||
      !unit ||
      !pricePerUnit ||
      !description ||
      !location
    ) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate image upload
    if (!imageFile) {
      return NextResponse.json(
        { error: 'Please upload a crop image before submitting your listing.' },
        { status: 400 }
      );
    }

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
    } catch (imageError) {
      console.error('Error processing image:', imageError);
      return NextResponse.json(
        { error: 'Failed to process image' },
        { status: 500 }
      );
    }

    // Store relative path for database
    const imagePath = `/uploads/crops/${uniqueFilename}`;

    // Create new crop listing
    const newListing: CropListing = {
      id: uuidv4(),
      farmerId: user.id,
      farmerName: user.name,
      cropName,
      quantity: parseFloat(quantity),
      unit,
      pricePerUnit: parseFloat(pricePerUnit),
      description,
      location,
      datePosted: new Date(),
      status: 'available',
      image: imagePath,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    db.data.cropListings.push(newListing);
    await saveDb(db);

    return NextResponse.json(
      {
        message: 'Crop listing created successfully',
        listing: newListing,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating crop listing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
