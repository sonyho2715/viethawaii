# Photo Upload Feature Setup

## Overview
The photo upload feature uses Vercel Blob storage for secure, scalable image hosting.

## Environment Variable Required

Add the following to your `.env` file:

```bash
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
```

## How to Get the Vercel Blob Token

### Option 1: Automatic Setup (Recommended)
1. Deploy your project to Vercel
2. Go to your project dashboard on Vercel
3. Navigate to **Storage** → **Create Database** → **Blob**
4. Vercel will automatically create a blob store and add the `BLOB_READ_WRITE_TOKEN` to your environment variables

### Option 2: Manual Setup
1. Visit [Vercel Dashboard](https://vercel.com/dashboard)
2. Go to **Storage** → **Blob**
3. Create a new Blob store or use an existing one
4. Copy the Read-Write token
5. Add it to:
   - `.env` for local development
   - Vercel project settings → Environment Variables for production

## Local Development

For local development, you can use Vercel Blob in development mode without a token, but some features may be limited. To get full functionality:

```bash
# Login to Vercel CLI
vercel login

# Link your project
vercel link

# Pull environment variables
vercel env pull .env.local
```

This will automatically populate your `.env.local` with the `BLOB_READ_WRITE_TOKEN`.

## Features Implemented

### API Routes
- **POST /api/photos** - Upload photos with validation
  - Max file size: 5MB
  - Allowed formats: JPEG, PNG, WebP
  - Authentication required
  - Optional businessId association

- **GET /api/photos** - Fetch photos
  - Filter by businessId or userId
  - Ordered by featured status and creation date

- **DELETE /api/photos/[id]** - Delete photos
  - Permission check: uploader or admin only
  - Removes from both blob storage and database

- **PATCH /api/photos/[id]** - Update photo metadata
  - Update caption and featured status
  - Permission check: uploader or admin only

### Components
1. **PhotoUpload** - Upload interface
   - Drag and drop support
   - Multiple file upload
   - Preview before upload
   - Progress indicators
   - Max files limit (default: 5)

2. **PhotoGallery** - Display photos
   - Responsive grid layout
   - Lightbox modal for full-size viewing
   - Loading skeletons
   - Featured photo badges
   - Empty state handling

## Usage Examples

### In Business Detail Page
```tsx
import PhotoGallery from '@/components/PhotoGallery';
import PhotoUpload from '@/components/PhotoUpload';

// Display photos
<PhotoGallery businessId={business.id} />

// Upload photos (authenticated users only)
<PhotoUpload
  businessId={business.id}
  onUploadComplete={(url) => console.log('Uploaded:', url)}
  maxFiles={10}
/>
```

### In User Profile
```tsx
// Display user's uploaded photos
<PhotoGallery userId={user.id} />
```

## Database Schema

The Photo model is already set up in Prisma:

```prisma
model Photo {
  id          String   @id @default(cuid())
  url         String
  caption     String?
  businessId  String?
  business    Business? @relation(fields: [businessId], references: [id], onDelete: Cascade)
  uploadedBy  String?
  uploader    User?    @relation(fields: [uploadedBy], references: [id], onDelete: SetNull)
  featured    Boolean  @default(false)
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([businessId])
  @@index([uploadedBy])
}
```

## Security Features

1. **File Type Validation** - Only image formats allowed
2. **File Size Limit** - Max 5MB per file
3. **Authentication Required** - Must be logged in to upload
4. **Permission Checks** - Only uploader or admin can delete/edit
5. **Public Access URLs** - Images accessible via CDN

## Next Steps

1. Add the Vercel Blob token to environment variables
2. Test photo upload functionality locally
3. Deploy to Vercel for production use
4. Consider adding:
   - Image compression before upload
   - Additional image formats (GIF, SVG)
   - Bulk delete functionality
   - Photo moderation for admin
