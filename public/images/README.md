# UmojaHub Images Directory

This directory contains all images used in the UmojaHub platform.

## Directory Structure

```
public/images/
├── landing/          # Landing page hero images and backgrounds
├── farmers/          # Farmer hub images (marketplace, produce, etc.)
├── learners/         # Learner hub images (courses, certificates, etc.)
├── employment/       # Employment hub images (jobs, CVs, etc.)
└── logos/            # UmojaHub logos and branding assets
```

## Image Guidelines

### Recommended Specifications

**Landing Page Images:**
- Format: JPG or WebP
- Resolution: 1920x1080px or higher
- File size: < 500KB (optimized)
- Content: African farmers, students, professionals

**Feature Card Images:**
- Format: JPG or WebP
- Resolution: 800x600px
- File size: < 200KB (optimized)
- Aspect ratio: 4:3 or 16:9

**Logos:**
- Format: PNG (with transparency) or SVG
- Multiple sizes: 32x32, 64x64, 128x128, 256x256
- Background: Transparent

### Image Naming Convention

Use descriptive, lowercase names with hyphens:
- ✅ `african-farmer-field.jpg`
- ✅ `students-learning-together.jpg`
- ✅ `young-professional-working.jpg`
- ❌ `IMG_1234.jpg`
- ❌ `photo.jpg`

## Current Image Sources

### Landing Page (Currently using Unsplash)

**Farmers Hub:**
- Current: `https://images.unsplash.com/photo-1625246333195-78d9c38ad449`
- Local replacement: Place in `farmers/` folder
- Suggested name: `farmer-in-field.jpg`

**Learners Hub:**
- Current: `https://images.unsplash.com/photo-1522202176988-66273c2fd55f`
- Local replacement: Place in `learners/` folder
- Suggested name: `students-learning.jpg`

**Employment Hub:**
- Current: `https://images.unsplash.com/photo-1573496359142-b8d87734a5a2`
- Local replacement: Place in `employment/` folder
- Suggested name: `professional-working.jpg`

## How to Add Local Images

### Step 1: Add Image Files
Place your images in the appropriate folder:
```
public/images/farmers/farmer-in-field.jpg
public/images/learners/students-learning.jpg
public/images/employment/professional-working.jpg
```

### Step 2: Update page.tsx
Replace Unsplash URLs with local paths:

**Before:**
```jsx
<Image
  src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop"
  alt="African farmer in field"
  fill
/>
```

**After:**
```jsx
<Image
  src="/images/farmers/farmer-in-field.jpg"
  alt="African farmer in field"
  fill
/>
```

### Step 3: Optimize Images (Optional)

Use tools like:
- **TinyPNG** (https://tinypng.com) - Compress without quality loss
- **Squoosh** (https://squoosh.app) - Convert to WebP format
- **ImageOptim** - Batch optimization

## Image Optimization Tips

1. **Use WebP format** - 25-35% smaller than JPG
2. **Compress images** - Aim for < 200KB per image
3. **Resize appropriately** - Don't use 4K images for 600px displays
4. **Use Next.js Image component** - Automatic optimization
5. **Lazy load images** - Better performance

## Free Stock Image Sources

For authentic African imagery:

- **Unsplash** (https://unsplash.com/s/photos/african-farmer)
- **Pexels** (https://pexels.com/search/african%20students)
- **Pixabay** (https://pixabay.com/images/search/africa/)
- **Nappy** (https://nappy.co) - Beautiful photos of Black and Brown people

## Copyright & Attribution

- Ensure you have rights to use all images
- Attribute photographers if required
- Keep attribution file: `public/images/ATTRIBUTION.md`
- For Unsplash: Credit not required but appreciated

## Next.js Image Configuration

Images from external sources require configuration in `next.config.js`:

```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
      pathname: '/**',
    },
  ],
}
```

Local images in `public/` don't need configuration.

---

**Last Updated:** October 5, 2025
