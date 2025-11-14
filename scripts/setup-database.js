#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function executeCommand(command, description) {
  console.log(`\n⏳ ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} complete!`);
    return true;
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🌺 VietHawaii Database Setup\n');
  console.log('This script will help you set up your Railway PostgreSQL database.\n');

  // Step 1: Check if Railway is installed and logged in
  try {
    const whoami = execSync('railway whoami', { encoding: 'utf-8' });
    console.log(`✅ ${whoami}`);
  } catch (error) {
    console.log('❌ Not logged in to Railway');
    console.log('\nPlease run: railway login');
    process.exit(1);
  }

  // Step 2: Instructions for creating project
  console.log('\n📋 STEP 1: Create Railway Project');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('\nI\'ve opened the Railway dashboard in your browser.');
  console.log('\nPlease follow these steps:');
  console.log('  1. Click "Empty Project" or "Deploy from GitHub"');
  console.log('  2. If deploying from GitHub, select "viethawaii" repository');
  console.log('  3. Name the project: "VietHawaii"');

  await question('\nPress ENTER when you\'ve created the project...');

  // Step 3: Add PostgreSQL
  console.log('\n📋 STEP 2: Add PostgreSQL Database');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('\nIn the Railway dashboard:');
  console.log('  1. Click "+ New" button');
  console.log('  2. Select "Database"');
  console.log('  3. Choose "Add PostgreSQL"');
  console.log('  4. Wait for the database to be provisioned (takes ~30 seconds)');

  await question('\nPress ENTER when PostgreSQL is ready...');

  // Step 4: Get DATABASE_URL
  console.log('\n📋 STEP 3: Get Database Connection String');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('\nIn the Railway dashboard:');
  console.log('  1. Click on the PostgreSQL service');
  console.log('  2. Go to the "Variables" tab');
  console.log('  3. Find "DATABASE_URL"');
  console.log('  4. Click the copy icon to copy the full URL');

  const databaseUrl = await question('\nPaste your DATABASE_URL here: ');

  if (!databaseUrl || !databaseUrl.startsWith('postgresql://')) {
    console.log('❌ Invalid DATABASE_URL. Must start with postgresql://');
    process.exit(1);
  }

  // Step 5: Create .env file
  console.log('\n📋 STEP 4: Creating Environment File');
  console.log('═══════════════════════════════════════════════════════════');

  const envContent = `# Railway PostgreSQL Database
DATABASE_URL="${databaseUrl}"

# Next.js
NEXT_PUBLIC_API_URL="http://localhost:3000"

# Admin credentials (change in production!)
ADMIN_EMAIL="admin@viethawaii.com"
ADMIN_PASSWORD="admin123"
`;

  fs.writeFileSync('.env', envContent);
  console.log('✅ .env file created!');

  // Step 6: Generate Prisma Client
  if (!executeCommand('npm run db:generate', 'Generating Prisma Client')) {
    process.exit(1);
  }

  // Step 7: Push schema
  console.log('\n📋 STEP 5: Pushing Database Schema');
  console.log('═══════════════════════════════════════════════════════════');
  const pushSchema = await question('Do you want to push the schema to Railway? (yes/no): ');

  if (pushSchema.toLowerCase() === 'yes' || pushSchema.toLowerCase() === 'y') {
    if (!executeCommand('npm run db:push', 'Pushing database schema')) {
      process.exit(1);
    }
  }

  // Step 8: Seed database
  console.log('\n📋 STEP 6: Seeding Database');
  console.log('═══════════════════════════════════════════════════════════');
  const seedDb = await question('Do you want to seed the database with sample data? (yes/no): ');

  if (seedDb.toLowerCase() === 'yes' || seedDb.toLowerCase() === 'y') {
    if (!executeCommand('npm run db:seed', 'Seeding database')) {
      process.exit(1);
    }
  }

  // Step 9: Success message
  console.log('\n\n🎉 Setup Complete!');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('\n✅ Your Railway PostgreSQL database is ready!');
  console.log('\n📊 Next steps:');
  console.log('  1. View your data:    npm run db:studio');
  console.log('  2. Start dev server:  npm run dev');
  console.log('  3. Deploy to Railway: railway up');
  console.log('  4. Or push to GitHub to auto-deploy');

  console.log('\n🔐 Admin Login:');
  console.log('  URL:      /admin/login');
  console.log('  Email:    admin@viethawaii.com');
  console.log('  Password: admin123');
  console.log('  ⚠️  Change this password in production!');

  console.log('\n📦 Database Stats:');
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const businessCount = await prisma.business.count();
    const newsCount = await prisma.newsArticle.count();
    const blogCount = await prisma.blogPost.count();
    const discoverCount = await prisma.discoverItem.count();

    console.log(`  Businesses: ${businessCount}`);
    console.log(`  News:       ${newsCount}`);
    console.log(`  Blog Posts: ${blogCount}`);
    console.log(`  Discover:   ${discoverCount}`);

    await prisma.$disconnect();
  } catch (error) {
    // Prisma client not generated yet
  }

  console.log('\n');
  rl.close();
}

main().catch(error => {
  console.error('Error:', error);
  rl.close();
  process.exit(1);
});
