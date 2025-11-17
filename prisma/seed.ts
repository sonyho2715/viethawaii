import { PrismaClient } from '@prisma/client';
import { sampleBusinesses } from '../lib/sampleData';
import { realBusinesses, newsArticles, blogPosts, discoverItems } from '../lib/enhancedData';
import { additionalBusinesses } from '../lib/additionalBusinesses';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.photo.deleteMany();
  await prisma.review.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.business.deleteMany();
  await prisma.newsArticle.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.discoverItem.deleteMany();
  await prisma.user.deleteMany();

  // Seed businesses
  console.log('Seeding businesses...');
  const allBusinesses = [...sampleBusinesses, ...realBusinesses, ...additionalBusinesses];

  for (const business of allBusinesses) {
    await prisma.business.create({
      data: {
        name: business.name,
        nameVi: business.nameVi,
        slug: business.slug,
        description: business.description,
        descriptionVi: business.descriptionVi,
        category: business.category,
        subcategory: business.subcategory,
        address: business.address,
        city: business.city,
        island: business.island,
        phone: business.phone,
        email: business.email,
        website: business.website,
        image: business.image,
        images: business.images || [],
        priceRange: business.priceRange,
        rating: business.rating || 0,
        reviewCount: business.reviewCount || 0,
        featured: business.featured || false,
        verified: business.verified || false,
        features: business.features || [],
        hours: business.hours as any,
        status: 'active',
      },
    });
  }
  console.log(`✓ Seeded ${allBusinesses.length} businesses`);

  // Seed news articles
  console.log('Seeding news articles...');
  for (const article of newsArticles) {
    await prisma.newsArticle.create({
      data: {
        title: article.title,
        titleVi: article.titleVi,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        author: article.author,
        image: article.image,
        category: article.category,
        tags: article.tags || [],
        featured: article.featured || false,
        published: true,
        publishedAt: new Date(article.date),
      },
    });
  }
  console.log(`✓ Seeded ${newsArticles.length} news articles`);

  // Seed blog posts
  console.log('Seeding blog posts...');
  for (const post of blogPosts) {
    await prisma.blogPost.create({
      data: {
        title: post.title,
        titleVi: post.titleVi,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        author: post.author,
        image: post.image,
        category: post.category,
        tags: post.tags || [],
        readTime: post.readTime || 5,
        featured: post.featured || false,
        published: true,
        publishedAt: new Date(post.date),
      },
    });
  }
  console.log(`✓ Seeded ${blogPosts.length} blog posts`);

  // Seed discover items
  console.log('Seeding discover items...');
  for (const item of discoverItems) {
    const slug = item.link.split('/').pop() || item.id;
    await prisma.discoverItem.create({
      data: {
        title: item.title,
        titleVi: item.titleVi,
        slug: slug,
        description: item.description,
        content: item.description, // Use description as content for now
        image: item.image,
        type: item.type,
        featured: false,
        published: true,
      },
    });
  }
  console.log(`✓ Seeded ${discoverItems.length} discover items`);

  // Create admin user
  console.log('Creating admin user...');
  const bcrypt = require('bcryptjs');
  const passwordHash = await bcrypt.hash('admin123', 10);

  await prisma.user.create({
    data: {
      email: 'admin@viethawaii.com',
      name: 'Admin User',
      passwordHash,
      role: 'admin',
      verified: true,
    },
  });
  console.log('✓ Created admin user (email: admin@viethawaii.com, password: admin123)');

  console.log('\n✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
