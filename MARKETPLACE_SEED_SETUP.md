# Farmers Marketplace Seed Data Setup

## Overview
The UmojaHub Farmers Marketplace has been successfully seeded with realistic demo data for local development and testing.

## What Was Created

### 1. Folder Structure
```
public/images/
├── farming/          # 24 crop product images
└── farmers/          # 10 farmer profile images
```

### 2. Database (db.json)
- **Location**: `c:/LocalProjects/umojaHub/db.json`
- **Size**: 23KB
- **Contents**:
  - 10 Farmer profiles (6 verified, 4 unverified)
  - 27 Marketplace crop listings
  - 2 Buyer accounts
  - 1 Admin account

### 3. Farmers Created

#### Verified Farmers (6)
1. **John Kamau** (Nakuru) - Maize and wheat farmer
2. **Mary Wanjiku** (Murang'a) - Organic vegetables and fruits
3. **Peter Omondi** (Kisumu) - Fish farming and rice
4. **Grace Akinyi** (Kisii) - Bananas and coffee
5. **David Kipchoge** (Eldoret) - Large scale grain producer
6. **Sarah Muthoni** (Nyandarua) - Irish potato specialist

#### Unverified Farmers (4)
7. **James Mutua** (Machakos) - Certified seed producer
8. **Lucy Njeri** (Kakamega) - Sugarcane and groundnut farmer
9. **Daniel Kimani** (Kiambu) - Coffee and tea grower
10. **Esther Wangari** (Embu) - Mixed farming (dairy and crops)

### 4. Marketplace Listings (27 total)

#### By Status:
- **Available**: 20 listings
- **Sold**: 4 listings
- **Pending**: 3 listings

#### Crop Types:
- Maize (2 listings)
- Wheat
- Beans (Red Kidney, Mixed)
- Tomatoes
- Cabbage
- Carrots
- Bananas (Matoke)
- Rice
- Tilapia (Fresh)
- Sweet Potatoes
- Coffee (Green Beans)
- Avocados
- Sorghum
- Irish Potatoes
- Green Peas
- Green Grams
- Cowpeas
- Groundnuts
- Sugarcane
- Tea Leaves
- Macadamia Nuts
- Milk (Fresh)
- Passion Fruits
- Kale (Sukuma Wiki)

#### By Location:
Listings span across 10 Kenyan counties: Nakuru, Murang'a, Kisumu, Kisii, Eldoret, Nyandarua, Machakos, Kakamega, Kiambu, and Embu.

## Test Credentials

### Verified Farmer
- **Email**: john.kamau@example.com
- **Password**: password123
- **Status**: Verified ✓

### Unverified Farmer
- **Email**: james.mutua@example.com
- **Password**: password123
- **Status**: Not verified

### Buyer
- **Email**: buyer1@example.com
- **Password**: password123

### Admin
- **Email**: admin@umojahub.com
- **Password**: admin123

## Image Assets

### Crop Images (24 files)
All stored in `/public/images/farming/`:
- avocados.jpg
- bananas.jpg
- beans.jpg
- cabbage.jpg
- carrots.jpg
- coffee.jpg
- cowpeas.jpg
- green_grams.jpg
- groundnuts.jpg
- kale.jpg
- macadamia.jpg
- maize.jpg
- milk.jpg
- passion_fruits.jpg
- peas.jpg
- potatoes.jpg
- rice.jpg
- sorghum.jpg
- sugarcane.jpg
- sweet_potatoes.jpg
- tea.jpg
- tilapia.jpg
- tomatoes.jpg
- wheat.jpg

### Farmer Profile Images (10 files)
All stored in `/public/images/farmers/`:
- john_kamau.jpg
- mary_wanjiku.jpg
- peter_omondi.jpg
- grace_akinyi.jpg
- david_kipchoge.jpg
- sarah_muthoni.jpg
- james_mutua.jpg
- lucy_njeri.jpg
- daniel_kimani.jpg
- esther_wangari.jpg

**Note**: Current images are text placeholders. For production, replace with actual images from sources like Unsplash or Pexels.

## Data Distribution

### Listings per Farmer:
- **Verified farmers** (3-4 listings each): 18 listings
- **Unverified farmers** (2 listings each): 9 listings

### Price Range:
- **Lowest**: KES 25/kg (Kale)
- **Highest**: KES 9,500/bag (Groundnuts)
- **Average**: ~KES 1,500 per unit

## Running the Seed Script

### First Time Setup
```bash
npm run seed
```

### Re-seeding (Clears existing data)
```bash
npm run seed
```

This will:
1. Clear all existing users and listings
2. Create 10 farmers with profiles and avatars
3. Create 27 marketplace listings with local images
4. Create 2 buyer accounts
5. Create 1 admin account

## Configuration Files

### tsconfig.seed.json
Custom TypeScript configuration for the seed script to use CommonJS modules:
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "CommonJS",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  },
  "include": ["scripts/**/*"]
}
```

### scripts/create-placeholders.ps1
PowerShell script to generate placeholder image files for development.

## Testing the Marketplace

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Access the Marketplace
Navigate to: `http://localhost:3000/marketplace`

### 3. Test User Flows

#### As a Buyer:
1. Login with buyer1@example.com / password123
2. Browse marketplace listings
3. Filter by location, crop type, or status
4. View farmer profiles with verification badges

#### As a Verified Farmer:
1. Login with john.kamau@example.com / password123
2. View your dashboard
3. Manage your crop listings
4. See verification badge on your profile

#### As an Unverified Farmer:
1. Login with james.mutua@example.com / password123
2. View your dashboard
3. Notice no verification badge
4. Request verification (if feature available)

#### As Admin:
1. Login with admin@umojahub.com / admin123
2. Access admin dashboard
3. View all users and listings
4. Manage verification requests

## Features Demonstrated

1. **Verified vs Unverified Farmers**: Visual distinction with badges
2. **Multiple Crop Types**: Diverse agricultural products
3. **Regional Diversity**: Listings from 10 different Kenyan counties
4. **Status Management**: Available, Sold, and Pending listings
5. **Farmer Profiles**: Complete with bios, locations, and contact info
6. **Local Image Storage**: All assets stored locally for offline functionality

## Next Steps

### For Development:
1. Replace placeholder images with real crop photos
2. Add more farmers and listings as needed
3. Implement search and filter functionality
4. Add messaging system between buyers and farmers

### For Production:
1. Replace text placeholder images with actual photos
2. Add image upload functionality
3. Implement proper authentication and authorization
4. Add payment integration
5. Set up real email verification system

## Troubleshooting

### Images Not Loading
- Verify files exist in `/public/images/farming/` and `/public/images/farmers/`
- Check Next.js is serving static files correctly
- Ensure image paths in db.json are correct (start with `/images/...`)

### Seed Script Fails
```bash
# Delete db.json and try again
del db.json
npm run seed
```

### Database Issues
- LowDB stores data in `db.json` at the project root
- Delete this file to reset the database
- Re-run seed script to repopulate

## File Locations

```
c:/LocalProjects/umojaHub/
├── db.json                          # Database file
├── tsconfig.seed.json               # Seed script TypeScript config
├── public/images/
│   ├── farming/                     # Crop images
│   └── farmers/                     # Farmer profile images
├── scripts/
│   ├── seed-demo-data.ts           # Main seed script
│   └── create-placeholders.ps1     # Image placeholder generator
└── MARKETPLACE_SEED_SETUP.md       # This file
```

## Summary

✅ **10 Farmers** created (6 verified, 4 unverified)
✅ **27 Crop Listings** with realistic data
✅ **24 Crop Images** stored locally
✅ **10 Farmer Profiles** with avatars
✅ **Multiple User Roles** (Farmers, Buyers, Admin)
✅ **Kenyan Context** with local crops, regions, and pricing
✅ **Offline Ready** - All assets stored locally

The marketplace is now ready for development and testing with realistic, interactive demo data!
