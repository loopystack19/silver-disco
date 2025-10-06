# Quick CRUD Testing Guide

## ✅ GOOD NEWS: All CRUD Operations Are Already Working!

The backend API routes are fully functional. You can test all CRUD operations right now using:
1. The existing `/marketplace` page for viewing listings
2. API calls (cURL, Postman, or browser fetch)
3. The farmer dashboard for managing listings

## Current Working Pages

### 1. View All Listings (READ)
**URL:** http://localhost:3000/marketplace

Features:
- View all 27 listings
- See farmer names and verification badges
- View prices, quantities, locations
- Filter by status (available/sold/pending)

### 2. Farmer Dashboard
**URL:** http://localhost:3000/dashboard/farmers

Features:
- Login as a farmer
- View your own listings
- Manage your products

## Testing CRUD Operations

### 🟢 CREATE - Add New Listing

**Method 1: Using cURL**
```bash
curl -X POST http://localhost:3000/api/crops \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "cropName": "Fresh Carrots",
    "quantity": 100,
    "unit": "kg",
    "pricePerUnit": 60,
    "description": "Organic carrots from Nakuru",
    "location": "Nakuru",
    "image": "/images/farming/carrots.jpg"
  }'
```

**Method 2: Using Browser Console (logged in as farmer)**
```javascript
fetch('/api/crops', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cropName: 'Fresh Carrots',
    quantity: 100,
    unit: 'kg',
    pricePerUnit: 60,
    description: 'Organic carrots from Nakuru',
    location: 'Nakuru',
    image: '/images/farming/carrots.jpg'
  })
})
.then(res => res.json())
.then(data => console.log('Created:', data));
```

### 🔵 READ - Get Listings

**Get All Listings:**
```bash
curl http://localhost:3000/api/crops
```

**Search for "maize":**
```bash
curl "http://localhost:3000/api/crops?search=maize"
```

**Filter by location:**
```bash
curl "http://localhost:3000/api/crops?location=Nakuru"
```

**Filter by status:**
```bash
curl "http://localhost:3000/api/crops?status=available"
```

**Sort by price (low to high):**
```bash
curl "http://localhost:3000/api/crops?sort=price-low"
```

**Combine filters:**
```bash
curl "http://localhost:3000/api/crops?search=maize&location=Nakuru&status=available&sort=price-low"
```

**Get Single Listing:**
```bash
curl http://localhost:3000/api/crops/[listing-id]
```

### 🟡 UPDATE - Edit Listing

**Using cURL:**
```bash
curl -X PUT http://localhost:3000/api/crops/[listing-id] \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "quantity": 80,
    "pricePerUnit": 55,
    "status": "available"
  }'
```

**Using Browser Console:**
```javascript
fetch('/api/crops/[listing-id]', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    quantity: 80,
    pricePerUnit: 55
  })
})
.then(res => res.json())
.then(data => console.log('Updated:', data));
```

**Quick Mark as Sold:**
```javascript
fetch('/api/crops/[listing-id]', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'sold' })
})
.then(res => res.json())
.then(data => console.log('Marked as sold:', data));
```

### 🔴 DELETE - Remove Listing

**Using cURL:**
```bash
curl -X DELETE http://localhost:3000/api/crops/[listing-id] \
  -H "Cookie: your-session-cookie"
```

**Using Browser Console:**
```javascript
fetch('/api/crops/[listing-id]', {
  method: 'DELETE'
})
.then(res => res.json())
.then(data => console.log('Deleted:', data));
```

## Step-by-Step Testing Workflow

### Test 1: View Listings (No Login Required)
```
1. Start dev server: npm run dev
2. Open: http://localhost:3000/marketplace
3. See all 27 listings displayed
4. Browse through the grid
✅ READ operation working!
```

### Test 2: Create Listing as Farmer
```
1. Login: john.kamau@example.com / password123
2. Open browser console (F12)
3. Run this code:

fetch('/api/crops', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cropName: 'Test Crop',
    quantity: 50,
    unit: 'kg',
    pricePerUnit: 100,
    description: 'Testing CRUD operations',
    location: 'Nairobi',
    image: '/images/farming/maize.jpg'
  })
}).then(r => r.json()).then(console.log);

4. Refresh /marketplace page
5. Your new listing should appear!
✅ CREATE operation working!
```

### Test 3: Get Listing ID
```
1. Go to: http://localhost:3000/marketplace
2. Open browser console
3. Run:

fetch('/api/crops').then(r => r.json()).then(data => {
  console.log('All listings:', data.listings);
  console.log('First listing ID:', data.listings[0].id);
});

4. Copy a listing ID for next tests
```

### Test 4: Update Listing
```
1. Still logged in as farmer
2. In console, replace [ID] with actual listing ID:

fetch('/api/crops/[ID]', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    quantity: 75,
    pricePerUnit: 90,
    description: 'Updated description'
  })
}).then(r => r.json()).then(console.log);

3. Refresh /marketplace
4. Changes should be visible!
✅ UPDATE operation working!
```

### Test 5: Delete Listing
```
1. Still logged in as farmer
2. In console, replace [ID] with listing ID:

fetch('/api/crops/[ID]', {
  method: 'DELETE'
}).then(r => r.json()).then(console.log);

3. Refresh /marketplace
4. Listing should be gone!
✅ DELETE operation working!
```

### Test 6: Test Filters
```
1. Go to: http://localhost:3000/marketplace
2. In console:

// Search for maize
fetch('/api/crops?search=maize').then(r => r.json()).then(console.log);

// Filter by location
fetch('/api/crops?location=Nakuru').then(r => r.json()).then(console.log);

// Filter by status
fetch('/api/crops?status=available').then(r => r.json()).then(console.log);

// Price range
fetch('/api/crops?minPrice=1000&maxPrice=5000').then(r => r.json()).then(console.log);

// Sort by price
fetch('/api/crops?sort=price-low').then(r => r.json()).then(console.log);

✅ All filters working!
```

## Testing with Different Users

### As Verified Farmer
```
Email: john.kamau@example.com
Password: password123
Can: Create, Edit own, Delete own
```

### As Unverified Farmer
```
Email: james.mutua@example.com
Password: password123
Can: Create, Edit own, Delete own
Note: No verification badge shown
```

### As Admin
```
Email: admin@umojahub.com
Password: admin123
Can: Create, Edit ANY, Delete ANY
```

### As Buyer
```
Email: buyer1@example.com
Password: password123
Can: View, Search, Filter only
Cannot: Create, Edit, Delete
```

## Error Testing

### Try to create without login:
```javascript
// Should fail with 401 Unauthorized
fetch('/api/crops', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cropName: 'Test',
    quantity: 10,
    unit: 'kg',
    pricePerUnit: 100,
    description: 'Test',
    location: 'Nairobi'
  })
}).then(r => r.json()).then(console.log);
```

### Try to edit someone else's listing:
```javascript
// Should fail with 403 Forbidden
// (unless you're admin)
fetch('/api/crops/[other-user-listing-id]', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ quantity: 999 })
}).then(r => r.json()).then(console.log);
```

## Quick Reference

### Available Endpoints
```
GET    /api/crops              - List all (with filters)
POST   /api/crops              - Create new (farmer only)
GET    /api/crops/[id]         - Get single
PUT    /api/crops/[id]         - Update (owner/admin)
DELETE /api/crops/[id]         - Delete (owner/admin)
```

### Query Parameters for GET /api/crops
```
?search=maize              - Search text
?location=Nakuru           - Filter by location
?status=available          - Filter by status
?farmerId=[id]             - Filter by farmer
?minPrice=1000             - Min price
?maxPrice=5000             - Max price
?sort=newest               - Sort order
  Options: newest, oldest, price-low, price-high, location
```

### Status Values
```
- available
- pending
- sold
```

### Unit Options
```
- kg (kilograms)
- bags
- crates
- liters
- pieces
- tonnes
```

## Viewing Results

After any operation:
1. **Refresh /marketplace page** to see changes
2. **Or fetch latest data
