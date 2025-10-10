# Crop Image Upload Implementation Guide

## Overview
This guide documents the implementation of direct image upload functionality for the Farmer Crop Listing Form in the UmojaHub marketplace. The implementation replaces the previous URL-based image input with a modern drag-and-drop file upload system.

## Features Implemented

### 1. Direct File Upload
- Users can now click to select an image file from their device
- Supports drag-and-drop functionality for easy image uploads
- Visual feedback when dragging files over the upload area

### 2. Supported File Types
- JPG/JPEG
- PNG
- WEBP
- Maximum file size: 5MB

### 3. Image Preview
- Instant preview after file selection
- Preview displays before form submission
- Option to remove or replace the selected image

### 4. Image Processing
- Automatic image compression using Sharp library
- Images are resized to a maximum of 1200x1200 pixels
- JPEG quality set to 85% for optimal balance between quality and file size
- Maintains aspect ratio during resize

### 5. Storage
- Images are saved to `/public/uploads/crops/` directory
- Each image receives a unique UUID-based filename to prevent conflicts
- Image paths are stored in the database (e.g., `/uploads/crops/abc123.jpg`)

### 6. Validation
- Client-side validation for file type and size
- Server-side validation for security
- User-friendly error messages for validation failures

## Technical Implementation

### Backend Changes

#### Dependencies Added
```json
{
  "sharp": "^0.33.5"  // For image processing and optimization
}
```

#### Files Modified

**`src/app/api/crops/route.ts`**
- Updated POST endpoint to handle `multipart/form-data`
- Added file validation (type and size)
- Implemented image processing with Sharp
- Generates unique filenames using UUID
- Saves images to `/public/uploads/crops/`

**`src/app/api/crops/[id]/route.ts`**
- Updated PUT endpoint to handle optional image updates
- Maintains existing image if no new file is uploaded
- Same validation and processing as POST endpoint

### Frontend Changes

**`src/app/dashboard/farmers/page.tsx`**

#### State Management
```typescript
const [imageFile, setImageFile] = useState<File | null>(null);
const [imagePreview, setImagePreview] = useState<string>('');
const [dragActive, setDragActive] = useState(false);
```

#### Key Functions
- `handleImageChange()`: Validates and sets selected image file
- `handleDrag()`: Manages drag state for visual feedback
- `handleDrop()`: Handles dropped files
- `handleFileInput()`: Handles file input selection
- `removeImage()`: Clears selected image

#### Form Submission
- Changed from JSON to FormData
- Sends file along with form fields
- Validates image presence before submission

### UI/UX Features

#### Upload Area
```
┌─────────────────────────────────────┐
│         [Cloud Upload Icon]         │
│                                     │
│  Click to upload or drag and drop  │
│  JPG, JPEG, PNG or WEBP (max 5MB)  │
└─────────────────────────────────────┘
```

#### Image Preview
```
┌─────────────────────────────────────┐
│                                   [X]│
│                                     │
│        [Image Preview]              │
│                                     │
└─────────────────────────────────────┘
      [Replace Image Button]
```

## File Structure

```
c:\LocalProjects\umojaHub\
├── public\
│   └── uploads\
│       └── crops\              # Upload directory for crop images
│           └── .gitkeep        # Ensures directory is tracked
├── src\
│   ├── app\
│   │   ├── api\
│   │   │   └── crops\
│   │   │       ├── route.ts           # POST endpoint with file upload
│   │   │       └── [id]\
│   │   │           └── route.ts       # PUT endpoint with file upload
│   │   └── dashboard\
│   │       └── farmers\
│   │           └── page.tsx           # Frontend form with upload UI
└── package.json                        # Sharp dependency added
```

## Usage Guide

### For Farmers

#### Creating a New Listing
1. Click "Create New Listing" button
2. Fill in crop details (name, quantity, price, etc.)
3. Upload an image by either:
   - Clicking the upload area to browse files
   - Dragging and dropping an image file
4. Preview appears after selection
5. Click "Replace Image" if you want to change it
6. Submit the form

#### Editing an Existing Listing
1. Click "Edit" on any listing
2. All fields pre-populate with existing data
3. Existing image shows as preview
4. Upload a new image (optional) to replace the old one
5. Submit to save changes

### Validation Messages

**Client-Side**
- "Invalid file type. Only JPG, JPEG, PNG, and WEBP images are allowed."
- "File size exceeds 5MB limit. Please choose a smaller image."
- "Please upload a crop image before submitting your listing."

**Server-Side**
- "Please upload a crop image before submitting your listing."
- "Invalid file type. Only JPG, JPEG, PNG, and WEBP images are allowed."
- "File size exceeds 5MB limit."
- "Failed to process image"

## API Endpoints

### POST /api/crops
Creates a new crop listing with image upload.

**Request Format:** `multipart/form-data`

**Required Fields:**
- `cropName`: string
- `quantity`: number
- `unit`: string
- `pricePerUnit`: number
- `description`: string
- `location`: string
- `image`: File (required)

**Response:**
```json
{
  "message": "Crop listing created successfully",
  "listing": {
    "id": "uuid",
    "cropName": "Maize",
    "image": "/uploads/crops/abc123.jpg",
    ...
  }
}
```

### PUT /api/crops/[id]
Updates an existing crop listing, optionally with a new image.

**Request Format:** `multipart/form-data`

**Fields:** (all optional)
- `cropName`: string
- `quantity`: number
- `unit`: string
- `pricePerUnit`: number
- `description`: string
- `location`: string
- `status`: string
- `image`: File (optional - keeps existing if not provided)

## Security Considerations

1. **File Type Validation**: Both client and server validate file types
2. **File Size Limits**: 5MB maximum enforced on both sides
3. **Unique Filenames**: UUID prevents filename collisions and overwrites
4. **Path Sanitization**: Uses path.join() to prevent directory traversal
5. **Authentication**: Requires logged-in farmer to upload
6. **Authorization**: Only listing owner can update their images

## Performance Optimizations

1. **Image Compression**: Sharp reduces file sizes by ~50-70%
2. **Resize Limit**: Images capped at 1200x1200 pixels
3. **Quality Setting**: JPEG quality at 85% balances size and quality
4. **Aspect Ratio**: Maintained during resize for proper display

## Browser Compatibility

- Modern browsers supporting:
  - FormData API
  - Drag and Drop API
  - FileReader API
  - HTML5 file input with accept attribute

## Testing Checklist

### Manual Testing Steps

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Login as a farmer**
   - Navigate to `/login`
   - Use farmer credentials
   - Ensure email is verified

3. **Test Create New Listing**
   - Click "Create New Listing"
   - Fill in all required fields
   - Test drag-and-drop: Drag an image file onto the upload area
   - Verify: Upload area highlights when dragging
   - Verify: Image preview appears after drop
   - Click "Replace Image" to test removal
   - Select another image via click-to-browse
   - Submit the form
   - Check: Image is saved to `/public/uploads/crops/`
   - Check: Listing appears with uploaded image

4. **Test File Validation**
   - Try uploading a non-image file (should show error)
   - Try uploading an image larger than 5MB (should show error)
   - Try submitting without an image (should show error)

5. **Test Edit Listing**
   - Click "Edit" on an existing listing
   - Verify: Existing image shows as preview
   - Upload a new image (optional)
   - Submit changes
   - Verify: New image replaces old one if uploaded

6. **Test Image Optimization**
   - Upload a large image (e.g., 10MB, 4000x3000px)
   - Check: Resulting file in `/public/uploads/crops/` is smaller
   - Check: Image dimensions are ≤ 1200x1200px

### Verification Points

- ✅ Upload directory created at `/public/uploads/crops/`
- ✅ Sharp dependency installed
- ✅ POST endpoint handles multipart form data
- ✅ PUT endpoint handles optional image updates
- ✅ Frontend form has drag-and-drop UI
- ✅ Image preview functionality works
- ✅ Client-side validation implemented
- ✅ Server-side validation implemented
- ✅ Images are compressed and optimized
- ✅ Unique filenames generated with UUID
- ✅ Error messages are user-friendly

## Troubleshooting

### Common Issues

**Issue: "Sharp installation failed"**
- Solution: Run `npm install sharp --force`
- Or: Delete `node_modules` and run `npm install` again

**Issue: "Upload directory not found"**
- Solution: Ensure `/public/uploads/crops/` exists
- Run: `mkdir -p public/uploads/crops` (Linux/Mac) or `mkdir public\uploads\crops` (Windows)

**Issue: "Image not displaying after upload"**
- Check: File was saved to `/public/uploads/crops/`
- Check: Image path in database starts with `/uploads/crops/`
- Check: Next.js dev server is serving static files from `/public`

**Issue: "File size still too large after compression"**
- Solution: Sharp is working, but original file was very large
- Adjust quality setting in route.ts if needed (currently 85%)

## Future Enhancements

Potential improvements for future iterations:

1. **Multiple Images**: Allow farmers to upload multiple images per listing
2. **Image Cropping**: Add client-side image cropping tool
3. **Thumbnail Generation**: Generate multiple sizes for different views
4. **Cloud Storage**: Integrate with AWS S3 or Cloudinary for scalable storage
5. **Progress Indicator**: Show upload progress for large files
6. **Image Validation**: Check for inappropriate content using AI
7. **WebP Conversion**: Convert all uploads to WebP for better compression
8. **Lazy Loading**: Implement lazy loading for marketplace images

## Conclusion

The image upload implementation successfully replaces the URL-based system with a modern, user-friendly file upload experience. Farmers can now easily upload crop images directly from their devices with drag-and-drop support, automatic optimization, and instant previews.
