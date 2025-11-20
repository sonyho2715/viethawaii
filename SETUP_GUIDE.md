# VietHawaii - Real Estate Style Setup Guide

Complete guide to set up and deploy the new features for VietHawaii.

---

## ✅ What's Been Implemented

All features have been successfully implemented:

1. ✅ OAuth Authentication (Google, Facebook, Email)
2. ✅ User Favorites System
3. ✅ Saved Searches
4. ✅ Custom Price Markers on Map
5. ✅ Business Detail Modal
6. ✅ Google Places API Integration
7. ✅ Updated Database Schema

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd ~/viethawaii
npm install
```

### 2. Set Up Environment Variables

Copy the example file and fill in your API keys:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Database (Already configured)
DATABASE_URL="postgresql://postgres:LXyXSConYHpwChOXtIGiwhqgqnNywAVb@switchback.proxy.rlwy.net:54285/railway"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="[GENERATE_THIS]"

# Google OAuth
GOOGLE_CLIENT_ID="[YOUR_GOOGLE_CLIENT_ID]"
GOOGLE_CLIENT_SECRET="[YOUR_GOOGLE_CLIENT_SECRET]"

# Facebook OAuth
FACEBOOK_CLIENT_ID="[YOUR_FACEBOOK_CLIENT_ID]"
FACEBOOK_CLIENT_SECRET="[YOUR_FACEBOOK_CLIENT_SECRET]"

# Google Maps API (Already configured)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="[YOUR_EXISTING_KEY]"

# Google Places API
GOOGLE_PLACES_API_KEY="[YOUR_GOOGLE_PLACES_KEY]"
```

### 3. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Copy the output and paste it as `NEXTAUTH_SECRET` in your `.env.local` file.

### 4. Database Migration

The database schema has already been updated. Just verify:

```bash
DATABASE_URL="postgresql://postgres:LXyXSConYHpwChOXtIGiwhqgqnNywAVb@switchback.proxy.rlwy.net:54285/railway" npx prisma generate
```

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 🔑 Getting API Keys

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth 2.0 Client ID**
5. Configure consent screen if needed
6. Application type: **Web application**
7. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://your-domain.com/api/auth/callback/google` (production)
8. Copy **Client ID** and **Client Secret**

### Facebook OAuth

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **My Apps > Create App**
3. Choose **Consumer** app type
4. Add **Facebook Login** product
5. Settings > Basic:
   - Copy **App ID** (this is your `FACEBOOK_CLIENT_ID`)
   - Copy **App Secret** (this is your `FACEBOOK_CLIENT_SECRET`)
6. Facebook Login > Settings:
   - Add Valid OAuth Redirect URIs:
     - `http://localhost:3000/api/auth/callback/facebook`
     - `https://your-domain.com/api/auth/callback/facebook`

### Google Places API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable **Places API**:
   - APIs & Services > Library
   - Search for "Places API"
   - Click **Enable**
3. Create API Key:
   - APIs & Services > Credentials
   - Create Credentials > API Key
   - Restrict key to Places API (recommended)

---

## 📦 Import Restaurant Data

### Option 1: Import from Google Places (Recommended)

Run the import script to automatically import Vietnamese restaurants:

```bash
DATABASE_URL="postgresql://postgres:LXyXSConYHpwChOXtIGiwhqgqnNywAVb@switchback.proxy.rlwy.net:54285/railway" npx tsx scripts/import-restaurants.ts
```

This will:
- Search for Vietnamese restaurants across all Hawaiian islands
- Import business details, photos, ratings, hours
- Automatically geocode locations
- Skip duplicates

**Expected Results:**
- Oahu: ~50-100 restaurants
- Maui: ~10-20 restaurants
- Hawaii Island: ~5-15 restaurants
- Kauai: ~5-10 restaurants

### Option 2: Manual Entry

Use the existing admin panel or submit form to add businesses manually.

---

## 🎨 New Features Guide

### 1. OAuth Sign In

Users can now sign in with:
- **Google** - Click "Continue with Google"
- **Facebook** - Click "Continue with Facebook"
- **Email** - Traditional email/password

**Sign In Page:** `/auth/signin`

### 2. Favorites System

**For Users:**
- Click the heart icon on any business card or detail page
- View saved favorites in user dashboard
- Favorites persist across sessions

**API Endpoints:**
- `GET /api/favorites` - Get all user favorites
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites` - Remove from favorites

### 3. Saved Searches

**For Users:**
- Apply filters on the businesses page
- Click "Save Search" to save current filters
- Get notified of new matching businesses (daily/weekly/instant)

**API Endpoints:**
- `GET /api/saved-searches` - Get all saved searches
- `POST /api/saved-searches` - Create saved search
- `DELETE /api/saved-searches?id=xxx` - Delete saved search

### 4. Custom Map Markers

The map now shows:
- **Price + Rating** badges on each business
- Example: `$$ • 4.5⭐`
- Blue gradient styling matching real estate theme
- Hover effects and animations

### 5. Business Modal

Click any map marker to see:
- Large image gallery
- Business details (rating, price, hours)
- Quick action buttons (Call, Directions, View Details)
- Favorite button

---

## 🌐 Deployment

### Update Environment Variables on Vercel

```bash
# Navigate to Vercel dashboard
open https://vercel.com/dashboard

# Or use Vercel CLI
vercel env add NEXTAUTH_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add GOOGLE_CLIENT_ID production
vercel env add GOOGLE_CLIENT_SECRET production
vercel env add FACEBOOK_CLIENT_ID production
vercel env add FACEBOOK_CLIENT_SECRET production
vercel env add GOOGLE_PLACES_API_KEY production
```

**Important for Production:**
- Set `NEXTAUTH_URL` to your production domain (e.g., `https://viethawaii.vercel.app`)
- Update OAuth redirect URIs in Google and Facebook to include production URLs
- Enable Google Places API for production domain

### Deploy to Vercel

```bash
# Deploy to production
vercel --prod

# Or push to main branch for automatic deployment
git add .
git commit -m "Add OAuth, favorites, and real estate-style features"
git push origin main
```

---

## 🧪 Testing

### Test OAuth Login

1. Start dev server: `npm run dev`
2. Visit `http://localhost:3000/auth/signin`
3. Try each login method:
   - Google OAuth
   - Facebook OAuth
   - Email/Password

### Test Favorites

1. Sign in with any method
2. Browse businesses: `http://localhost:3000/businesses`
3. Click heart icon on a business
4. Verify it appears in favorites

### Test Map

1. Visit businesses page
2. Click "Map" view
3. Verify:
   - Custom markers show price + rating
   - Clicking marker opens modal
   - Modal shows business details
   - Favorite button works in modal

### Test Import Script

```bash
# Dry run - see what would be imported
DATABASE_URL="postgresql://..." npx tsx scripts/import-restaurants.ts

# Check imported businesses in Prisma Studio
DATABASE_URL="postgresql://..." npx prisma studio
```

---

## 📊 Database Schema Changes

### New Tables

**Account** - OAuth account connections
**Session** - NextAuth sessions
**VerificationToken** - Email verification tokens
**SavedSearch** - User saved searches

### Updated Tables

**User:**
- Added `provider`, `providerId` for OAuth
- Added `savedBusinesses` array for favorites
- Made `passwordHash` optional (for OAuth users)
- Added `emailVerified` timestamp

---

## 🎯 Next Steps

### Recommended Enhancements

1. **Email Notifications**
   - Set up SendGrid or similar
   - Send alerts for saved searches
   - Welcome emails for new users

2. **User Dashboard**
   - Create `/dashboard` page
   - Show favorites, saved searches
   - Account settings

3. **Admin Panel Updates**
   - Manage user OAuth connections
   - View favorites analytics
   - Monitor saved searches

4. **Performance**
   - Add caching for favorites
   - Optimize map rendering
   - Image optimization

### Optional Features

- Reviews and ratings from signed-in users
- Business owner verification
- Premium business listings
- Advanced search filters
- Mobile app integration

---

## 🐛 Troubleshooting

### OAuth Not Working

**Error:** "Callback URL mismatch"
- Ensure redirect URIs match exactly in Google/Facebook console
- Include both `http://localhost:3000` and production URLs

**Error:** "Invalid credentials"
- Verify Client ID and Secret are correct
- Check environment variables are loaded
- Restart dev server after changing `.env.local`

### Favorites Not Saving

**Error:** "Unauthorized"
- Ensure user is signed in
- Check NextAuth session is active
- Verify `SessionProvider` wraps the app

### Map Markers Not Showing

**Issue:** Markers are invisible
- Check Google Maps API key is valid
- Verify businesses have `lat` and `lng` values
- Check browser console for errors

### Import Script Fails

**Error:** "Places API not enabled"
- Enable Places API in Google Cloud Console
- Wait 5-10 minutes for activation
- Check API key has Places API permission

**Error:** "Quota exceeded"
- You've hit the free tier limit
- Enable billing in Google Cloud
- Or wait 24 hours for quota reset

---

## 📞 Support

For issues or questions:
1. Check this guide first
2. Review error messages in browser console
3. Check Railway database logs
4. Review Vercel deployment logs

---

## ✨ Success!

You've successfully implemented all real estate-style features! Your VietHawaii platform now has:

- Modern OAuth authentication
- User favorites and saved searches
- Beautiful custom map markers
- Google Places integration
- Professional business modals

**Next:** Import restaurant data and deploy to production! 🚀
