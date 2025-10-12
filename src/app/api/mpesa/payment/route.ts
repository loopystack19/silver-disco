import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '@/lib/db';
import { initiateSTKPush, isValidKenyanPhone } from '@/lib/mpesa';

/**
 * POST /api/mpesa/payment
 * Initiates M-Pesa STK Push payment for a crop listing
 */
export async function POST(request: NextRequest) {
  try {
    // Check if user is logged in
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required. Please log in to make a payment.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { listingId, phoneNumber, quantity } = body;

    // Validate required fields
    if (!listingId || !phoneNumber) {
      return NextResponse.json(
        { error: 'Missing required fields: listingId and phoneNumber are required' },
        { status: 400 }
      );
    }

    // Validate phone number format
    if (!isValidKenyanPhone(phoneNumber)) {
      return NextResponse.json(
        { error: 'Invalid Kenyan phone number. Use format: +254XXXXXXXXX or 07XXXXXXXX' },
        { status: 400 }
      );
    }

    // Get database instance
    const db = await getDb();

    // Get buyer info
    const buyer = db.data.users.find((u) => u.email === session.user?.email);
    if (!buyer) {
      return NextResponse.json(
        { error: 'Buyer not found' },
        { status: 404 }
      );
    }

    // Get listing
    const listing = db.data.cropListings.find((l) => l.id === listingId);
    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Check if listing is available
    if (listing.status !== 'available') {
      return NextResponse.json(
        { error: 'This listing is no longer available for purchase' },
        { status: 400 }
      );
    }

    // Get farmer info
    const farmer = db.data.users.find((u) => u.id === listing.farmerId);
    if (!farmer) {
      return NextResponse.json(
        { error: 'Farmer not found' },
        { status: 404 }
      );
    }

    // Check if farmer is verified
    if (!farmer.isVerified) {
      return NextResponse.json(
        { error: 'Cannot purchase from unverified farmers. Please choose a verified farmer.' },
        { status: 400 }
      );
    }

    // Calculate quantity and amount
    const purchaseQuantity = quantity || listing.quantity;
    if (purchaseQuantity > listing.quantity) {
      return NextResponse.json(
        { error: `Only ${listing.quantity} ${listing.unit} available` },
        { status: 400 }
      );
    }

    const totalAmount = purchaseQuantity * listing.pricePerUnit;

    // Create transaction record (pending status)
    const transactionId = uuidv4();
    const transaction = {
      id: transactionId,
      listingId: listing.id,
      farmerId: listing.farmerId,
      buyerId: buyer.id,
      buyerPhone: phoneNumber,
      amount: totalAmount,
      quantity: purchaseQuantity,
      status: 'PENDING',
      timestamp: new Date().toISOString(),
      checkoutRequestId: '', // Will be updated after STK Push
      merchantRequestId: '',
      mpesaReceiptNumber: null,
    };

    // Initiate STK Push
    try {
      const stkPushResponse = await initiateSTKPush({
        phoneNumber,
        amount: totalAmount,
        accountReference: `CROP-${listingId.substring(0, 8)}`,
        transactionDesc: `Payment for ${listing.cropName}`,
      });

      // Update transaction with STK Push details
      transaction.checkoutRequestId = stkPushResponse.CheckoutRequestID;
      transaction.merchantRequestId = stkPushResponse.MerchantRequestID;

      // Save transaction to database
      db.data.transactions.push(transaction);
      await db.write();

      console.log('Transaction created:', transactionId);

      return NextResponse.json({
        success: true,
        message: 'Payment initiated. Please check your phone for the M-Pesa prompt.',
        transactionId,
        checkoutRequestId: stkPushResponse.CheckoutRequestID,
        customerMessage: stkPushResponse.CustomerMessage,
      });
    } catch (mpesaError: any) {
      console.error('M-Pesa STK Push error:', mpesaError);

      // Save failed transaction
      transaction.status = 'FAILED';
      db.data.transactions.push(transaction);
      await db.write();

      return NextResponse.json(
        {
          error: 'Failed to initiate M-Pesa payment',
          details: mpesaError.message || 'Please try again later',
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Payment endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/mpesa/payment?transactionId=xxx
 * Check payment status
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('transactionId');

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const transaction = db.data.transactions.find((t: any) => t.id === transactionId);

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      transactionId: transaction.id,
      status: transaction.status,
      amount: transaction.amount,
      timestamp: transaction.timestamp,
      mpesaReceiptNumber: transaction.mpesaReceiptNumber,
    });
  } catch (error: any) {
    console.error('Get payment status error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
