import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // ==================== CATEGORIES ====================
  console.log('Seeding categories...');

  // Main categories
  const categories = [
    { slug: 'nha-o', nameVn: 'Nhà ở', nameEn: 'Housing', icon: 'Home', sortOrder: 1 },
    { slug: 'viec-lam', nameVn: 'Việc làm', nameEn: 'Jobs', icon: 'Briefcase', sortOrder: 2 },
    { slug: 'cho-troi', nameVn: 'Chợ trời', nameEn: 'Marketplace', icon: 'ShoppingBag', sortOrder: 3 },
    { slug: 'xe-co', nameVn: 'Xe cộ', nameEn: 'Vehicles', icon: 'Car', sortOrder: 4 },
    { slug: 'dich-vu', nameVn: 'Dịch vụ', nameEn: 'Services', icon: 'Wrench', sortOrder: 5 },
    { slug: 'cong-dong', nameVn: 'Cộng đồng', nameEn: 'Community', icon: 'Users', sortOrder: 6 },
    { slug: 'am-thuc', nameVn: 'Ẩm thực', nameEn: 'Food & Dining', icon: 'UtensilsCrossed', sortOrder: 7 },
  ];

  const mainCategories: Record<string, number> = {};

  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    mainCategories[cat.slug] = created.id;
  }

  // Subcategories
  const subcategories = [
    // Housing
    { parentSlug: 'nha-o', slug: 'cho-thue-can-ho', nameVn: 'Cho thuê căn hộ', nameEn: 'Apartment Rental', sortOrder: 1 },
    { parentSlug: 'nha-o', slug: 'cho-thue-phong', nameVn: 'Cho thuê phòng', nameEn: 'Room Rental', sortOrder: 2 },
    { parentSlug: 'nha-o', slug: 'tim-nguoi-o-ghep', nameVn: 'Tìm người ở ghép', nameEn: 'Roommate Wanted', sortOrder: 3 },
    { parentSlug: 'nha-o', slug: 'nha-ban', nameVn: 'Nhà bán', nameEn: 'House for Sale', sortOrder: 4 },
    { parentSlug: 'nha-o', slug: 'van-phong-thuong-mai', nameVn: 'Văn phòng/Thương mại', nameEn: 'Office/Commercial', sortOrder: 5 },

    // Jobs
    { parentSlug: 'viec-lam', slug: 'toan-thoi-gian', nameVn: 'Toàn thời gian', nameEn: 'Full-time', sortOrder: 1 },
    { parentSlug: 'viec-lam', slug: 'ban-thoi-gian', nameVn: 'Bán thời gian', nameEn: 'Part-time', sortOrder: 2 },
    { parentSlug: 'viec-lam', slug: 'nha-hang-khach-san', nameVn: 'Nhà hàng/Khách sạn', nameEn: 'Restaurant/Hotel', sortOrder: 3 },
    { parentSlug: 'viec-lam', slug: 'lam-nail-spa', nameVn: 'Làm nail/Spa', nameEn: 'Nail/Spa', sortOrder: 4 },
    { parentSlug: 'viec-lam', slug: 'xay-dung-lao-dong', nameVn: 'Xây dựng/Lao động', nameEn: 'Construction/Labor', sortOrder: 5 },
    { parentSlug: 'viec-lam', slug: 'van-phong', nameVn: 'Văn phòng', nameEn: 'Office', sortOrder: 6 },
    { parentSlug: 'viec-lam', slug: 'viec-lam-tu-do', nameVn: 'Việc làm tự do', nameEn: 'Freelance', sortOrder: 7 },

    // Marketplace
    { parentSlug: 'cho-troi', slug: 'do-dien-tu', nameVn: 'Đồ điện tử', nameEn: 'Electronics', sortOrder: 1 },
    { parentSlug: 'cho-troi', slug: 'noi-that', nameVn: 'Nội thất', nameEn: 'Furniture', sortOrder: 2 },
    { parentSlug: 'cho-troi', slug: 'quan-ao-phu-kien', nameVn: 'Quần áo/Phụ kiện', nameEn: 'Clothing/Accessories', sortOrder: 3 },
    { parentSlug: 'cho-troi', slug: 'do-tre-em', nameVn: 'Đồ trẻ em', nameEn: 'Kids Items', sortOrder: 4 },
    { parentSlug: 'cho-troi', slug: 'do-gia-dung', nameVn: 'Đồ gia dụng', nameEn: 'Household Items', sortOrder: 5 },
    { parentSlug: 'cho-troi', slug: 'mien-phi', nameVn: 'Miễn phí', nameEn: 'Free Items', sortOrder: 6 },
    { parentSlug: 'cho-troi', slug: 'can-mua', nameVn: 'Cần mua', nameEn: 'Wanted', sortOrder: 7 },

    // Vehicles
    { parentSlug: 'xe-co', slug: 'xe-hoi', nameVn: 'Xe hơi', nameEn: 'Cars', sortOrder: 1 },
    { parentSlug: 'xe-co', slug: 'xe-tai-suv', nameVn: 'Xe tải/SUV', nameEn: 'Trucks/SUVs', sortOrder: 2 },
    { parentSlug: 'xe-co', slug: 'xe-may', nameVn: 'Xe máy', nameEn: 'Motorcycles', sortOrder: 3 },
    { parentSlug: 'xe-co', slug: 'phu-tung-xe', nameVn: 'Phụ tùng xe', nameEn: 'Auto Parts', sortOrder: 4 },

    // Services
    { parentSlug: 'dich-vu', slug: 'sua-chua-nha', nameVn: 'Sửa chữa nhà', nameEn: 'Home Repair', sortOrder: 1 },
    { parentSlug: 'dich-vu', slug: 'don-dep-nha', nameVn: 'Dọn dẹp nhà', nameEn: 'House Cleaning', sortOrder: 2 },
    { parentSlug: 'dich-vu', slug: 'cham-soc-tre', nameVn: 'Chăm sóc trẻ', nameEn: 'Childcare', sortOrder: 3 },
    { parentSlug: 'dich-vu', slug: 'day-kem', nameVn: 'Dạy kèm', nameEn: 'Tutoring', sortOrder: 4 },
    { parentSlug: 'dich-vu', slug: 'lam-dep', nameVn: 'Làm đẹp', nameEn: 'Beauty', sortOrder: 5 },
    { parentSlug: 'dich-vu', slug: 'chup-anh-quay-phim', nameVn: 'Chụp ảnh/Quay phim', nameEn: 'Photography/Videography', sortOrder: 6 },
    { parentSlug: 'dich-vu', slug: 'dich-thuat', nameVn: 'Dịch thuật', nameEn: 'Translation', sortOrder: 7 },
    { parentSlug: 'dich-vu', slug: 'ke-toan-thue', nameVn: 'Kế toán/Thuế', nameEn: 'Accounting/Tax', sortOrder: 8 },
    { parentSlug: 'dich-vu', slug: 'luat-su-di-tru', nameVn: 'Luật sư/Di trú', nameEn: 'Legal/Immigration', sortOrder: 9 },
    { parentSlug: 'dich-vu', slug: 'suc-khoe-wellness', nameVn: 'Sức khỏe/Wellness', nameEn: 'Health/Wellness', sortOrder: 10 },

    // Community
    { parentSlug: 'cong-dong', slug: 'su-kien', nameVn: 'Sự kiện', nameEn: 'Events', sortOrder: 1 },
    { parentSlug: 'cong-dong', slug: 'lop-hoc-workshop', nameVn: 'Lớp học/Workshop', nameEn: 'Classes/Workshops', sortOrder: 2 },
    { parentSlug: 'cong-dong', slug: 'tinh-nguyen', nameVn: 'Tình nguyện', nameEn: 'Volunteer', sortOrder: 3 },
    { parentSlug: 'cong-dong', slug: 'mat-tim-thay', nameVn: 'Mất/Tìm thấy', nameEn: 'Lost & Found', sortOrder: 4 },
    { parentSlug: 'cong-dong', slug: 'nhom-cau-lac-bo', nameVn: 'Nhóm/Câu lạc bộ', nameEn: 'Groups/Clubs', sortOrder: 5 },
    { parentSlug: 'cong-dong', slug: 'thong-bao', nameVn: 'Thông báo', nameEn: 'Announcements', sortOrder: 6 },

    // Food
    { parentSlug: 'am-thuc', slug: 'do-an-nha-lam', nameVn: 'Đồ ăn nhà làm', nameEn: 'Homemade Food', sortOrder: 1 },
    { parentSlug: 'am-thuc', slug: 'catering-tiec', nameVn: 'Catering/Tiệc', nameEn: 'Catering/Parties', sortOrder: 2 },
    { parentSlug: 'am-thuc', slug: 'thuc-pham-viet-nam', nameVn: 'Thực phẩm Việt Nam', nameEn: 'Vietnamese Groceries', sortOrder: 3 },
  ];

  for (const sub of subcategories) {
    const parentId = mainCategories[sub.parentSlug];
    await prisma.category.upsert({
      where: { slug: sub.slug },
      update: {
        nameVn: sub.nameVn,
        nameEn: sub.nameEn,
        sortOrder: sub.sortOrder,
        parentId,
      },
      create: {
        slug: sub.slug,
        nameVn: sub.nameVn,
        nameEn: sub.nameEn,
        sortOrder: sub.sortOrder,
        parentId,
      },
    });
  }

  console.log('Categories seeded successfully!');

  // ==================== NEIGHBORHOODS ====================
  console.log('Seeding neighborhoods...');

  const neighborhoods = [
    // Honolulu Metro
    { slug: 'downtown-chinatown', name: 'Downtown/Chinatown', region: 'Honolulu Metro', vietnameseCommunity: 'High', avgRent1br: 1800, avgRent2br: 2400 },
    { slug: 'kalihi', name: 'Kalihi', region: 'Honolulu Metro', vietnameseCommunity: 'Very High', avgRent1br: 1500, avgRent2br: 2000, descriptionVn: 'Khu vực có đông cộng đồng người Việt nhất tại Hawaii' },
    { slug: 'makiki', name: 'Makiki', region: 'Honolulu Metro', vietnameseCommunity: 'Medium', avgRent1br: 1700, avgRent2br: 2200 },
    { slug: 'kakaako', name: 'Kakaako', region: 'Honolulu Metro', vietnameseCommunity: 'Low', avgRent1br: 2200, avgRent2br: 3000 },
    { slug: 'ala-moana', name: 'Ala Moana', region: 'Honolulu Metro', vietnameseCommunity: 'Medium', avgRent1br: 2000, avgRent2br: 2800 },
    { slug: 'waikiki', name: 'Waikiki', region: 'Honolulu Metro', vietnameseCommunity: 'Low', avgRent1br: 1900, avgRent2br: 2600 },
    { slug: 'moiliili', name: 'Moiliili', region: 'Honolulu Metro', vietnameseCommunity: 'Medium', avgRent1br: 1600, avgRent2br: 2100 },
    { slug: 'kapahulu', name: 'Kapahulu', region: 'Honolulu Metro', vietnameseCommunity: 'Low', avgRent1br: 1700, avgRent2br: 2300 },

    // East Honolulu
    { slug: 'kaimuki', name: 'Kaimuki', region: 'East Honolulu', vietnameseCommunity: 'Low', avgRent1br: 1800, avgRent2br: 2400 },
    { slug: 'kahala', name: 'Kahala', region: 'East Honolulu', vietnameseCommunity: 'Low', avgRent1br: 2500, avgRent2br: 3500 },
    { slug: 'hawaii-kai', name: 'Hawaii Kai', region: 'East Honolulu', vietnameseCommunity: 'Low', avgRent1br: 2000, avgRent2br: 2700 },

    // Central Oahu
    { slug: 'pearl-city', name: 'Pearl City', region: 'Central Oahu', vietnameseCommunity: 'High', avgRent1br: 1600, avgRent2br: 2100 },
    { slug: 'aiea', name: 'Aiea', region: 'Central Oahu', vietnameseCommunity: 'High', avgRent1br: 1650, avgRent2br: 2150 },
    { slug: 'mililani', name: 'Mililani', region: 'Central Oahu', vietnameseCommunity: 'Medium', avgRent1br: 1800, avgRent2br: 2400 },
    { slug: 'wahiawa', name: 'Wahiawa', region: 'Central Oahu', vietnameseCommunity: 'Medium', avgRent1br: 1400, avgRent2br: 1900 },

    // West Oahu
    { slug: 'kapolei', name: 'Kapolei', region: 'West Oahu', vietnameseCommunity: 'Medium', avgRent1br: 1900, avgRent2br: 2500 },
    { slug: 'ewa-beach', name: 'Ewa Beach', region: 'West Oahu', vietnameseCommunity: 'Medium', avgRent1br: 1850, avgRent2br: 2450 },
    { slug: 'waipahu', name: 'Waipahu', region: 'West Oahu', vietnameseCommunity: 'High', avgRent1br: 1500, avgRent2br: 2000 },

    // North Shore
    { slug: 'haleiwa', name: 'Haleiwa', region: 'North Shore', vietnameseCommunity: 'Low', avgRent1br: 1700, avgRent2br: 2300 },
    { slug: 'waialua', name: 'Waialua', region: 'North Shore', vietnameseCommunity: 'Low', avgRent1br: 1600, avgRent2br: 2100 },

    // Windward
    { slug: 'kaneohe', name: 'Kaneohe', region: 'Windward', vietnameseCommunity: 'Medium', avgRent1br: 1700, avgRent2br: 2200 },
    { slug: 'kailua', name: 'Kailua', region: 'Windward', vietnameseCommunity: 'Low', avgRent1br: 2000, avgRent2br: 2700 },
  ];

  for (const hood of neighborhoods) {
    await prisma.neighborhood.upsert({
      where: { slug: hood.slug },
      update: hood,
      create: hood,
    });
  }

  console.log('Neighborhoods seeded successfully!');

  // ==================== CONTENT CATEGORIES ====================
  console.log('Seeding content categories...');

  const contentCategories = [
    { slug: 'tin-tuc', nameVn: 'Tin tức', nameEn: 'News', type: 'NEWS' as const, color: '#EF4444', sortOrder: 1 },
    { slug: 'huong-dan', nameVn: 'Hướng dẫn', nameEn: 'Guides', type: 'GUIDE' as const, color: '#10B981', sortOrder: 2 },
    { slug: 'vlog', nameVn: 'Vlog', nameEn: 'Vlog', type: 'VLOG' as const, color: '#8B5CF6', sortOrder: 3 },
    { slug: 'cong-dong', nameVn: 'Cộng đồng', nameEn: 'Community', type: 'BLOG' as const, color: '#F59E0B', sortOrder: 4 },
    { slug: 'am-thuc', nameVn: 'Ẩm thực', nameEn: 'Food', type: 'BLOG' as const, color: '#EC4899', sortOrder: 5 },
    { slug: 'du-lich', nameVn: 'Du lịch', nameEn: 'Travel', type: 'BLOG' as const, color: '#06B6D4', sortOrder: 6 },
  ];

  for (const cat of contentCategories) {
    await prisma.contentCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  console.log('Content categories seeded successfully!');

  // ==================== FEATURED PACKAGES ====================
  console.log('Seeding featured packages...');

  const packages = [
    { nameVn: 'Đẩy tin', nameEn: 'Boost', durationDays: 7, price: 5.00, sortOrder: 1, benefits: { highlight: true } },
    { nameVn: 'Tin nổi bật', nameEn: 'Featured', durationDays: 7, price: 15.00, sortOrder: 2, benefits: { highlight: true, featured: true } },
    { nameVn: 'Tin VIP', nameEn: 'Spotlight', durationDays: 7, price: 30.00, sortOrder: 3, benefits: { highlight: true, featured: true, spotlight: true } },
  ];

  for (const pkg of packages) {
    await prisma.featuredPackage.upsert({
      where: { id: pkg.sortOrder },
      update: pkg,
      create: pkg,
    });
  }

  console.log('Featured packages seeded successfully!');

  // ==================== SITE SETTINGS ====================
  console.log('Seeding site settings...');

  const settings = [
    { key: 'site_name', value: 'VietHawaii' },
    { key: 'listing_expiry_days', value: 30 },
    { key: 'free_listing_limit', value: 5 },
    { key: 'require_approval', value: true },
    { key: 'contact_email', value: 'contact@viethawaii.com' },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: { key: setting.key, value: setting.value },
    });
  }

  console.log('Site settings seeded successfully!');

  // ==================== ADMIN USER ====================
  console.log('Creating admin user...');

  const adminPassword = await bcrypt.hash('admin123', 12);

  await prisma.user.upsert({
    where: { email: 'admin@viethawaii.com' },
    update: {},
    create: {
      email: 'admin@viethawaii.com',
      name: 'Admin',
      passwordHash: adminPassword,
      role: 'SUPERADMIN',
      preferredLang: 'vn',
      emailVerified: new Date(),
    },
  });

  console.log('Admin user created: admin@viethawaii.com / admin123');

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
