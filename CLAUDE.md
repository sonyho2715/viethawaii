# VietHawaii

## Project Overview
Vietnamese restaurant platform for Hawaii. Features restaurant listings, menu management, and admin dashboard for restaurant owners.

## Tech Stack
- **Framework:** Next.js 16 (App Router) with React 19
- **Database:** PostgreSQL on Railway + Prisma 6.19
- **Styling:** Tailwind CSS 4
- **Auth:** NextAuth v5 beta + @auth/prisma-adapter
- **Validation:** Zod 4
- **UI Components:** Radix UI (Avatar, Checkbox, Dialog, Dropdown, Select, Tabs)
- **Image Handling:** Cloudinary + next-cloudinary
- **File Storage:** Vercel Blob
- **Notifications:** Sonner

## App Structure
```
app/
├── (public)/           # Public-facing pages (restaurants, menus)
├── admin/              # Admin dashboard for management
├── api/                # API routes
├── layout.tsx          # Root layout with providers
└── page.tsx            # Home page
```

## Key Features
- Restaurant directory
- Menu management
- Admin dashboard
- Image uploads via Cloudinary
- Authentication with NextAuth

## Database Commands
```bash
npm run db:generate   # After schema changes
npm run db:push       # Push to dev database
npm run db:migrate    # Create migration
npm run db:seed       # Seed database
npm run db:studio     # Open Prisma Studio
```

## Environment Variables
- `DATABASE_URL` - Railway PostgreSQL connection string
- `AUTH_SECRET` - NextAuth secret
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob token

## Deployment
- **Hosting:** Vercel
- **Database:** Railway PostgreSQL

## Important Notes
- Uses NextAuth v5 beta (not iron-session like other projects)
- Uses Radix UI components (not custom components)
- Cloudinary handles image optimization and CDN

## Current Status
Active development
