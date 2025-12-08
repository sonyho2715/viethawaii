# viethawaii - Vietnamese Business Directory

## Project Overview
Vietnamese business directory for Hawaii. Features business listings, reviews, maps integration, and bilingual content (English/Vietnamese).

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Database:** PostgreSQL on Railway + Prisma ORM
- **Styling:** Tailwind CSS
- **Maps:** Google Maps API (@googlemaps/js-api-loader)
- **Images:** Vercel Blob storage
- **Auth:** iron-session + bcryptjs

## Key Models (Prisma)
- `Business` - Listings with bilingual fields (name/nameVi, description/descriptionVi)
- `Review` - User reviews with ratings
- `User` - Business owners and reviewers

## App Structure
```
app/
├── admin/          # Admin dashboard
├── auth/           # Login/register
├── business/       # Single business pages
├── businesses/     # Business listings
├── dashboard/      # Business owner dashboard
├── discover/       # Browse/search
├── blog/           # Blog posts
├── news/           # News section
└── submit/         # Submit new business
```

## Important Patterns

### Bilingual Content
Always include both English and Vietnamese fields:
```typescript
// Good
{ name: "Pho Restaurant", nameVi: "Nhà Hàng Phở" }
```

### Business Categories
Main categories: restaurants, grocery, services, professional, community

### Google Maps
Use the configured Google Maps loader for all map features. Marker clustering is enabled.

## Database Commands
```bash
npm run db:generate   # After schema changes
npm run db:push       # Push to dev database
npm run db:studio     # Open Prisma Studio
```

## Environment Variables
- `DATABASE_URL` - Railway PostgreSQL connection
- `GOOGLE_MAPS_API_KEY` - Maps integration
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage
- `SESSION_SECRET` - iron-session secret

## Deployment
- **Hosting:** Vercel (auto-deploy from main)
- **Database:** Railway PostgreSQL
- **Domain:** viethawaii.com

## Current Status
Active development. Core features complete, expanding content and SEO.
