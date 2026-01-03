import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Main categories with their subcategories
const categories = [
  {
    slug: 'viec-lam',
    name: 'Việc Làm',
    nameEn: 'Jobs',
    description: 'Tìm việc làm và đăng tin tuyển dụng tại Hawaii',
    descriptionEn: 'Find jobs and post employment opportunities in Hawaii',
    icon: '💼',
    order: 1,
    subcategories: [
      { slug: 'toan-thoi-gian', name: 'Toàn Thời Gian', nameEn: 'Full-time', icon: '🕐', order: 1 },
      { slug: 'ban-thoi-gian', name: 'Bán Thời Gian', nameEn: 'Part-time', icon: '⏰', order: 2 },
      { slug: 'nha-hang-khach-san', name: 'Nhà Hàng & Khách Sạn', nameEn: 'Restaurant & Hospitality', icon: '🍽️', order: 3 },
      { slug: 'lam-nail', name: 'Làm Nail', nameEn: 'Nail Technician', icon: '💅', order: 4 },
      { slug: 'lam-toc', name: 'Làm Tóc', nameEn: 'Hair Stylist', icon: '💇', order: 5 },
      { slug: 'xay-dung', name: 'Xây Dựng', nameEn: 'Construction', icon: '🔨', order: 6 },
      { slug: 'cham-soc-suc-khoe', name: 'Chăm Sóc Sức Khỏe', nameEn: 'Healthcare', icon: '🏥', order: 7 },
      { slug: 'van-phong', name: 'Văn Phòng', nameEn: 'Office', icon: '🖥️', order: 8 },
      { slug: 'ban-le', name: 'Bán Lẻ', nameEn: 'Retail', icon: '🏪', order: 9 },
      { slug: 'giao-hang', name: 'Giao Hàng', nameEn: 'Delivery', icon: '🚗', order: 10 },
      { slug: 'viec-lam-khac', name: 'Việc Làm Khác', nameEn: 'Other Jobs', icon: '📋', order: 99 },
    ],
  },
  {
    slug: 'nha-o',
    name: 'Nhà Ở',
    nameEn: 'Housing',
    description: 'Tìm nhà thuê, mua bán bất động sản, và ở ghép tại Hawaii',
    descriptionEn: 'Find rentals, real estate, and roommates in Hawaii',
    icon: '🏠',
    order: 2,
    subcategories: [
      { slug: 'cho-thue-can-ho', name: 'Cho Thuê Căn Hộ', nameEn: 'Apartments for Rent', icon: '🏢', order: 1 },
      { slug: 'cho-thue-nha', name: 'Cho Thuê Nhà', nameEn: 'Houses for Rent', icon: '🏡', order: 2 },
      { slug: 'cho-thue-phong', name: 'Cho Thuê Phòng', nameEn: 'Rooms for Rent', icon: '🛏️', order: 3 },
      { slug: 'tim-nguoi-o-ghep', name: 'Tìm Người Ở Ghép', nameEn: 'Roommate Wanted', icon: '👥', order: 4 },
      { slug: 'can-thue-nha', name: 'Cần Thuê Nhà', nameEn: 'Housing Wanted', icon: '🔍', order: 5 },
      { slug: 'mua-ban-nha', name: 'Mua Bán Nhà', nameEn: 'Homes for Sale', icon: '🏘️', order: 6 },
      { slug: 'mua-ban-dat', name: 'Mua Bán Đất', nameEn: 'Land for Sale', icon: '🌴', order: 7 },
      { slug: 'thuong-mai', name: 'Bất Động Sản Thương Mại', nameEn: 'Commercial Real Estate', icon: '🏬', order: 8 },
      { slug: 'nha-o-khac', name: 'Nhà Ở Khác', nameEn: 'Other Housing', icon: '📋', order: 99 },
    ],
  },
  {
    slug: 'mua-ban',
    name: 'Mua Bán',
    nameEn: 'For Sale',
    description: 'Mua bán đồ dùng, xe cộ, và các mặt hàng khác',
    descriptionEn: 'Buy and sell items, vehicles, and other goods',
    icon: '🛒',
    order: 3,
    subcategories: [
      { slug: 'xe-hoi', name: 'Xe Hơi', nameEn: 'Cars & Trucks', icon: '🚗', order: 1 },
      { slug: 'xe-may', name: 'Xe Máy', nameEn: 'Motorcycles', icon: '🏍️', order: 2 },
      { slug: 'dien-thoai', name: 'Điện Thoại', nameEn: 'Phones', icon: '📱', order: 3 },
      { slug: 'may-tinh', name: 'Máy Tính', nameEn: 'Computers', icon: '💻', order: 4 },
      { slug: 'dien-tu', name: 'Đồ Điện Tử', nameEn: 'Electronics', icon: '📺', order: 5 },
      { slug: 'noi-that', name: 'Nội Thất', nameEn: 'Furniture', icon: '🛋️', order: 6 },
      { slug: 'do-gia-dung', name: 'Đồ Gia Dụng', nameEn: 'Appliances', icon: '🔌', order: 7 },
      { slug: 'quan-ao', name: 'Quần Áo', nameEn: 'Clothing', icon: '👕', order: 8 },
      { slug: 'do-tre-em', name: 'Đồ Trẻ Em', nameEn: 'Baby & Kids', icon: '👶', order: 9 },
      { slug: 'the-thao', name: 'Thể Thao', nameEn: 'Sports & Outdoors', icon: '⚽', order: 10 },
      { slug: 'nhac-cu', name: 'Nhạc Cụ', nameEn: 'Musical Instruments', icon: '🎸', order: 11 },
      { slug: 'sach-vo', name: 'Sách Vở', nameEn: 'Books', icon: '📚', order: 12 },
      { slug: 'mien-phi', name: 'Cho Miễn Phí', nameEn: 'Free Stuff', icon: '🎁', order: 13 },
      { slug: 'mua-ban-khac', name: 'Mua Bán Khác', nameEn: 'Other Items', icon: '📦', order: 99 },
    ],
  },
  {
    slug: 'dich-vu',
    name: 'Dịch Vụ',
    nameEn: 'Services',
    description: 'Các dịch vụ từ cộng đồng người Việt tại Hawaii',
    descriptionEn: 'Services from the Vietnamese community in Hawaii',
    icon: '🔧',
    order: 4,
    subcategories: [
      { slug: 'lam-dep', name: 'Làm Đẹp', nameEn: 'Beauty Services', icon: '💄', order: 1 },
      { slug: 'sua-chua', name: 'Sửa Chữa', nameEn: 'Repairs', icon: '🔧', order: 2 },
      { slug: 'don-dep', name: 'Dọn Dẹp', nameEn: 'Cleaning', icon: '🧹', order: 3 },
      { slug: 'cham-soc-tre', name: 'Chăm Sóc Trẻ', nameEn: 'Childcare', icon: '👶', order: 4 },
      { slug: 'cham-soc-nguoi-gia', name: 'Chăm Sóc Người Già', nameEn: 'Elderly Care', icon: '👴', order: 5 },
      { slug: 'day-kem', name: 'Dạy Kèm', nameEn: 'Tutoring', icon: '📖', order: 6 },
      { slug: 'phien-dich', name: 'Phiên Dịch', nameEn: 'Translation', icon: '🌐', order: 7 },
      { slug: 'luat-su', name: 'Luật Sư', nameEn: 'Legal Services', icon: '⚖️', order: 8 },
      { slug: 'ke-toan', name: 'Kế Toán & Thuế', nameEn: 'Accounting & Tax', icon: '📊', order: 9 },
      { slug: 'bao-hiem', name: 'Bảo Hiểm', nameEn: 'Insurance', icon: '🛡️', order: 10 },
      { slug: 'bat-dong-san', name: 'Bất Động Sản', nameEn: 'Real Estate Agent', icon: '🏠', order: 11 },
      { slug: 'van-chuyen', name: 'Vận Chuyển', nameEn: 'Moving & Shipping', icon: '📦', order: 12 },
      { slug: 'sua-xe', name: 'Sửa Xe', nameEn: 'Auto Repair', icon: '🚙', order: 13 },
      { slug: 'chup-anh', name: 'Chụp Ảnh & Quay Phim', nameEn: 'Photography & Video', icon: '📷', order: 14 },
      { slug: 'to-chuc-su-kien', name: 'Tổ Chức Sự Kiện', nameEn: 'Event Planning', icon: '🎉', order: 15 },
      { slug: 'dich-vu-khac', name: 'Dịch Vụ Khác', nameEn: 'Other Services', icon: '📋', order: 99 },
    ],
  },
  {
    slug: 'cong-dong',
    name: 'Cộng Đồng',
    nameEn: 'Community',
    description: 'Kết nối với cộng đồng người Việt tại Hawaii',
    descriptionEn: 'Connect with the Vietnamese community in Hawaii',
    icon: '🤝',
    order: 5,
    subcategories: [
      { slug: 'su-kien', name: 'Sự Kiện', nameEn: 'Events', icon: '📅', order: 1 },
      { slug: 'lop-hoc', name: 'Lớp Học', nameEn: 'Classes', icon: '🎓', order: 2 },
      { slug: 'cau-lac-bo', name: 'Câu Lạc Bộ', nameEn: 'Clubs & Groups', icon: '👥', order: 3 },
      { slug: 'tinh-nguyen', name: 'Tình Nguyện', nameEn: 'Volunteers', icon: '🙋', order: 4 },
      { slug: 'tim-ban', name: 'Tìm Bạn', nameEn: 'Seeking Friends', icon: '💬', order: 5 },
      { slug: 'mat-do', name: 'Mất & Tìm Đồ', nameEn: 'Lost & Found', icon: '🔎', order: 6 },
      { slug: 'thu-cung', name: 'Thú Cưng', nameEn: 'Pets', icon: '🐕', order: 7 },
      { slug: 'di-chung-xe', name: 'Đi Chung Xe', nameEn: 'Rideshare', icon: '🚐', order: 8 },
      { slug: 'thong-bao', name: 'Thông Báo', nameEn: 'Announcements', icon: '📢', order: 9 },
      { slug: 'cong-dong-khac', name: 'Cộng Đồng Khác', nameEn: 'Other Community', icon: '📋', order: 99 },
    ],
  },
];

async function seedClassifieds() {
  console.log('🏷️  Starting Classifieds categories seed...\n');

  // Clear existing categories
  console.log('Clearing existing categories...');
  await prisma.classifiedCategory.deleteMany({});

  let totalCategories = 0;
  let totalSubcategories = 0;

  // Create main categories and subcategories
  for (const category of categories) {
    console.log(`\n📁 Creating category: ${category.name} (${category.nameEn})`);

    // Create main category
    const mainCategory = await prisma.classifiedCategory.create({
      data: {
        slug: category.slug,
        name: category.name,
        nameEn: category.nameEn,
        description: category.description,
        descriptionEn: category.descriptionEn,
        icon: category.icon,
        order: category.order,
      },
    });
    totalCategories++;

    // Create subcategories
    for (const sub of category.subcategories) {
      await prisma.classifiedCategory.create({
        data: {
          slug: `${category.slug}-${sub.slug}`,
          name: sub.name,
          nameEn: sub.nameEn,
          icon: sub.icon,
          order: sub.order,
          parentId: mainCategory.id,
        },
      });
      totalSubcategories++;
      console.log(`   ✅ ${sub.name} (${sub.nameEn})`);
    }
  }

  console.log(`\n🎉 Classifieds categories seed complete!`);
  console.log(`   Created ${totalCategories} main categories`);
  console.log(`   Created ${totalSubcategories} subcategories`);
  console.log(`   Total: ${totalCategories + totalSubcategories} categories`);
}

async function main() {
  try {
    await seedClassifieds();
  } catch (error) {
    console.error('Error seeding classifieds:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
