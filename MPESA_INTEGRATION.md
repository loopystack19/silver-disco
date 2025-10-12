# M-Pesa Integration Guide for UmojaHub Marketplace

## Overview

This document provides complete instructions for testing and using the M-Pesa payment integration in the UmojaHub Farmers Marketplace.

## Table of Contents

1. [Features Implemented](#features-implemented)
2. [Setup Instructions](#setup-instructions)
3. [Testing the Integration](#testing-the-integration)
4. [API Documentation](#api-documentation)
5. [Troubleshooting](#troubleshooting)
6. [Production Deployment](#production-deployment)

---

## Features Implemented

### ✅ Core Features

- **M-Pesa STK Push (Lipa Na M-Pesa Online)**: Direct payment from buyer's phone
- **Verified Farmer Requirement**: Only verified farmers can receive payments
- **Automatic Listing Updates**: Listings marked as "sold" after successful payment
- **Transaction Logging**: All transactions stored in database with status tracking
- **Real-time Payment Status**: Modal polls for payment confirmation
- **Phone Number Validation**: Supports multiple Kenyan formats (+254, 254, 07, 7)
- **Quantity Selection**: Buyers can purchase partial quantities
- **Security**: User authentication required, input sanitization, error handling

### 🎯 User Experience

- **Eligibility Check**: M-Pesa button only shows for:
  - Listings with `status = "available"`
  - Farmers with `isVerified = true`
- **Payment Modal**: Clean, intuitive interface with:
  - Listing details (crop name, price, farmer info)
  - Phone number input with format validation
  - Quantity selector
  - Total price calculation
  - Loading states and error messages
  - Success confirmation with auto-refresh

---

## Setup Instructions

### 1. Environment Variables

The `.env` file has been configured with the following M-Pesa credentials:

```env
# M-Pesa Configuration
MPESA_CONSUMER_KEY=2RRFAmCxC5FRWpGwLmYLOAoQvUB2FF7LGQ5DQWKwSh2oSfRf
MPESA_CONSUMER_SECRET=5lq7GLPiNxc9TXlgVBuXM7juE5H8GmAAJc4rtrkWfwkOaZgPk8UDclbW5Oyjiyju
MPESA_SHORTCODE=174379
MPESA_PASSKEY=<ADD_YOUR_PASSKEY_HERE>
MPESA_CALLBACK_URL=http://localhost:3001/api/mpesa/callback
```

**⚠️ IMPORTANT**: You need to add the `MPESA_PASSKEY` from your Safaricom Daraja portal.

### 2. Safaricom Sandbox Credentials

For testing, use the Safaricom Sandbox environment:

- **Test Shortcode**: `174379`
- **Test Phone Number**: `254708374149`
- **Passkey**: Get from [Safaricom Daraja Portal](https://developer.safaricom.co.ke/)

### 3. Database Setup

The transactions collection has been added to `db.json`:

```json
{
  "transactions": []
}
```

No additional setup needed - the system will automatically populate this collection.

### 4. Install Dependencies (if needed)

All required dependencies are already in `package.json`. Run:

```bash
npm install
```

---

## Testing the Integration

### Step 1: Start the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3001`

### Step 2: Log In as a Buyer

Navigate to `/login` and use a buyer account:

**Test Buyer Account**:
- Email: `buyer1@example.com`
- Password: `password123`

Or create a new account with role "buyer".

### Step 3: Browse Marketplace

1. Go to `/marketplace`
2. You'll see crop listings from various farmers
3. Look for listings with:
   - Status: **Available** (green badge)
   - Farmer has **verified badge** (✓)

### Step 4: Initiate M-Pesa Payment

1. Click the **"M-Pesa"** button on an eligible listing
2. Payment modal will open showing:
   - Crop details
   - Farmer name and location
   - Price per unit and available quantity

### Step 5: Enter Payment Details

1. **Phone Number**: Enter Kenyan phone in any format:
   - `+254708374149` (sandbox test number)
   - `254708374149`
   - `0708374149`
   - `708374149`

2. **Quantity**: Select how many units to purchase (default is full quantity)

3. **Total Amount**: Automatically calculated

4. Click **"Pay with M-Pesa"**

### Step 6: Complete Payment (Sandbox)

**In Sandbox Mode**:

Since you're using the sandbox, you'll need to simulate the payment:

1. After clicking "Pay with M-Pesa", the modal shows "Awaiting confirmation..."
2. The backend sends an STK Push request to Safaricom sandbox
3. To simulate payment completion, use Safaricom's **Simulator Tool** at:
   - [Daraja Sandbox Simulator](https://developer.safaricom.co.ke/test_credentials)

**Or manually trigger callback**:

```bash
curl -X POST http://localhost:3001/api/mpesa/callback \
  -H "Content-Type: application/json" \
  -d '{
    "Body": {
      "stkCallback": {
        "MerchantRequestID": "test-merchant-id",
        "CheckoutRequestID": "<CHECKOUT_REQUEST_ID_FROM_TRANSACTION>",
        "ResultCode": 0,
        "ResultDesc": "The service request is processed successfully.",
        "CallbackMetadata": {
          "Item": [
            {"Name": "Amount", "Value": 3500},
            {"Name": "MpesaReceiptNumber", "Value": "ABC123XYZ"},
            {"Name": "TransactionDate", "Value": 20250112120000},
            {"Name": "PhoneNumber", "Value": 254708374149}
          ]
        }
      }
    }
  }'
```

### Step 7: Verify Success

After successful payment:

1. Modal shows **"Payment Successful!"** message
2. Listing automatically updates:
   - If full quantity purchased: Status → `"sold"`
   - If partial: Quantity reduces
3. Transaction recorded in `db.json` → `transactions` collection
4. Page refreshes to show updated listing

---

## API Documentation

### 1. Initiate Payment

**Endpoint**: `POST /api/mpesa/payment`

**Request Body**:
```json
{
  "listingId": "055961ac-271d-4a6f-b873-1723f6477dee",
  "phoneNumber": "+254708374149",
  "quantity": 10
}
```

**Response (Success)**:
```json
{
  "success": true,
  "message": "Payment initiated. Please check your phone for the M-Pesa prompt.",
  "transactionId": "uuid-here",
  "checkoutRequestId": "ws_CO_xxx",
  "customerMessage": "Success. Request accepted for processing"
}
```

**Response (Error)**:
```json
{
  "error": "Invalid Kenyan phone number. Use format: +254XXXXXXXXX or 07XXXXXXXX"
}
```

**Validation Rules**:
- User must be authenticated
- Listing must exist and be `available`
- Farmer must be verified (`isVerified = true`)
- Phone number must be valid Kenyan format
- Quantity must be ≤ available quantity

### 2. Payment Callback

**Endpoint**: `POST /api/mpesa/callback`

**Request Body** (from Safaricom):
```json
{
  "Body": {
    "stkCallback": {
      "MerchantRequestID": "string",
      "CheckoutRequestID": "string",
      "ResultCode": 0,
      "ResultDesc": "The service request is processed successfully.",
      "CallbackMetadata": {
        "Item": [
          {"Name": "Amount", "Value": 3500},
          {"Name": "MpesaReceiptNumber", "Value": "ABC123XYZ"},
          {"Name": "TransactionDate", "Value": 20250112120000},
          {"Name": "PhoneNumber", "Value": 254708374149}
        ]
      }
    }
  }
}
```

**Response**:
```json
{
  "ResultCode": 0,
  "ResultDesc": "Payment processed successfully"
}
```

**What Happens**:
1. Finds transaction by `CheckoutRequestID`
2. If `ResultCode = 0`:
   - Updates transaction status to `SUCCESS`
   - Stores M-Pesa receipt number
   - Updates listing:
     - Marks as `sold` if full quantity purchased
     - Reduces quantity if partial
3. If `ResultCode ≠ 0`:
   - Marks transaction as `FAILED`

### 3. Check Payment Status

**Endpoint**: `GET /api/mpesa/payment?transactionId=xxx`

**Response**:
```json
{
  "transactionId": "uuid",
  "status": "SUCCESS",
  "amount": 3500,
  "timestamp": "2025-01-12T10:30:00Z",
  "mpesaReceiptNumber": "ABC123XYZ"
}
```

---

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── mpesa/
│   │       ├── payment/
│   │       │   └── route.ts          # Payment initiation endpoint
│   │       └── callback/
│   │           └── route.ts          # M-Pesa callback handler
│   └── marketplace/
│       └── page.tsx                  # Updated with M-Pesa button
├── components/
│   └── marketplace/
│       └── MpesaPaymentModal.tsx     # Payment modal component
├── lib/
│   └── mpesa.ts                      # M-Pesa utility functions
└── types/
    └── user.ts                       # Transaction types
```

---

## Troubleshooting

### Issue: "M-Pesa credentials not configured"

**Solution**: Ensure all environment variables are set in `.env`:
- `MPESA_CONSUMER_KEY`
- `MPESA_CONSUMER_SECRET`
- `MPESA_SHORTCODE`
- `MPESA_PASSKEY` ← **Most common missing value**
- `MPESA_CALLBACK_URL`

### Issue: "Invalid Kenyan phone number"

**Solution**: Use correct format:
- ✅ `+254712345678`
- ✅ `254712345678`
- ✅ `0712345678`
- ✅ `712345678`
- ❌ `+1234567890` (non-Kenyan)

### Issue: "Cannot purchase from unverified farmers"

**Solution**: Ensure the farmer has `isVerified = true` in `db.json`.

To verify a farmer manually:
```json
{
  "id": "farmer-id",
  "isVerified": true,
  "verifiedAt": "2025-01-12T00:00:00.000Z"
}
```

### Issue: Payment stuck at "Awaiting confirmation"

**Solution**:
1. Check if callback URL is accessible
2. In sandbox, manually trigger callback (see testing steps)
3. Check transaction status: `GET /api/mpesa/payment?transactionId=xxx`

### Issue: "Listing not marked as sold after payment"

**Solution**: Check callback logs in server console. Ensure:
- `ResultCode = 0` in callback
- Transaction `CheckoutRequestID` matches
- Listing `id` exists in database

---

## Production Deployment

### 1. Switch to Production Environment

Update `.env`:

```env
# Change to production URLs
MPESA_CALLBACK_URL=https://yourdomain.com/api/mpesa/callback
```

Use **production credentials** from Safaricom Daraja:
- Different `MPESA_CONSUMER_KEY`
- Different `MPESA_CONSUMER_SECRET`
- Production `MPESA_SHORTCODE` (your PayBill/Till number)
- Production `MPESA_PASSKEY`

### 2. Expose Callback URL

M-Pesa needs to reach your callback endpoint. Options:

**Option A: Deploy to Cloud**
- Vercel, Railway, Render, etc.
- Update `MPESA_CALLBACK_URL` to your deployed URL

**Option B: Use ngrok (for local testing)**
```bash
ngrok http 3001
# Update MPESA_CALLBACK_URL to: https://xxxxx.ngrok.io/api/mpesa/callback
```

### 3. Security Checklist

- [ ] Never commit `.env` to Git
- [ ] Use HTTPS for callback URL (required by Safaricom)
- [ ] Implement rate limiting on payment endpoint
- [ ] Add request signing/verification for callbacks
- [ ] Set up monitoring and alerting for failed payments
- [ ] Implement transaction reconciliation
- [ ] Add email/SMS notifications for buyers and farmers

### 4. Go-Live Checklist

- [ ] Test with real M-Pesa account (small amounts first)
- [ ] Verify callback URL is publicly accessible
- [ ] Check server logs for any errors
- [ ] Test failure scenarios (cancelled payments, network errors)
- [ ] Set up customer support process
- [ ] Document refund procedures

---

## Testing Scenarios

### Scenario 1: Successful Payment
1. Buyer logs in
2. Selects verified farmer listing
3. Enters valid phone number
4. Completes payment
5. **Expected**: Listing updates, transaction logged, buyer sees success message

### Scenario 2: Unverified Farmer
1. Buyer browses marketplace
2. Finds listing from unverified farmer
3. **Expected**: No M-Pesa button shown, shows "Unavailable" instead

### Scenario 3: Payment Failure
1. Buyer initiates payment
2. Cancels M-Pesa prompt on phone
3. **Expected**: Transaction marked as FAILED, listing remains available

### Scenario 4: Partial Purchase
1. Listing has 100 bags available
2. Buyer purchases 20 bags
3. **Expected**: Listing quantity updates to 80 bags, status remains "available"

### Scenario 5: Full Purchase
1. Listing has 50 bags available
2. Buyer purchases all 50 bags
3. **Expected**: Listing marked as "sold", quantity = 0

---

## Contact & Support

For issues or questions:
- Check server logs: `npm run dev` console output
- Inspect `db.json` → `transactions` collection
- Review Safaricom Daraja documentation: https://developer.safaricom.co.ke

---

## Summary

The M-Pesa integration is **fully functional** and ready for testing!

**Next Steps**:
1. Add your `MPESA_PASSKEY` to `.env`
2. Start the server: `npm run dev`
3. Log in as a buyer
4. Test payment flow with sandbox credentials
5. Review transaction logs in `db.json`

Happy testing! 🚀
