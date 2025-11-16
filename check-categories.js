const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkCategories() {
  try {
    // Get all businesses with their categories
    const businesses = await prisma.business.findMany({
      where: { status: 'active' },
      select: {
        name: true,
        category: true,
      },
    });

    console.log('\n=== All Businesses and Their Categories ===\n');
    businesses.forEach(b => {
      console.log(`${b.name} -> ${b.category}`);
    });

    // Group by category
    const categoryCounts = {};
    businesses.forEach(b => {
      categoryCounts[b.category] = (categoryCounts[b.category] || 0) + 1;
    });

    console.log('\n=== Category Counts ===\n');
    Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([category, count]) => {
        console.log(`${category}: ${count} businesses`);
      });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCategories();
