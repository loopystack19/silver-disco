# Farmers Marketplace - Complete CRUD Operations Guide

## Overview
The UmojaHub Farmers Marketplace now has full CRUD (Create, Read, Update, Delete) functionality implemented with advanced filtering, search, and buyer interaction features.

## System Architecture

### Backend API Routes (Already Implemented)

#### 1. **GET /api/crops** - Read/List All Listings
**Features:**
- Public access (no authentication required)
- Advanced filtering and search
- Multiple sort options

**Query Parameters:**
```
- search: Search by crop name, farmer name, or description
- location: Filter by location
- status: Filter by status (available, sold, pending)
- farmerId: Get listings from specific farmer
- sort: Sort order (newest, oldest, price-low, price-high, location)
- minPrice: Minimum price filter
- maxPrice: Maximum price filter
```

**Example:**
```bash
GET /api/crops?search=maize&location=Nakuru&status=available&sort=price-low
```

#### 2. **POST /api/crops** - Create New Listing
**Access:** Authenticated farmers only
**Allows:** Both verified and unverified farmers (unverified see warning)

**Request Body:**
```json
{
  "cropName": "Maize",
  "quantity": 100,
  "unit": "bags",
  "pricePerUnit": 3500,
  "description": "High-quality yellow maize...",
  "location": "Nakuru",
  "image": "/images/farming/maize.jpg"
}
```

**Response:**
```json
{
  "message": "Crop listing created successfully",
  "listing": {
    "id": "uuid",
    "farmerId": "farmer-id",
    "farmerName": "John Kamau",
    "cropName": "Maize",
    "status": "available",
    ...
  }
}
```

#### 3. **GET /api/crops/[id]** - Read Single Listing
**Access:** Public

**Response:**
```json
{
  "listing": {
    "id": "uuid",
    "cropName": "Maize",
    "quantity": 100,
    ...
  }
}
```

#### 4. **PUT /api/crops/[id]** - Update Listing
**Access:** Listing owner or admin only

**Request Body** (partial update supported):
```json
{
  "quantity": 80,
  "pricePerUnit": 3200,
  "status": "available"
}
```

**Response:**
```json
{
  "message": "Crop listing updated successfully",
  "listing": { updated listing object }
}
```

#### 5. **DELETE /api/crops/[id]** - Delete Listing
**Access:** Listing owner or admin only

**Response:**
```json
{
  "message": "Crop listing deleted successfully"
}
```

## Frontend Implementation

### Enhanced Marketplace Page

**Location:** `/marketplace/enhanced`

#### Key Features Implemented:

###  1. **CREATE - Add New Listing**

**Who Can:** Farmers (verified and unverified)

**Features:**
- Modal form with validation
- Dropdown for Kenyan locations
- Image selector from local assets
- Unit options (kg, bags, crates, liters, pieces, tonnes)
- Real-time form validation

**Fields:**
- Crop Name* (required)
- Location* (dropdown with 16 Kenyan locations)
- Quantity* (number)
- Unit* (dropdown)
- Price per Unit* (KES)
- Description* (textarea)
- Image (optional - select from local images)

**User Flow:**
```
1. Farmer clicks "+ Add New Listing"
2. Modal opens with form
3. Fill in all required fields
4. Select image from dropdown
5. Click "Create Listing"
6. Success message appears
7. New listing immediately visible in marketplace
```

### 2. **READ - View & Filter Listings**

**Who Can:** Everyone (public access)

**Search & Filter Features:**
- **Text Search:** Search crops, farmers, descriptions
- **Location Filter:** Filter by Kenyan county
- **Status Filter:** Available, Sold, Pending
- **Price Range:** Min and Max price filters
- **Sort Options:**
  - Newest First
  - Oldest First
  - Price: Low to High
  - Price: High to Low
  - Location A-Z

**Display Features:**
- Grid layout (1/2/3 columns responsive)
- Crop images with fallback
- Status badges (SOLD, PENDING)
- Farmer verification badges
- Price per unit prominently displayed
- Quantity and unit shown
- Location displayed
- Listing count ("Showing X listing(s)")

**Card Information:**
- Crop name
- Price per unit (KES)
- Quantity available
- Unit type
- Description (truncated)
- Farmer name with verification badge
- Location
- Action buttons

### 3. **UPDATE - Edit Listing**

**Who Can:** 
- Listing owner (farmer who created it)
- Admin users

**Features:**
- Pre-filled form with current values
- All fields editable including status
- Status dropdown (Available/Pending/Sold)
- Instant update on submission

**User Flow:**
```
1. Farmer views their listing
2. Clicks "Edit" button
3. Modal opens with pre-filled form
4. Modify any fields
5. Click "Update Listing"
6. Changes reflect immediately
```

**Quick Actions:**
- **Mark as Sold:** One-click status change to "sold"
- Farmers can quickly mark listings as sold without opening edit form

### 4. **DELETE - Remove Listing**

**Who Can:**
- Listing owner
- Admin users

**Features:**
- Confirmation modal prevents accidental deletion
- Shows crop name in confirmation
- Permanent deletion (cannot be undone)

**User Flow:**
```
1. Farmer clicks "Delete" button
2. Confirmation modal appears
3. Shows: "Are you sure you want to delete [Crop Name]?"
4. Click "Delete" to confirm or "Cancel" to abort
5. Listing removed from database and UI
6. Success message displayed
```

### 5. **BUYER INTERACTIONS**

#### Contact Seller
**Who Can:** Anyone viewing available listings

**Features:**
- Contact modal with seller information
- Displays:
  - Crop details (name, quantity, price, location)
  - Farmer name
  - Email (clickable mailto link)
  - Phone (clickable tel link + WhatsApp link)
  - Verification status

**User Flow:**
```
1. Buyer clicks "Contact" button
2. Modal opens with seller info
3. Buyer can:
   - Click email to send email
   - Click phone to call
   - Click WhatsApp to chat
4. Simulates transaction initiation
```

#### Simulate Purchase
**Feature:** Mark as Purchased (changes status to "Sold")

**User Flow:**
```
1. Buyer agrees to purchase
2. Farmer marks listing as "Sold"
3. Status badge changes to "SOLD"
4. Listing greys out or changes appearance
5. "Contact" button may be disabled
```

### 6. **ADMIN OPERATIONS**

**Who Can:** Admin users only

**Full Access:**
- View all listings
- Edit any listing
- Delete any listing
- Change listing status
- Moderate inappropriate content

**Admin Dashboard Features:**
- See all farmers (verified/unverified)
- Approve farmer verification
- Flag suspicious listings
- Bulk operations (future feature)

## User Roles & Permissions

### Farmers (Verified)
✅ Create listings
✅ Edit own listings
✅ Delete own listings
✅ Mark listings as sold
✅ View all listings
✅ Contact other farmers
✅ Verification badge displayed

### Farmers (Unverified)
✅ Create listings
✅ Edit own listings
✅ Delete own listings
✅ Mark listings as sold
✅ View all listings
⚠️ Warning note on listings
❌ No verification badge

### Buyers
✅ View all listings
✅ Search and filter
✅ Contact sellers
✅ Simulate purchase
❌ Cannot create listings
❌ Cannot edit/delete listings

### Admin
✅ Full CRUD on all listings
✅ View all users
✅ Moderate content
✅ Approve/reject farmers
✅ Delete inappropriate listings
✅ Change listing status

### Public (Not Logged In)
✅ View all listings
✅ Search and filter
❌ Cannot contact sellers
❌ Cannot create listings

## Data Validation

### Client-Side Validation
- Required fields marked with *
- Number fields validate min values
- Dropdown selections validated
- Description length limits
- Image URL format validation

### Server-Side Validation
- All required fields checked
- User authentication verified
- Ownership verified for edit/delete
- Role-based access control
- SQL injection prevention
- XSS attack prevention

## Security Features

1. **Authentication:** NextAuth.js session-based
2. **Authorization:** Role-based access control
3. **Ownership Verification:** Users can only edit/delete own listings
4. **Admin Override:** Admins can moderate any content
5. **Input Sanitization:** All inputs sanitized
6. **CSRF Protection:** Built into Next.js

## Error Handling

### Common Error Messages:
- "Unauthorized - Please log in"
- "Only farmers can create crop listings"
- "You can only update your own listings"
- "You can only delete your own listings"
- "Crop listing not found"
- "All fields are required"
- "Internal server error"

### Error Display:
- Red error banners at top of page
- Inline form validation errors
- Alert modals for critical errors
- Success messages for completed actions

## Testing Guide

### Test Scenario 1: Create Listing (Verified Farmer)
```
1. Login as: john.kamau@example.com / password123
2. Navigate to: /marketplace/enhanced
3. Click "+ Add New Listing"
4. Fill form:
   - Crop: Fresh Vegetables
   - Location: Nakuru
   - Quantity: 50
   - Unit: kg
   - Price: 100
   - Description: Fresh from farm
5. Click "Create Listing"
6. Verify: New listing appears at top (newest first)
```

### Test Scenario 2: Create Listing (Unverified Farmer)
```
1. Login as: james.mutua@example.com / password123
2. Follow same steps as above
3. Verify: Listing created successfully
4. Check: No verification badge shown
```

### Test Scenario 3: Edit Listing
```
1. Login as farmer who owns a listing
2. Find your listing in grid
3. Click "Edit"
4. Change quantity from 100 to 80
5. Change price from 3500 to 3200
6. Click "Update Listing"
7. Verify: Changes reflected immediately
```

### Test Scenario 4: Delete Listing
```
1. Login as farmer who owns a listing
2. Click "Delete" on your listing
3. Confirmation modal appears
4. Click "Delete" to confirm
5. Verify: Listing removed from grid
```

### Test Scenario 5: Search & Filter
```
1. Go to /marketplace/enhanced
2. Enter "maize" in search
3. Verify: Only maize listings shown
4. Select "Nakuru" from location dropdown
5. Verify: Only Nakuru listings shown
6. Set Min Price: 1000, Max Price: 5000
7. Verify: Only listings in range shown
8. Click "Clear Filters"
9. Verify: All listings shown again
```

### Test Scenario 6: Contact Seller
```
1. Go to /marketplace/enhanced
2. Find an available listing
3. Click "Contact"
4. Verify modal shows:
   - Farmer name
   - Email (clickable)
   - Phone (clickable)
5. Click email link
6. Verify: Email client opens
```

### Test Scenario 7: Mark as Sold
```
1. Login as farmer
2. Find your available listing
3. Click "Mark Sold"
4. Verify: Status changes to "SOLD"
5. Verify: Red badge appears
6. Verify: Actions change (no "Contact" button)
```

### Test Scenario 8: Admin Operations
```
1. Login as: admin@umojahub.com / admin123
2. Go to /marketplace/enhanced
3. Verify: Can see Edit/Delete on ALL listings
4. Edit a listing you don't own
5. Verify: Update succeeds
6. Delete a listing you don't own
7. Verify: Delete succeeds
```

## API Testing with cURL

### Create Listing
```bash
curl -X POST http://localhost:3000/api/crops \
  -H "Content-Type: application/json" \
  -d '{
    "cropName": "Tomatoes",
    "quantity": 200,
    "unit": "kg",
    "pricePerUnit": 80,
    "description": "Fresh organic tomatoes",
    "location": "Nakuru",
    "image": "/images/farming/tomatoes.jpg"
  }'
```

### Get All Listings
```bash
curl http://localhost:3000/api/crops
```

### Get With Filters
```bash
curl "http://localhost:3000/api/crops?search=maize&location=Nakuru&status=available"
```

### Update Listing
```bash
curl -X PUT http://localhost:3000/api/crops/[listing-id] \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 150,
    "pricePerUnit": 75
  }'
```

### Delete Listing
```bash
curl -X DELETE http://localhost:3000/api/crops/[listing-id]
```

## Database Schema (LowDB)

```json
{
  "users": [
    {
      "id": "uuid",
      "email": "farmer@example.com",
      "name": "Farmer Name",
      "role": "farmer",
      "isVerified": true,
      "location": "Nakuru",
      "phone": "+254712345678",
      "avatar": "/images/farmers/farmer.jpg"
    }
  ],
  "cropListings": [
    {
      "id": "uuid",
      "farmerId": "farmer-user-id",
      "farmerName": "Farmer Name",
      "cropName": "Maize",
      "quantity": 100,
      "unit": "bags",
      "pricePerUnit": 3500,
      "description": "High-quality maize...",
      "location": "Nakuru",
      "datePosted": "2025-02-04T00:00:00.000Z",
      "status": "available",
      "image": "/images/farming/maize.jpg",
      "createdAt": "2025-02-04T00:00:00.000Z",
      "updatedAt": "2025-02-04T00:00:00.000Z"
    }
  ]
}
```

## Frontend Components Structure

```
src/app/marketplace/enhanced/page.tsx
├── Header
│   ├── Title & Description
│   └── "+ Add New Listing" Button (farmers only)
├── Filters Section
│   ├── Search Input
│   ├── Location Dropdown
│   ├── Status Dropdown
│   ├── Sort Dropdown
│   ├── Min/Max Price Inputs
│   └── Clear Filters Button
├── Results Count
├── Listings Grid
│   └── Listing Card
│       ├── Image with Status Badge
│       ├── Crop Name & Price
│       ├── Quantity & Unit
│       ├── Description
│       ├── Farmer Info with Badge
│       ├── Location
│       └── Action Buttons
│           ├── Contact (buyers)
│           ├── Edit (owner/admin)
│           ├── Delete (owner/admin)
│           └── Mark Sold (owner)
├── Create/Edit Modal
│   ├── Form Fields
│   └── Submit/Cancel Buttons
├── Delete Confirmation Modal
│   ├── Warning Message
│   └── Confirm/Cancel Buttons
└── Contact Seller Modal
    ├── Listing Details
    ├── Farmer Info
    ├── Email Link
    ├── Phone/WhatsApp Links
    └── Close Button
```

## Key Technical Implementations

### State Management
```typescript
const [listings, setListings] = useState<Listing[]>([]);
const [searchTerm, setSearchTerm] = useState('');
const [locationFilter, setLocationFilter] = useState('');
const [statusFilter, setStatusFilter] = useState('');
const [sortBy, setSortBy] = useState('newest');
const [minPrice, setMinPrice] = useState('');
const [maxPrice, setMaxPrice] = useState('');
const [showCreateModal, setShowCreateModal] = useState(false);
const [showEditModal, setShowEditModal] = useState(false);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
```

### Real-Time Filtering
```typescript
useEffect(() => {
  fetchListings();
}, [searchTerm, locationFilter, statusFilter, sortBy, minPrice, maxPrice]);
```

### Permission Checks
```typescript
const canEditListing = (listing: Listing) => {
  if (!session?.user) return false;
  return session.user.role === 'admin' || 
         listing.farmerId === session.user.id;
};

const isCurrentUserFarmer = () => {
  return session?.user?.role === 'farmer';
};
```

## Performance Optimizations

1. **Client-Side Filtering:** Fast filter updates
2. **Debounced Search:** Reduces API calls
3. **Optimistic Updates:** UI updates immediately
4. **Image Lazy Loading:** Faster page load
5. **Pagination Ready:** Can be added for large datasets

## Future Enhancements

### Planned Features:
- [ ] Image upload functionality
- [ ] Bulk operations for farmers
- [ ] Export listings to CSV/PDF
- [ ] Email notifications for new listings
- [ ] In-app messaging between buyers/farmers
- [ ] Payment integration
- [ ] Order tracking
- [ ] Review and rating system
- [ ] Wishlist for buyers
- [ ] Analytics dashboard for farmers
- [ ] Mobile app version
- [ ] SMS notifications
- [ ] Multi-language support

## Summary

The Farmers Marketplace now has a complete CRUD system with:
✅ Create listings (farmers)
✅ Read/View/Search/Filter listings (everyone)
✅ Update listings (owners/admin)
✅ Delete listings (owners/admin)
✅ Contact sellers (buyers)
✅ Status management (farmers)
✅ Admin moderation
✅ Role-based permissions
✅ Real-time filtering
✅ Responsive design
✅ Local image support
✅ Kenyan market focus

All operations work locally with LowDB, no external database required!

## Access the Marketplace

**Standard View:** http://localhost:3000/marketplace
**Enhanced CRUD View:** http://localhost:3000/marketplace/enhanced

**Run the app:**
```bash
npm run dev
```

**Seed fresh data:**
```bash
npm run seed
