import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { v4 as uuidv4 } from 'uuid';
import { getDb, saveDb } from '@/lib/db';
import { CartItem } from '@/types/user';

/**
 * GET /api/buyers/cart
 * Get buyer's cart items with listing details
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

    // Get cart items for this buyer
    const cartItems = db.data.cartItems.filter((item) => item.buyerId === buyer.id);

    // Enrich cart items with listing details
    const enrichedCartItems = cartItems.map((item) => {
      const listing = db.data.cropListings.find((l) => l.id === item.listingId);
      return {
        ...item,
        listing,
      };
    }).filter((item) => item.listing); // Remove items where listing no longer exists

    return NextResponse.json({ cartItems: enrichedCartItems });
  } catch (error: any) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/buyers/cart
 * Add item to cart
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
    const { listingId, quantity } = body;

    if (!listingId || !quantity) {
      return NextResponse.json(
        { error: 'Missing required fields: listingId and quantity' },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      return NextResponse.json(
        { error: 'Quantity must be greater than 0' },
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

    // Check if item already in cart
    const existingCartItem = db.data.cartItems.find(
      (item) => item.buyerId === buyer.id && item.listingId === listingId
    );

    if (existingCartItem) {
      // Update quantity
      existingCartItem.quantity = quantity;
      existingCartItem.updatedAt = new Date();
    } else {
      // Add new cart item
      const cartItem: CartItem = {
        id: uuidv4(),
        buyerId: buyer.id,
        listingId,
        quantity,
        addedAt: new Date(),
        updatedAt: new Date(),
      };
      db.data.cartItems.push(cartItem);
    }

    await saveDb(db);

    return NextResponse.json({
      success: true,
      message: 'Item added to cart',
    });
  } catch (error: any) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/buyers/cart
 * Remove item from cart or clear cart
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
    const itemId = searchParams.get('itemId');
    const clearAll = searchParams.get('clearAll') === 'true';

    const db = await getDb();
    const buyer = db.data.users.find((u) => u.email === session.user?.email);

    if (!buyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 });
    }

    if (clearAll) {
      // Remove all cart items for this buyer
      db.data.cartItems = db.data.cartItems.filter(
        (item) => item.buyerId !== buyer.id
      );
    } else if (itemId) {
      // Remove specific item
      const itemIndex = db.data.cartItems.findIndex(
        (item) => item.id === itemId && item.buyerId === buyer.id
      );

      if (itemIndex === -1) {
        return NextResponse.json(
          { error: 'Cart item not found' },
          { status: 404 }
        );
      }

      db.data.cartItems.splice(itemIndex, 1);
    } else {
      return NextResponse.json(
        { error: 'Either itemId or clearAll parameter is required' },
        { status: 400 }
      );
    }

    await saveDb(db);

    return NextResponse.json({
      success: true,
      message: clearAll ? 'Cart cleared' : 'Item removed from cart',
    });
  } catch (error: any) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
