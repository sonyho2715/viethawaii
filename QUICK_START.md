# 🚀 Quick Start - Set Up Railway Database

## Option 1: Automated Setup (Recommended)

Run the interactive setup script:

```bash
node scripts/setup-database.js
```

This will guide you through:
1. Creating a Railway project
2. Adding PostgreSQL database
3. Setting up environment variables
4. Pushing database schema
5. Seeding with sample data

## Option 2: Manual Setup

### Step 1: Create Railway Project

1. Open https://railway.app/new (opened in your browser)
2. Click **"Empty Project"**
3. Name it: **VietHawaii**

### Step 2: Add PostgreSQL Database

1. In your new Railway project, click **"+ New"**
2. Select **"Database"**
3. Choose **"Add PostgreSQL"**
4. Wait ~30 seconds for provisioning

### Step 3: Get Database URL

1. Click on the **PostgreSQL** service
2. Go to **"Variables"** tab
3. Find **DATABASE_URL**
4. Click the copy icon

### Step 4: Set Up Locally

Create `.env` file in project root:

```bash
DATABASE_URL="paste_your_url_here"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### Step 5: Initialize Database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to Railway
npm run db:push

# Seed with sample data
npm run db:seed
```

### Step 6: Verify Setup

```bash
# Open Prisma Studio to view data
npm run db:studio
```

You should see:
- ~30+ Businesses
- ~10 News Articles
- ~10 Blog Posts
- ~12 Discover Items

## 🎉 Success!

Your database is ready! You can now:

```bash
# Start development server
npm run dev

# Deploy to Railway
railway up

# Or connect GitHub repo in Railway dashboard for auto-deploy
```

## 🔐 Admin Access

- **URL**: http://localhost:3000/admin/login
- **Email**: admin@viethawaii.com
- **Password**: admin123

⚠️ **IMPORTANT**: Change password in production!

## 📊 Useful Commands

```bash
# View database in browser
npm run db:studio

# View Railway logs
railway logs

# Open Railway dashboard
railway open

# Check deployment status
railway status
```

## 🐛 Troubleshooting

### "Can't reach database server"

Check your DATABASE_URL format:
```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

### "Table doesn't exist"

Run schema push again:
```bash
npm run db:push
```

### "No data showing"

Reseed the database:
```bash
npm run db:seed
```

## 🚀 Deploy to Production

### Option A: Railway (Full Stack)

```bash
# Deploy everything to Railway
railway up
```

### Option B: Vercel (Frontend) + Railway (Database)

1. **Deploy to Vercel**:
   ```bash
   # If not installed
   npm i -g vercel

   # Deploy
   vercel --prod
   ```

2. **Add Environment Variables in Vercel**:
   - Go to Vercel Dashboard
   - Settings > Environment Variables
   - Add: `DATABASE_URL` (from Railway)
   - Redeploy

## 📚 Next Steps

1. **Test API endpoints**:
   - http://localhost:3000/api/businesses
   - http://localhost:3000/api/news
   - http://localhost:3000/api/blog

2. **Customize data**:
   - Edit `prisma/seed.ts`
   - Run `npm run db:seed` again

3. **Add more features**:
   - Reviews system
   - User authentication
   - Image uploads
   - Search functionality

## 💡 Tips

- **Local Development**: Use `npm run db:studio` to view/edit data
- **Production**: Use Railway dashboard to view database
- **Backups**: Railway automatically backs up your database
- **Scaling**: Railway handles scaling automatically

---

Need help? Check `RAILWAY_SETUP.md` for detailed documentation.
