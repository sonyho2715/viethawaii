const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Mapping old categories to new frontend categories
const categoryMapping = {
  'Restaurant': 'Food & Dining',
  'Market': 'Retail & Shopping',
  'Beauty': 'Beauty & Wellness',
  'Healthcare': 'Health & Medical',
  'Professional': 'Professional Services',
  'Services': 'Other Services',
};

async function updateCategories() {
  try {
    console.log('Starting category update...\n');

    for (const [oldCategory, newCategory] of Object.entries(categoryMapping)) {
      const result = await prisma.business.updateMany({
        where: { category: oldCategory },
        data: { category: newCategory },
      });

      console.log(`✓ Updated ${result.count} businesses from "${oldCategory}" to "${newCategory}"`);
    }

    console.log('\n=== Updated Categories ===\n');

    // Verify the update
    const businesses = await prisma.business.findMany({
      where: { status: 'active' },
      select: {
        name: true,
        category: true,
      },
    });

    const categoryCounts = {};
    businesses.forEach(b => {
      categoryCounts[b.category] = (categoryCounts[b.category] || 0) + 1;
    });

    Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([category, count]) => {
        console.log(`${category}: ${count} businesses`);
      });

    console.log('\n✅ Category update complete!');

  } catch (error) {
    console.error('❌ Error updating categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateCategories();
