import { PrismaClient, BusinessTier } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding businesses...');

  // Use existing user
  const userId = 'c340a89a-fc6f-4b64-993b-732545a12f0c';

  const businesses = [
    {
      name: 'Phở Huỳnh',
      slug: 'pho-huynh',
      category: 'Ẩm thực',
      descriptionVn: 'Phở bò truyền thống nổi tiếng nhất Honolulu.',
      address: '1234 River St, Honolulu, HI 96817',
      phone: '(808) 555-0101',
      isVerified: true,
      tier: BusinessTier.PREMIUM,
    },
    {
      name: 'Tiệm Vàng Kim Nguyên',
      slug: 'tiem-vang-kim-nguyen',
      category: 'Mua sắm',
      descriptionVn: 'Chuyên mua bán vàng bạc, trang sức và đổi ngoại tệ.',
      address: '100 N Beretania St, Honolulu, HI 96817',
      phone: '(808) 555-0102',
      isVerified: true,
      tier: BusinessTier.ENHANCED,
    },
    {
      name: 'Nails & Spa Aloha',
      slug: 'nails-spa-aloha',
      category: 'Dịch vụ',
      descriptionVn: 'Dịch vụ làm móng chuyên nghiệp cho người Việt.',
      address: '1450 Ala Moana Blvd, Honolulu, HI 96814',
      phone: '(808) 555-0103',
      isVerified: true,
      tier: BusinessTier.FREE,
    },
    {
      name: 'Viet-Hawaii Travel',
      slug: 'viet-hawaii-travel',
      category: 'Du lịch',
      descriptionVn: 'Đại lý vé máy bay và tour du lịch Việt Nam - Hawaii.',
      address: '98-1005 Moanalua Rd, Aiea, HI 96701',
      phone: '(808) 555-0104',
      isVerified: true,
      tier: BusinessTier.PREMIUM,
    },
  ];

  for (const b of businesses) {
    await prisma.business.upsert({
      where: { slug: b.slug },
      update: {},
      create: {
        ...b,
        ownerId: userId,
      },
    });
  }

  console.log('Business seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
