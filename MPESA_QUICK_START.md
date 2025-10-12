# M-Pesa Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### Step 1: Add Passkey
Open `.env` and add your M-Pesa passkey:

```env
MPESA_PASSKEY=your_passkey_here
```

Get your passkey from: https://developer.safaricom.co.ke/

### Step 2: Start the Server
```bash
npm run dev
```

### Step 3: Test the Flow

1. **Go to Marketplace**: http://localhost:3001/marketplace

2. **Log in as Buyer**:
   - Email: `buyer1@example.com`
   - Password: `password123`

3. **Find a Verified Farmer**:
   - Look for listings with ✓ (verified badge)
   - Status should be "available" (green)

4. **Click M-Pesa Button**:
   - Enter phone: `+254708374149` (sandbox test number)
   - Enter quantity
   - Click "Pay with M-Pesa"

5. **Simulate Payment**:
   Use this curl command to simulate M-Pesa callback:

   ```bash
   curl -X POST http://localhost:3001/api/mpesa/callback \
     -H "Content-Type: application/json" \
     -d '{
       "Body": {
         "stkCallback": {
           "MerchantRequestID": "test-123",
           "CheckoutRequestID": "ws_CO_12012025123456",
           "ResultCode": 0,
           "ResultDesc": "Success",
           "CallbackMetadata": {
             "Item": [
               {"Name": "Amount", "Value": 3500},
               {"Name": "MpesaReceiptNumber", "Value": "TEST123"},
               {"Name": "TransactionDate", "Value": 20250112120000},
               {"Name": "PhoneNumber", "Value": 254708374149}
             ]
           }
         }
       }
     }'
   ```

   **Note**: Replace `CheckoutRequestID` with the actual ID from the payment response (check server console logs).

6. **Verify Success**:
   - Modal shows "Payment Successful!"
   - Listing updates to "sold"
   - Check `db.json` → `transactions` for new entry

---

## 📋 Test Accounts

### Buyers
- **Email**: `buyer1@example.com` | **Password**: `password123`
- **Email**: `buyer2@example.com` | **Password**: `password123`

### Verified Farmers (Listings Available)
- John Kamau (Nakuru) - Maize, Wheat
- Mary Wanjiku (Murang'a) - Tomatoes, Cabbage
- Peter Omondi (Kisumu) - Rice, Fish
- Grace Akinyi (Kisii) - Bananas, Coffee
- David Kipchoge (Eldoret) - Maize, Beans
- Sarah Muthoni (Nyandarua) - Irish Potatoes

### Sandbox Credentials
- **Test Phone**: `254708374149`
- **Shortcode**: `174379`

---

## 🔍 Verify Integration

### Check Transaction Logs
Open `db.json` and look for the `transactions` array:

```json
{
  "transactions": [
    {
      "id": "uuid-here",
      "status": "SUCCESS",
      "amount": 3500,
      "mpesaReceiptNumber": "TEST123"
    }
  ]
}
```

### Check Updated Listing
The purchased listing should have:
- `"status": "sold"` (if full quantity purchased)
- OR reduced `quantity` (if partial purchase)

---

## ⚠️ Common Issues

| Issue | Solution |
|-------|----------|
| "M-Pesa credentials not configured" | Add `MPESA_PASSKEY` to `.env` |
| "Invalid phone number" | Use format: `+254712345678` or `0712345678` |
| "Cannot purchase from unverified farmers" | Only verified farmers show M-Pesa button |
| Payment stuck at "Awaiting confirmation" | Manually trigger callback using curl command above |
| M-Pesa button not showing | Check: listing status = "available" AND farmer isVerified = true |

---

## 📱 What Happens in Production?

In production (with real M-Pesa):

1. Buyer clicks "Pay with M-Pesa"
2. **Real STK Push** sent to buyer's phone
3. Buyer enters M-Pesa PIN on phone
4. Safaricom processes payment
5. **Automatic callback** to your server
6. Listing auto-updates
7. Both buyer and farmer get notified

---

## 🎯 Key Files Created

- `src/lib/mpesa.ts` - M-Pesa utility functions
- `src/app/api/mpesa/payment/route.ts` - Payment endpoint
- `src/app/api/mpesa/callback/route.ts` - Callback handler
- `src/components/marketplace/MpesaPaymentModal.tsx` - Payment UI
- `src/app/marketplace/page.tsx` - Updated with M-Pesa button

---

## 📖 Full Documentation

For detailed documentation, see: `MPESA_INTEGRATION.md`

---

## ✅ Ready to Go!

Your M-Pesa integration is complete and ready for testing. Just add your passkey and start the server!

Questions? Check the server console logs for detailed debugging information.
