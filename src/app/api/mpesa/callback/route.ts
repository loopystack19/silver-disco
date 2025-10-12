import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { parseCallbackMetadata, MpesaCallback } from '@/lib/mpesa';

/**
 * POST /api/mpesa/callback
 * Handles M-Pesa payment callback from Safaricom
 * This endpoint is called by M-Pesa servers after payment is processed
 */
export async function POST(request: NextRequest) {
  try {
    const callback: MpesaCallback = await request.json();

    console.log('M-Pesa Callback received:', JSON.stringify(callback, null, 2));

    const { stkCallback } = callback.Body;
    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc } = stkCallback;

    // Get database instance
    const db = await getDb();

    // Find transaction by CheckoutRequestID
    const transaction = db.data.transactions.find(
      (t: any) => t.checkoutRequestId === CheckoutRequestID
    );

    if (!transaction) {
      console.error('Transaction not found for CheckoutRequestID:', CheckoutRequestID);
      // Still return success to M-Pesa to avoid retries
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' });
    }

    // ResultCode 0 = Success
    if (ResultCode === 0) {
      // Parse callback metadata
      const metadata = parseCallbackMetadata(callback);

      // Update transaction as successful
      transaction.status = 'SUCCESS';
      transaction.mpesaReceiptNumber = metadata.MpesaReceiptNumber || null;
      transaction.updatedAt = new Date().toISOString();

      // Find the listing and update its status to sold
      const listing = db.data.cropListings.find(
        (l: any) => l.id === transaction.listingId
      );

      if (listing) {
        // Update listing quantity or mark as sold
        if (transaction.quantity >= listing.quantity) {
          listing.status = 'sold';
          listing.quantity = 0;
        } else {
          listing.quantity -= transaction.quantity;
        }
        listing.updatedAt = new Date().toISOString();
        console.log(`Listing ${listing.id} updated: status=${listing.status}, quantity=${listing.quantity}`);
      }

      await db.write();

      console.log(`Transaction ${transaction.id} marked as SUCCESS`);
      console.log(`M-Pesa Receipt: ${metadata.MpesaReceiptNumber}`);

      // TODO: Send notifications to buyer and farmer
      // - Email notification
      // - SMS notification
      // - In-app notification

      return NextResponse.json({
        ResultCode: 0,
        ResultDesc: 'Payment processed successfully',
      });
    } else {
      // Payment failed or was cancelled
      transaction.status = 'FAILED';
      transaction.updatedAt = new Date().toISOString();
      await db.write();

      console.log(`Transaction ${transaction.id} marked as FAILED: ${ResultDesc}`);

      return NextResponse.json({
        ResultCode: 0,
        ResultDesc: 'Callback received',
      });
    }
  } catch (error: any) {
    console.error('M-Pesa callback processing error:', error);

    // Log the error but still return success to M-Pesa
    // to prevent callback retries
    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: 'Callback received',
    });
  }
}

/**
 * GET /api/mpesa/callback
 * For testing purposes - confirms callback URL is accessible
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'M-Pesa callback endpoint is active',
    timestamp: new Date().toISOString(),
  });
}
