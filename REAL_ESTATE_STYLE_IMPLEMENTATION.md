# VietHawaii - Real Estate Style Implementation Plan

Transform viethawaii into a premium restaurant discovery platform with real estate-style search and mapping.

---

## ✅ What You Already Have

- Google Maps with marker clustering ✅
- Search & filters (category, island, price, rating) ✅
- Grid/List/Map view modes ✅
- Distance calculation & geolocation ✅
- User authentication (email) ✅
- PostgreSQL database with businesses, reviews, photos ✅

---

## 🎯 Features to Add

### 1. OAuth Login (Google, Facebook, Email)

**Add to schema:**
```prisma
model User {
  // ... existing fields
  provider      String?  // google, facebook, email
  providerId    String?  // OAuth provider ID

  @@unique([provider, providerId])
}
```

**Install packages:**
```bash
npm install next-auth @auth/prisma-adapter
```

**Create `/app/api/auth/[...nextauth]/route.ts`:**
```typescript
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

**Environment variables:**
```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
```

---

### 2. User Favorites System

**Update schema:**
```prisma
model User {
  // ... existing fields
  savedBusinesses String[]  // Array of business IDs
  savedSearches   Json[]    // Array of saved search filters
}
```

**Create API endpoint `/app/api/favorites/route.ts`:**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { businessId } = await request.json();

  const user = await prisma.user.update({
    where: { email: session.user.email },
    data: {
      savedBusinesses: {
        push: businessId
      }
    }
  });

  return NextResponse.json({ success: true, savedBusinesses: user.savedBusinesses });
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { businessId } = await request.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  const updatedSaved = user?.savedBusinesses.filter(id => id !== businessId) || [];

  await prisma.user.update({
    where: { email: session.user.email },
    data: { savedBusinesses: updatedSaved }
  });

  return NextResponse.json({ success: true, savedBusinesses: updatedSaved });
}
```

**Favorite button component:**
```typescript
'use client';

import { Heart } from 'lucide-react';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function FavoriteButton({ businessId }: { businessId: string }) {
  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = async () => {
    if (!session) {
      // Redirect to login
      window.location.href = '/auth/signin';
      return;
    }

    const method = isFavorite ? 'DELETE' : 'POST';
    const res = await fetch('/api/favorites', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessId })
    });

    if (res.ok) {
      setIsFavorite(!isFavorite);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`p-2 rounded-full transition-all ${
        isFavorite
          ? 'bg-red-500 text-white'
          : 'bg-white/90 text-gray-700 hover:bg-red-50'
      }`}
    >
      <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
    </button>
  );
}
```

---

### 3. Google Places API Integration

**Install:**
```bash
npm install @googlemaps/google-maps-services-js
```

**Create data import script `/scripts/import-restaurants.ts`:**
```typescript
import { Client } from '@googlemaps/google-maps-services-js';
import { prisma } from '../lib/prisma';

const client = new Client({});

async function importRestaurants(location: string, radius: number = 10000) {
  const response = await client.placesNearby({
    params: {
      location: location, // "21.3099,157.8581" for Honolulu
      radius: radius,
      type: 'restaurant',
      keyword: 'vietnamese',
      key: process.env.GOOGLE_PLACES_API_KEY!,
    }
  });

  for (const place of response.data.results) {
    // Get detailed info
    const details = await client.placeDetails({
      params: {
        place_id: place.place_id!,
        key: process.env.GOOGLE_PLACES_API_KEY!,
      }
    });

    const detail = details.data.result;

    // Create business in database
    await prisma.business.create({
      data: {
        name: detail.name || '',
        slug: detail.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '',
        description: detail.editorial_summary?.overview || detail.types?.join(', ') || '',
        category: 'Food & Dining',
        subcategory: 'Vietnamese Restaurant',
        address: detail.formatted_address || '',
        city: extractCity(detail.formatted_address || ''),
        island: 'Oahu', // Determine from coordinates
        zipCode: extractZipCode(detail.formatted_address || ''),
        phone: detail.formatted_phone_number,
        website: detail.website,
        lat: detail.geometry?.location.lat,
        lng: detail.geometry?.location.lng,
        rating: detail.rating || 0,
        reviewCount: detail.user_ratings_total || 0,
        priceRange: '$$', // Map from detail.price_level
        images: detail.photos?.map(p =>
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${p.photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}`
        ) || [],
        hours: detail.opening_hours?.periods,
        features: detail.types || [],
        verified: true,
        status: 'active'
      }
    });

    console.log(`Imported: ${detail.name}`);
  }
}

function extractCity(address: string): string {
  const parts = address.split(',');
  return parts[parts.length - 3]?.trim() || 'Honolulu';
}

function extractZipCode(address: string): string | null {
  const match = address.match(/\b\d{5}\b/);
  return match ? match[0] : null;
}

// Run: tsx scripts/import-restaurants.ts
importRestaurants("21.3099,-157.8581").then(() => {
  console.log('Import complete!');
  process.exit(0);
});
```

**Environment variable:**
```bash
GOOGLE_PLACES_API_KEY=your_google_places_api_key
```

**Run import:**
```bash
tsx scripts/import-restaurants.ts
```

---

### 4. Price Clustering on Map (Like Real Estate Site)

**Update InteractiveBusinessMap component:**
```typescript
// In InteractiveBusinessMap.tsx

const createCustomMarker = (business: Business, map: google.maps.Map) => {
  // Create custom HTML marker with price
  const marker = new google.maps.marker.AdvancedMarkerElement({
    position: { lat: business.latitude!, lng: business.longitude! },
    map: map,
    content: buildMarkerContent(business),
  });

  // Click to show info
  marker.addListener('click', () => {
    showBusinessInfo(business);
  });

  return marker;
};

const buildMarkerContent = (business: Business) => {
  const div = document.createElement('div');
  div.className = 'custom-marker';
  div.innerHTML = `
    <div style="
      background: linear-gradient(135deg, #0077BE 0%, #5FA8D3 100%);
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 13px;
      box-shadow: 0 4px 12px rgba(0,119,190,0.3);
      cursor: pointer;
      white-space: nowrap;
      border: 2px solid white;
    ">
      ${business.priceRange || '$$'} • ${business.rating?.toFixed(1) || '4.5'}⭐
    </div>
  `;
  return div;
};
```

---

### 5. Business Detail Modal

**Create `/components/BusinessModal.tsx`:**
```typescript
'use client';

import { X, MapPin, Phone, Globe, Star, Clock, DollarSign } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import FavoriteButton from './FavoriteButton';

interface BusinessModalProps {
  business: any;
  onClose: () => void;
}

export default function BusinessModal({ business, onClose }: BusinessModalProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header with image gallery */}
        <div className="relative h-96">
          <Image
            src={business.images?.[selectedImage] || business.image || '/placeholder.jpg'}
            alt={business.name}
            fill
            className="object-cover"
          />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Favorite button */}
          <div className="absolute top-4 left-4">
            <FavoriteButton businessId={business.id} />
          </div>

          {/* Image thumbnails */}
          {business.images && business.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {business.images.slice(0, 5).map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    selectedImage === idx ? 'border-blue-500' : 'border-white'
                  }`}
                >
                  <Image src={img} alt="" width={64} height={64} className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Business details */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{business.name}</h2>
              {business.nameVi && (
                <p className="text-lg text-gray-600 mt-1">{business.nameVi}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="text-xl font-semibold">{business.rating?.toFixed(1)}</span>
              <span className="text-gray-500">({business.reviewCount} reviews)</span>
            </div>
          </div>

          {/* Quick info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 text-gray-700">
              <DollarSign className="w-5 h-5" />
              <span>{business.priceRange || '$$'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-5 h-5" />
              <span>Open now • Closes 9 PM</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-5 h-5" />
              <span>{business.address}</span>
            </div>
            {business.phone && (
              <div className="flex items-center gap-2 text-gray-700">
                <Phone className="w-5 h-5" />
                <a href={`tel:${business.phone}`} className="hover:text-blue-600">
                  {business.phone}
                </a>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-700 mb-6">{business.description}</p>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Link
              href={`/business/${business.slug}`}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 text-center"
            >
              View Full Details
            </Link>
            {business.phone && (
              <a
                href={`tel:${business.phone}`}
                className="flex-1 bg-white border-2 border-blue-600 text-blue-600 py-3 px-6 rounded-lg font-semibold hover:bg-blue-50 text-center"
              >
                Call Now
              </a>
            )}
            {business.website && (
              <a
                href={business.website}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-100 p-3 rounded-lg hover:bg-gray-200"
              >
                <Globe className="w-6 h-6 text-gray-700" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

### 6. Saved Searches

**Update schema:**
```prisma
model SavedSearch {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  name        String   // User-friendly name
  filters     Json     // Search filters
  frequency   String   @default("daily") // daily, weekly, instant

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
}

model User {
  // ... existing fields
  savedSearches SavedSearch[]
}
```

**Create API `/app/api/saved-searches/route.ts`:**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, filters, frequency } = await request.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  const savedSearch = await prisma.savedSearch.create({
    data: {
      userId: user!.id,
      name,
      filters,
      frequency
    }
  });

  return NextResponse.json(savedSearch);
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { savedSearches: true }
  });

  return NextResponse.json(user?.savedSearches || []);
}
```

---

## 🚀 Implementation Order

1. **Week 1: Authentication**
   - Add OAuth providers (Google, Facebook)
   - Update login UI to match real estate site
   - Test social login flows

2. **Week 2: Favorites & Saved Searches**
   - Implement favorites system
   - Add saved searches
   - Build user dashboard

3. **Week 3: Google Places Integration**
   - Get Google Places API key
   - Run import script for real restaurant data
   - Verify data quality

4. **Week 4: Map Enhancements**
   - Add custom price markers
   - Implement business detail modal
   - Polish map interactions

5. **Week 5: Testing & Polish**
   - Test all features
   - Performance optimization
   - UI refinements

---

## 💰 Cost Estimate

- **Google Places API**: $0 (free tier: basic usage)
- **Google Maps API**: ~$50-200/month (based on traffic)
- **NextAuth**: Free
- **Database (PostgreSQL)**: Already using Railway
- **Hosting**: Already on Vercel

**Total Additional Monthly Cost**: ~$50-200

---

## 📊 Data Sources

1. **Google Places API** (primary)
   - Restaurant details, photos, reviews
   - Automatically updated

2. **Manual submissions**
   - Restaurant owners can claim listings
   - Community contributions

3. **Yelp Fusion API** (supplemental)
   - Additional reviews and ratings
   - Cross-verification

---

## 🎨 UI Improvements

**Match Real Estate Site Aesthetic:**
- Clean, modern design with lots of white space
- Blue color scheme (already using ocean blues)
- Large, high-quality images
- Clear CTAs (Call, Directions, Save)
- Smooth animations and transitions

---

## ✅ Next Steps

Run this command to start implementation:

```bash
# 1. Install required packages
npm install next-auth @auth/prisma-adapter @googlemaps/google-maps-services-js

# 2. Update database schema
npx prisma generate
npx prisma db push

# 3. Get API keys:
# - Google OAuth: https://console.cloud.google.com
# - Facebook OAuth: https://developers.facebook.com
# - Google Places API: https://console.cloud.google.com

# 4. Start development
npm run dev
```

You're 80% there! Most of the hard work is already done. 🎉
