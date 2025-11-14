#!/bin/bash

# VietHawaii Railway Setup Script
echo "🚂 Setting up Railway for VietHawaii..."

# Create a railway project using the API/CLI
echo ""
echo "Step 1: Creating Railway project..."
echo "Please run this command in your terminal:"
echo ""
echo "  railway init"
echo ""
echo "When prompted:"
echo "  1. Select 'Create a new project'"
echo "  2. Name it: VietHawaii"
echo ""
read -p "Press ENTER after you've created the project..."

# Add PostgreSQL database
echo ""
echo "Step 2: Adding PostgreSQL database..."
echo "Please run this command:"
echo ""
echo "  railway add"
echo ""
echo "When prompted:"
echo "  1. Select 'PostgreSQL'"
echo ""
read -p "Press ENTER after you've added PostgreSQL..."

# Get the DATABASE_URL
echo ""
echo "Step 3: Getting database credentials..."
echo "Run this command to see your DATABASE_URL:"
echo ""
echo "  railway variables"
echo ""
echo "Copy the DATABASE_URL value"
read -p "Press ENTER when ready..."

# Create .env file
echo ""
echo "Step 4: Creating .env file..."
read -p "Paste your DATABASE_URL here: " DATABASE_URL

cat > .env << EOF
# Railway PostgreSQL Database
DATABASE_URL="$DATABASE_URL"

# Next.js
NEXT_PUBLIC_API_URL="http://localhost:3000"
EOF

echo "✅ .env file created!"

# Generate Prisma Client
echo ""
echo "Step 5: Generating Prisma Client..."
npm run db:generate

# Push schema to database
echo ""
echo "Step 6: Pushing database schema..."
npm run db:push

# Seed the database
echo ""
echo "Step 7: Seeding database with sample data..."
npm run db:seed

echo ""
echo "🎉 Railway setup complete!"
echo ""
echo "Next steps:"
echo "  1. Open Prisma Studio: npm run db:studio"
echo "  2. Deploy to Railway: railway up"
echo "  3. Or connect GitHub repo in Railway dashboard"
echo ""
echo "Admin credentials:"
echo "  Email: admin@viethawaii.com"
echo "  Password: admin123"
echo ""
