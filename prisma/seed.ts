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
    // Type assertion to access optional properties safely
    const b = business as {
      name: string;
      nameVi?: string;
      slug: string;
      description: string;
      descriptionVi?: string;
      category: string;
      subcategory?: string;
      address?: string;
      city: string;
      island: string;
      phone?: string;
      email?: string;
      website?: string;
      image?: string;
      images?: string[];
      priceRange?: string;
      rating?: number;
      reviewCount?: number;
      featured?: boolean;
      verified?: boolean;
      features?: string[];
      hours?: Record<string, unknown>;
      lat?: number;
      lng?: number;
    };

    await prisma.business.create({
      data: {
        name: b.name,
        nameVi: b.nameVi,
        slug: b.slug,
        description: b.description,
        descriptionVi: b.descriptionVi,
        category: b.category,
        subcategory: b.subcategory,
        address: b.address || '',
        city: b.city,
        island: b.island,
        phone: b.phone,
        email: b.email,
        website: b.website,
        image: b.image,
        images: b.images || [],
        priceRange: b.priceRange,
        rating: b.rating || 0,
        reviewCount: b.reviewCount || 0,
        featured: b.featured || false,
        verified: b.verified || false,
        features: b.features || [],
        hours: b.hours as any,
        lat: b.lat,
        lng: b.lng,
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
        tags: [],
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
        tags: [],
        readTime: post.readTime || 5,
        featured: false,
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
