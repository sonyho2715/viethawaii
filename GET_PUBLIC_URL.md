# 🔑 Get Public Database URL

## Issue

The URL you provided is the **INTERNAL** URL:
```
postgresql://postgres:...@postgres.railway.internal:5432/railway
```

This only works inside Railway's network. We need the **PUBLIC** URL for local development.

## Solution

### Step 1: Open Railway Dashboard

I've opened https://railway.app/dashboard in your browser.

### Step 2: Navigate to Your PostgreSQL Service

1. Find your VietHawaii project
2. Click on the **PostgreSQL** service (purple box)

### Step 3: Get the PUBLIC URL

You have TWO options:

#### Option A: Use DATABASE_PUBLIC_URL (Recommended)

1. Go to the **Variables** tab
2. Look for **`DATABASE_PUBLIC_URL`** (NOT DATABASE_URL)
3. Copy the value - it should look like:
   ```
   postgresql://postgres:PASSWORD@HOST.railway.app:PORT/railway
   ```

#### Option B: Use Connect Tab

1. Go to the **Connect** tab
2. Look for **"Connection String"** or **"Public URL"**
3. Select the format: **PostgreSQL**
4. Copy the full connection string

### Step 4: Update .env File

Once you have the PUBLIC URL, run:

```bash
cat > .env << 'EOF'
# Railway PostgreSQL Database (PUBLIC URL)
DATABASE_URL="postgresql://postgres:PASSWORD@HOST.railway.app:PORT/railway"

# Next.js
NEXT_PUBLIC_API_URL="http://localhost:3000"

# Admin
ADMIN_EMAIL="admin@viethawaii.com"
ADMIN_PASSWORD="admin123"
EOF
```

**Replace the DATABASE_URL with your actual public URL!**

### Step 5: Continue Setup

After updating .env with the PUBLIC url:

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to Railway
npm run db:push

# Seed database
npm run db:seed

# Verify
npm run db:studio
```

## What's the Difference?

- **INTERNAL URL** (`postgres.railway.internal`):
  - Only works inside Railway's network
  - Used by services deployed on Railway
  - Faster, no internet routing

- **PUBLIC URL** (`something.railway.app`):
  - Works from anywhere (your local machine, internet, etc.)
  - Required for local development
  - Required for external connections

## Quick Check

Your URL should have one of these patterns:

✅ **CORRECT (Public URLs)**:
```
postgresql://postgres:xxx@containers-us-west-123.railway.app:5432/railway
postgresql://postgres:xxx@roundhouse.proxy.rlwy.net:12345/railway
postgresql://postgres:xxx@viaduct.proxy.rlwy.net:54321/railway
```

❌ **WRONG (Internal URL)**:
```
postgresql://postgres:xxx@postgres.railway.internal:5432/railway
```

## Next Steps

1. Get the PUBLIC DATABASE_URL from Railway dashboard
2. Update the .env file
3. Let me know when ready, and I'll continue the setup!
