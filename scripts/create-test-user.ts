import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Check if test user already exists
    const existing = await prisma.user.findUnique({
      where: { email: 'test@viethawaii.com' }
    });

    if (existing) {
      console.log('✅ Test user already exists!');
      console.log('Email: test@viethawaii.com');
      console.log('Password: password123');
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash('password123', 10);

    // Create test user
    const user = await prisma.user.create({
      data: {
        email: 'test@viethawaii.com',
        name: 'Test User',
        passwordHash,
        role: 'user',
        verified: true,
        provider: 'email',
        savedBusinesses: [],
      }
    });

    console.log('✅ Test user created successfully!');
    console.log('Email: test@viethawaii.com');
    console.log('Password: password123');
    console.log('User ID:', user.id);
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
