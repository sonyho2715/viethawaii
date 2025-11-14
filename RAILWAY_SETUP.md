# Railway PostgreSQL Database Setup Guide

## Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

## Step 2: Login to Railway

```bash
railway login
```

## Step 3: Initialize Railway Project

```bash
railway init
```

Select or create a new project named "viethawaii"

## Step 4: Add PostgreSQL Database

```bash
railway add --database postgres
```

This will:
- Create a PostgreSQL database
- Generate a DATABASE_URL automatically
- Set up connection credentials

## Step 5: Link Your Local Project

```bash
railway link
```

Select the "viethawaii" project you just created.

## Step 6: Get Database URL

```bash
railway variables
```

Copy the `DATABASE_URL` value and add it to your `.env` file:

```bash
echo "DATABASE_URL=your_database_url_here" > .env
```

Or use Railway's environment:

```bash
railway run npm run db:push
railway run npm run db:seed
```

## Step 7: Push Database Schema

```bash
npm run db:push
```

This will create all tables in your PostgreSQL database.

## Step 8: Seed the Database

```bash
npm run db:seed
```

This will populate your database with sample data.

## Step 9: Verify Database

Open Prisma Studio to view your data:

```bash
npm run db:studio
```

Or use Railway's database UI:

```bash
railway open
```

Then click on the PostgreSQL service.

## Step 10: Deploy to Railway

```bash
railway up
```

This will deploy your application to Railway.

## Alternative: Using Railway Dashboard

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account
5. Select the "viethawaii" repository
6. Add PostgreSQL database from the dashboard
7. Set environment variables:
   - `DATABASE_URL` will be automatically set
   - Add `NEXT_PUBLIC_API_URL` = your Railway app URL

8. Deploy!

## Environment Variables for Vercel (Frontend)

If you're deploying the frontend to Vercel:

1. Go to Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add:
   - `DATABASE_URL` = Your Railway PostgreSQL URL
   - `NEXT_PUBLIC_API_URL` = Your Vercel app URL

## Useful Commands

```bash
# View logs
railway logs

# Open database in browser
railway open

# Run commands in Railway environment
railway run [command]

# View all environment variables
railway variables

# Set environment variable
railway variables set KEY=VALUE
```

## Database Management

```bash
# Generate Prisma Client
npm run db:generate

# Push schema changes (development)
npm run db:push

# Create migration (production)
npm run db:migrate

# Seed database
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

## Troubleshooting

### Connection Issues

If you can't connect to the database:

1. Check DATABASE_URL format:
   ```
   postgresql://USER:PASSWORD@HOST:PORT/DATABASE
   ```

2. Ensure you're using the public URL (not internal)
3. Check if your IP is whitelisted (Railway allows all by default)

### Migration Issues

If migrations fail:

```bash
# Reset database (⚠️ destroys all data)
railway run npx prisma migrate reset

# Or manually push schema
railway run npx prisma db push --force-reset
```

### Seed Issues

If seeding fails:

```bash
# Check the logs
railway logs

# Run seed with verbose output
railway run tsx prisma/seed.ts
```

## Production Deployment Checklist

- [ ] Database created on Railway
- [ ] Environment variables set
- [ ] Schema pushed (`npm run db:push`)
- [ ] Database seeded (`npm run db:seed`)
- [ ] Application deployed
- [ ] Test API endpoints
- [ ] Verify data in Prisma Studio
- [ ] Check application logs

## Admin Credentials

After seeding, you can login to admin dashboard with:

- Email: `admin@viethawaii.com`
- Password: `admin123`

**⚠️ Important:** Change the admin password in production!
