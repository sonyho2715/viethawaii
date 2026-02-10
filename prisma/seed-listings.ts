import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding realistic listings...');

  // ==================== SEED USERS ====================
  console.log('Creating seed users...');

  const passwordHash = await bcrypt.hash('SeedUser123!', 12);

  const seedUsers = [
    { email: 'trang.nguyen@viethawaii.seed', name: 'Trang Nguyễn', phone: '808-555-0101' },
    { email: 'minh.le@viethawaii.seed', name: 'Minh Lê', phone: '808-555-0102' },
    { email: 'huong.pham@viethawaii.seed', name: 'Hương Phạm', phone: '808-555-0103' },
    { email: 'duc.tran@viethawaii.seed', name: 'Đức Trần', phone: '808-555-0104' },
    { email: 'lan.vo@viethawaii.seed', name: 'Lan Võ', phone: '808-555-0105' },
    { email: 'hung.dao@viethawaii.seed', name: 'Hùng Đào', phone: '808-555-0106' },
    { email: 'mai.bui@viethawaii.seed', name: 'Mai Bùi', phone: '808-555-0107' },
    { email: 'thanh.ho@viethawaii.seed', name: 'Thanh Hồ', phone: '808-555-0108' },
  ];

  const users: Record<string, string> = {};

  for (const u of seedUsers) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        name: u.name,
        phone: u.phone,
        passwordHash,
        role: 'SELLER',
        preferredLang: 'vn',
        emailVerified: new Date(),
        trustScore: 5,
      },
    });
    users[u.email] = user.id;
  }

  console.log(`Created ${Object.keys(users).length} seed users`);

  // ==================== FETCH CATEGORIES & NEIGHBORHOODS ====================
  const allCategories = await prisma.category.findMany();
  const catMap: Record<string, number> = {};
  for (const c of allCategories) {
    catMap[c.slug] = c.id;
  }

  const allNeighborhoods = await prisma.neighborhood.findMany();
  const hoodMap: Record<string, number> = {};
  for (const n of allNeighborhoods) {
    hoodMap[n.slug] = n.id;
  }

  // ==================== HOUSING LISTINGS ====================
  console.log('Seeding housing listings...');

  const housingListings = [
    {
      title: 'Cho thuê phòng sạch sẽ gần Kalihi, tiện bus',
      titleEn: 'Clean room for rent near Kalihi, bus accessible',
      description: 'Phòng sạch sẽ, thoáng mát, gần trạm bus #2 và #13. Bao gồm wifi, nước, điện. Chia sẻ bếp và phòng tắm. Phù hợp cho sinh viên hoặc người đi làm. Khu vực an toàn, đông người Việt. Không hút thuốc, không thú cưng.',
      price: 950,
      priceType: 'MONTHLY' as const,
      categorySlug: 'cho-thue-phong',
      neighborhoodSlug: 'kalihi',
      contactPhone: '808-555-0101',
      contactEmail: 'trang.nguyen@viethawaii.seed',
      userEmail: 'trang.nguyen@viethawaii.seed',
      listingType: 'HOUSING' as const,
      bedrooms: 1,
      bathrooms: 1,
      utilities: 'Bao gồm wifi, nước, điện',
    },
    {
      title: 'Căn hộ 2 phòng ngủ Waipahu, gần chợ Việt',
      titleEn: '2BR apartment in Waipahu, near Vietnamese grocery',
      description: 'Căn hộ 2 phòng ngủ, 1 phòng tắm tại Waipahu. Gần chợ Việt Nam Hale Vietnam và tiệm phở. Có bãi đậu xe miễn phí, máy giặt chung. Hợp đồng 1 năm. Deposit 1 tháng. Có thể dọn vào ngay.',
      price: 1850,
      priceType: 'MONTHLY' as const,
      categorySlug: 'cho-thue-can-ho',
      neighborhoodSlug: 'waipahu',
      contactPhone: '808-555-0102',
      userEmail: 'minh.le@viethawaii.seed',
      listingType: 'HOUSING' as const,
      bedrooms: 2,
      bathrooms: 1,
      sqft: 750,
      utilities: 'Nước bao gồm, điện tự trả',
    },
    {
      title: 'Tìm người ở ghép Pearl City, $700/tháng',
      titleEn: 'Roommate wanted in Pearl City, $700/month',
      description: 'Cần tìm 1 bạn nữ ở ghép tại căn hộ 2 phòng ngủ ở Pearl City. Phòng riêng, chia sẻ phòng tắm và bếp. Bao gồm wifi và nước. Gần Pearl Highlands Center, tiện mua sắm. Ưu tiên người Việt, không hút thuốc.',
      price: 700,
      priceType: 'MONTHLY' as const,
      categorySlug: 'tim-nguoi-o-ghep',
      neighborhoodSlug: 'pearl-city',
      contactPhone: '808-555-0103',
      userEmail: 'huong.pham@viethawaii.seed',
      listingType: 'HOUSING' as const,
      bedrooms: 1,
      bathrooms: 1,
      petFriendly: false,
    },
    {
      title: 'Studio Makiki, yên tĩnh, view đẹp',
      titleEn: 'Quiet studio in Makiki with nice view',
      description: 'Studio rộng rãi tại Makiki, tầng 8, view núi đẹp. Có A/C, bếp nhỏ, phòng tắm riêng. Gần UH Manoa, tiện cho sinh viên. Bãi đậu xe $75/tháng. Có thể dọn vào 1/3.',
      price: 1400,
      priceType: 'MONTHLY' as const,
      categorySlug: 'cho-thue-can-ho',
      neighborhoodSlug: 'makiki',
      contactPhone: '808-555-0104',
      userEmail: 'duc.tran@viethawaii.seed',
      listingType: 'HOUSING' as const,
      bedrooms: 0,
      bathrooms: 1,
      sqft: 400,
    },
  ];

  for (const listing of housingListings) {
    const categoryId = catMap[listing.categorySlug];
    const neighborhoodId = hoodMap[listing.neighborhoodSlug];
    const userId = users[listing.userEmail];
    if (!categoryId || !userId) continue;

    await prisma.listing.create({
      data: {
        userId,
        categoryId,
        neighborhoodId,
        title: listing.title,
        titleEn: listing.titleEn,
        description: listing.description,
        price: listing.price,
        priceType: listing.priceType,
        contactPhone: listing.contactPhone,
        contactEmail: listing.contactEmail,
        listingType: listing.listingType,
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms,
        sqft: listing.sqft,
        petFriendly: listing.petFriendly,
        utilities: listing.utilities,
        status: 'ACTIVE',
        approvedAt: new Date(),
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        views: Math.floor(Math.random() * 80) + 10,
      },
    });
  }

  console.log(`Seeded ${housingListings.length} housing listings`);

  // ==================== JOB LISTINGS ====================
  console.log('Seeding job listings...');

  const jobListings = [
    {
      title: 'Tuyển phụ bếp nhà hàng Phở, Kalihi',
      titleEn: 'Kitchen helper needed at Pho restaurant, Kalihi',
      description: 'Nhà hàng phở Kalihi cần tuyển phụ bếp. Kinh nghiệm nấu món Việt ưu tiên. Giờ làm: 10am-8pm, 5 ngày/tuần. Lương theo kinh nghiệm. Bao cơm trưa và tối. Liên hệ anh Minh.',
      price: 18,
      priceType: 'HOURLY' as const,
      categorySlug: 'nha-hang-khach-san',
      neighborhoodSlug: 'kalihi',
      contactPhone: '808-555-0102',
      userEmail: 'minh.le@viethawaii.seed',
      listingType: 'JOB' as const,
      jobType: 'full-time',
      salary: '$18-22/giờ tùy kinh nghiệm',
      benefits: 'Bao cơm, tips chia đều, nghỉ 2 ngày/tuần',
    },
    {
      title: 'Cần thợ nail kinh nghiệm, lương cao',
      titleEn: 'Experienced nail tech wanted, high pay',
      description: 'Tiệm nail mới mở ở Ala Moana area cần tuyển thợ nail có kinh nghiệm. Yêu cầu có license Hawaii. Tiệm đông khách, đặt lịch liên tục. Commission 60/40. Tip riêng. Cần biết làm gel, dip, acrylic.',
      price: null,
      priceType: 'NEGOTIABLE' as const,
      categorySlug: 'lam-nail-spa',
      neighborhoodSlug: 'ala-moana',
      contactPhone: '808-555-0105',
      userEmail: 'lan.vo@viethawaii.seed',
      listingType: 'JOB' as const,
      jobType: 'full-time',
      salary: 'Commission 60/40 + tips ($800-1500/tuần)',
      benefits: 'Tip riêng, bảo hiểm sau 3 tháng, nghỉ chủ nhật',
    },
    {
      title: 'Tuyển nhân viên bán hàng, tiệm bánh mì Việt',
      titleEn: 'Sales associate at Vietnamese bakery',
      description: 'Tiệm bánh mì Việt Nam ở Chinatown cần tuyển nhân viên bán hàng part-time. Giờ linh hoạt, phù hợp sinh viên. Cần nói được tiếng Việt và tiếng Anh. Vui vẻ, chăm chỉ. Bao sandwich mỗi ca.',
      price: 16,
      priceType: 'HOURLY' as const,
      categorySlug: 'ban-thoi-gian',
      neighborhoodSlug: 'downtown-chinatown',
      contactPhone: '808-555-0107',
      userEmail: 'mai.bui@viethawaii.seed',
      listingType: 'JOB' as const,
      jobType: 'part-time',
      salary: '$16/giờ',
      benefits: 'Bao cơm, giờ linh hoạt',
    },
    {
      title: 'Tuyển thợ xây dựng, có xe đưa đón',
      titleEn: 'Construction workers wanted, transportation provided',
      description: 'Công ty xây dựng cần tuyển thợ xây dựng cho dự án mới ở Kapolei. Kinh nghiệm xây dựng ưu tiên, sẵn sàng đào tạo. Có xe đưa đón từ Kalihi. OT available. Cần có giấy phép lao động hợp lệ.',
      price: 25,
      priceType: 'HOURLY' as const,
      categorySlug: 'xay-dung-lao-dong',
      neighborhoodSlug: 'kapolei',
      contactPhone: '808-555-0106',
      userEmail: 'hung.dao@viethawaii.seed',
      listingType: 'JOB' as const,
      jobType: 'full-time',
      salary: '$25-35/giờ + OT',
      benefits: 'Xe đưa đón, bảo hiểm, OT 1.5x',
    },
    {
      title: 'Cần người giữ trẻ, Mililani, nói tiếng Việt',
      titleEn: 'Vietnamese-speaking babysitter needed in Mililani',
      description: 'Gia đình cần tìm người giữ 2 bé (3 tuổi và 5 tuổi) tại nhà ở Mililani. Thứ 2-6, 8am-5pm. Cần nói tiếng Việt để dạy bé tiếng Việt. Yêu thương trẻ em, có kinh nghiệm. Lương thỏa thuận.',
      price: 20,
      priceType: 'HOURLY' as const,
      categorySlug: 'toan-thoi-gian',
      neighborhoodSlug: 'mililani',
      contactPhone: '808-555-0103',
      userEmail: 'huong.pham@viethawaii.seed',
      listingType: 'JOB' as const,
      jobType: 'full-time',
      salary: '$20/giờ',
      benefits: 'Bao cơm trưa, ngày lễ nghỉ có lương',
    },
  ];

  for (const listing of jobListings) {
    const categoryId = catMap[listing.categorySlug];
    const neighborhoodId = hoodMap[listing.neighborhoodSlug];
    const userId = users[listing.userEmail];
    if (!categoryId || !userId) continue;

    await prisma.listing.create({
      data: {
        userId,
        categoryId,
        neighborhoodId,
        title: listing.title,
        titleEn: listing.titleEn,
        description: listing.description,
        price: listing.price,
        priceType: listing.priceType,
        contactPhone: listing.contactPhone,
        listingType: listing.listingType,
        jobType: listing.jobType,
        salary: listing.salary,
        benefits: listing.benefits,
        status: 'ACTIVE',
        approvedAt: new Date(),
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        views: Math.floor(Math.random() * 120) + 20,
      },
    });
  }

  console.log(`Seeded ${jobListings.length} job listings`);

  // ==================== MARKETPLACE LISTINGS ====================
  console.log('Seeding marketplace listings...');

  const marketListings = [
    {
      title: 'Bán sofa L-shape, còn tốt, dọn nhà',
      titleEn: 'L-shape sofa for sale, moving out',
      description: 'Bán sofa L-shape màu xám, mua từ Ashley Furniture 1 năm trước. Còn rất tốt, không rách, không bẩn. Dọn nhà nên bán gấp. Giá thương lượng. Tự đến lấy tại Aiea. Có thể giao nếu ở gần.',
      price: 350,
      priceType: 'NEGOTIABLE' as const,
      categorySlug: 'noi-that',
      neighborhoodSlug: 'aiea',
      contactPhone: '808-555-0108',
      userEmail: 'thanh.ho@viethawaii.seed',
    },
    {
      title: 'iPhone 15 Pro Max 256GB, như mới',
      titleEn: 'iPhone 15 Pro Max 256GB, like new',
      description: 'Bán iPhone 15 Pro Max 256GB màu Natural Titanium. Mua 6 tháng trước, còn bảo hành Apple. Đầy đủ hộp, sạc, ốp lưng. Pin 98%. Không trầy xước. Lý do bán: đổi sang Samsung.',
      price: 900,
      priceType: 'FIXED' as const,
      categorySlug: 'do-dien-tu',
      neighborhoodSlug: 'pearl-city',
      contactPhone: '808-555-0104',
      userEmail: 'duc.tran@viethawaii.seed',
    },
    {
      title: 'Nồi cơm điện Zojirushi NP-NWC10, hàng Nhật',
      titleEn: 'Zojirushi rice cooker NP-NWC10, Japanese import',
      description: 'Nồi cơm điện Zojirushi 5.5 cup, hàng Nhật xách tay. Nấu cơm ngon hơn hàng Mỹ. Còn rất tốt, sử dụng 8 tháng. Có hướng dẫn tiếng Anh. Lý do bán: được tặng nồi mới.',
      price: 180,
      priceType: 'FIXED' as const,
      categorySlug: 'do-gia-dung',
      neighborhoodSlug: 'kalihi',
      contactPhone: '808-555-0101',
      userEmail: 'trang.nguyen@viethawaii.seed',
    },
    {
      title: 'Quần áo trẻ em size 3T-5T, lot lớn',
      titleEn: 'Kids clothes 3T-5T, big lot',
      description: 'Bán lot quần áo trẻ em trai size 3T đến 5T. Khoảng 30 bộ, có cả áo khoác và quần dài. Hàng hiệu Carter, Gap, Nike. Còn tốt, một số còn mới tag. Bán cả lot, không bán lẻ.',
      price: 60,
      priceType: 'FIXED' as const,
      categorySlug: 'do-tre-em',
      neighborhoodSlug: 'ewa-beach',
      contactPhone: '808-555-0103',
      userEmail: 'huong.pham@viethawaii.seed',
    },
    {
      title: 'MIỄN PHÍ: Kệ sách gỗ 5 tầng',
      titleEn: 'FREE: 5-tier wooden bookshelf',
      description: 'Cho miễn phí kệ sách gỗ 5 tầng, cao 6 feet. Còn chắc chắn, hơi cũ. Tự đến lấy tại Moiliili. Phải lấy trước cuối tuần này. First come first served.',
      price: 0,
      priceType: 'FREE' as const,
      categorySlug: 'mien-phi',
      neighborhoodSlug: 'moiliili',
      contactPhone: '808-555-0108',
      userEmail: 'thanh.ho@viethawaii.seed',
    },
    {
      title: 'Cần mua xe đạp trẻ em 20 inch',
      titleEn: 'Looking for kids bicycle 20 inch',
      description: 'Cần mua xe đạp trẻ em 20 inch cho bé gái 7 tuổi. Cũ cũng được, miễn là còn tốt và an toàn. Budget khoảng $50-80. Ở vùng Pearl City/Aiea, có thể đến lấy.',
      price: 80,
      priceType: 'NEGOTIABLE' as const,
      categorySlug: 'can-mua',
      neighborhoodSlug: 'pearl-city',
      contactPhone: '808-555-0105',
      userEmail: 'lan.vo@viethawaii.seed',
    },
  ];

  for (const listing of marketListings) {
    const categoryId = catMap[listing.categorySlug];
    const neighborhoodId = hoodMap[listing.neighborhoodSlug];
    const userId = users[listing.userEmail];
    if (!categoryId || !userId) continue;

    await prisma.listing.create({
      data: {
        userId,
        categoryId,
        neighborhoodId,
        title: listing.title,
        titleEn: listing.titleEn,
        description: listing.description,
        price: listing.price,
        priceType: listing.priceType,
        contactPhone: listing.contactPhone,
        listingType: 'GENERAL',
        status: 'ACTIVE',
        approvedAt: new Date(),
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        views: Math.floor(Math.random() * 60) + 5,
      },
    });
  }

  console.log(`Seeded ${marketListings.length} marketplace listings`);

  // ==================== VEHICLE LISTINGS ====================
  console.log('Seeding vehicle listings...');

  const vehicleListings = [
    {
      title: 'Bán Toyota Camry 2019, xe gia đình, ít đi',
      titleEn: '2019 Toyota Camry, family car, low mileage',
      description: 'Bán Toyota Camry 2019 LE, màu trắng. 45,000 miles. Một chủ, bảo dưỡng đều đặn tại Toyota dealership. A/C lạnh, không va chạm, title clean. Lý do bán: mua xe mới. Giá firm.',
      price: 22500,
      priceType: 'FIXED' as const,
      categorySlug: 'xe-hoi',
      neighborhoodSlug: 'kapolei',
      contactPhone: '808-555-0106',
      userEmail: 'hung.dao@viethawaii.seed',
    },
    {
      title: 'Honda Civic 2017, tiết kiệm xăng',
      titleEn: '2017 Honda Civic, fuel efficient',
      description: 'Honda Civic 2017 EX, màu xanh đậm, 68,000 miles. Tiết kiệm xăng (35+ mpg). Có sunroof, camera lùi, Apple CarPlay. Safety inspection mới qua. Đăng kiểm còn đến 12/2026. Giá thương lượng.',
      price: 17800,
      priceType: 'NEGOTIABLE' as const,
      categorySlug: 'xe-hoi',
      neighborhoodSlug: 'aiea',
      contactPhone: '808-555-0104',
      userEmail: 'duc.tran@viethawaii.seed',
    },
    {
      title: 'Bán lốp xe all-season 225/65R17, 4 cái',
      titleEn: '4 all-season tires 225/65R17',
      description: 'Bán 4 lốp xe Michelin Defender all-season, size 225/65R17. Còn khoảng 60% gai. Phù hợp cho RAV4, CRV, và nhiều SUV khác. Lý do bán: đổi size xe mới. Giá cho cả 4 cái.',
      price: 200,
      priceType: 'FIXED' as const,
      categorySlug: 'phu-tung-xe',
      neighborhoodSlug: 'waipahu',
      contactPhone: '808-555-0102',
      userEmail: 'minh.le@viethawaii.seed',
    },
  ];

  for (const listing of vehicleListings) {
    const categoryId = catMap[listing.categorySlug];
    const neighborhoodId = hoodMap[listing.neighborhoodSlug];
    const userId = users[listing.userEmail];
    if (!categoryId || !userId) continue;

    await prisma.listing.create({
      data: {
        userId,
        categoryId,
        neighborhoodId,
        title: listing.title,
        titleEn: listing.titleEn,
        description: listing.description,
        price: listing.price,
        priceType: listing.priceType,
        contactPhone: listing.contactPhone,
        listingType: 'GENERAL',
        status: 'ACTIVE',
        approvedAt: new Date(),
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        views: Math.floor(Math.random() * 100) + 15,
      },
    });
  }

  console.log(`Seeded ${vehicleListings.length} vehicle listings`);

  // ==================== SERVICE LISTINGS ====================
  console.log('Seeding service listings...');

  const serviceListings = [
    {
      title: 'Dịch vụ dọn dẹp nhà, giá phải chăng',
      titleEn: 'House cleaning service, affordable rates',
      description: 'Nhận dọn dẹp nhà, căn hộ, condo. Kinh nghiệm 5 năm tại Hawaii. Sử dụng sản phẩm tẩy rửa an toàn. Giá bắt đầu từ $120 cho studio/1BR. Có thể dọn theo tuần hoặc theo tháng. Liên hệ chị Lan để hẹn lịch.',
      price: 120,
      priceType: 'FIXED' as const,
      categorySlug: 'don-dep-nha',
      neighborhoodSlug: 'kalihi',
      contactPhone: '808-555-0105',
      userEmail: 'lan.vo@viethawaii.seed',
      listingType: 'SERVICE' as const,
      serviceArea: 'Honolulu, Pearl City, Aiea, Kalihi',
      availability: 'Thứ 2-7, 8am-5pm',
      experience: '5 năm kinh nghiệm',
    },
    {
      title: 'Dạy kèm Toán và Tiếng Việt cho trẻ em',
      titleEn: 'Math and Vietnamese tutoring for kids',
      description: 'Cô giáo có kinh nghiệm dạy kèm Toán (K-8) và Tiếng Việt cho trẻ em. Tốt nghiệp ĐH Sư Phạm. Dạy tại nhà hoặc online qua Zoom. Giúp bé giữ tiếng Việt và học giỏi Toán. $35/giờ, giảm giá cho 2+ bé.',
      price: 35,
      priceType: 'HOURLY' as const,
      categorySlug: 'day-kem',
      neighborhoodSlug: 'mililani',
      contactPhone: '808-555-0107',
      userEmail: 'mai.bui@viethawaii.seed',
      listingType: 'SERVICE' as const,
      serviceArea: 'Online hoặc tại nhà (Mililani, Pearl City, Waipahu)',
      availability: 'Sau giờ học, 3pm-7pm và cuối tuần',
      experience: '8 năm dạy kèm, tốt nghiệp ĐH Sư Phạm',
    },
    {
      title: 'Sửa chữa nhà, ống nước, điện, giá rẻ',
      titleEn: 'Home repair, plumbing, electrical, affordable',
      description: 'Nhận sửa chữa nhà tổng quát: sửa ống nước, điện, sơn nhà, lắp kệ, sửa cửa. Kinh nghiệm 10 năm. Giá phải chăng, bảo đảm chất lượng. Free estimate. Có thể làm cuối tuần.',
      price: 50,
      priceType: 'HOURLY' as const,
      categorySlug: 'sua-chua-nha',
      neighborhoodSlug: 'pearl-city',
      contactPhone: '808-555-0106',
      userEmail: 'hung.dao@viethawaii.seed',
      listingType: 'SERVICE' as const,
      serviceArea: 'Toàn bộ Oahu',
      availability: 'Thứ 2-CN, linh hoạt',
      experience: '10 năm kinh nghiệm sửa chữa nhà',
    },
    {
      title: 'Dịch thuật Việt-Anh, công chứng, giấy tờ',
      titleEn: 'Vietnamese-English translation, notarized documents',
      description: 'Dịch vụ dịch thuật Việt-Anh chuyên nghiệp. Nhận dịch giấy khai sinh, hôn thú, bằng tốt nghiệp, hồ sơ di trú. Có công chứng. Giá từ $30/trang. Giao trong 2-3 ngày làm việc. Kinh nghiệm 7 năm.',
      price: 30,
      priceType: 'FIXED' as const,
      categorySlug: 'dich-thuat',
      neighborhoodSlug: 'downtown-chinatown',
      contactPhone: '808-555-0101',
      userEmail: 'trang.nguyen@viethawaii.seed',
      listingType: 'SERVICE' as const,
      serviceArea: 'Online và gặp tại Downtown Honolulu',
      availability: 'Thứ 2-6, 9am-5pm',
      experience: '7 năm dịch thuật, certified translator',
    },
    {
      title: 'Kế toán thuế cá nhân và doanh nghiệp nhỏ',
      titleEn: 'Tax preparation for individuals and small businesses',
      description: 'CPA license Hawaii. Nhận làm thuế cá nhân ($150+), doanh nghiệp nhỏ ($300+). Kinh nghiệm với nail salon, nhà hàng, Uber/Lyft drivers. Nói tiếng Việt. Tư vấn miễn phí lần đầu. File e-tax nhanh chóng.',
      price: 150,
      priceType: 'FIXED' as const,
      categorySlug: 'ke-toan-thue',
      neighborhoodSlug: 'aiea',
      contactPhone: '808-555-0108',
      userEmail: 'thanh.ho@viethawaii.seed',
      listingType: 'SERVICE' as const,
      serviceArea: 'Toàn bộ Hawaii, tư vấn online',
      availability: 'Thứ 2-6, 9am-6pm, thứ 7 theo hẹn',
      experience: 'CPA Hawaii, 12 năm kinh nghiệm',
    },
  ];

  for (const listing of serviceListings) {
    const categoryId = catMap[listing.categorySlug];
    const neighborhoodId = hoodMap[listing.neighborhoodSlug];
    const userId = users[listing.userEmail];
    if (!categoryId || !userId) continue;

    await prisma.listing.create({
      data: {
        userId,
        categoryId,
        neighborhoodId,
        title: listing.title,
        titleEn: listing.titleEn,
        description: listing.description,
        price: listing.price,
        priceType: listing.priceType,
        contactPhone: listing.contactPhone,
        listingType: listing.listingType,
        serviceArea: listing.serviceArea,
        availability: listing.availability,
        experience: listing.experience,
        status: 'ACTIVE',
        approvedAt: new Date(),
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        views: Math.floor(Math.random() * 70) + 10,
      },
    });
  }

  console.log(`Seeded ${serviceListings.length} service listings`);

  // ==================== COMMUNITY LISTINGS ====================
  console.log('Seeding community listings...');

  const communityListings = [
    {
      title: 'Lớp học tiếng Việt miễn phí cho trẻ em',
      titleEn: 'Free Vietnamese language class for kids',
      description: 'Lớp học tiếng Việt miễn phí cho trẻ em 5-12 tuổi tại chùa Việt Nam, Pearl City. Mỗi chủ nhật, 10am-12pm. Dạy đọc, viết, nói tiếng Việt. Có sách giáo khoa miễn phí. Đăng ký qua điện thoại.',
      price: 0,
      priceType: 'FREE' as const,
      categorySlug: 'lop-hoc-workshop',
      neighborhoodSlug: 'pearl-city',
      contactPhone: '808-555-0107',
      userEmail: 'mai.bui@viethawaii.seed',
    },
    {
      title: 'Nhóm chạy bộ người Việt Hawaii, chạy mỗi sáng thứ 7',
      titleEn: 'Vietnamese running group Hawaii, every Saturday morning',
      description: 'Nhóm chạy bộ người Việt tại Hawaii. Gặp mặt mỗi sáng thứ 7 lúc 6:30am tại Ala Moana Beach Park. Chạy 3-5 miles tùy level. Mọi trình độ đều welcome. Sau khi chạy đi ăn phở cùng nhau. Miễn phí tham gia!',
      price: 0,
      priceType: 'FREE' as const,
      categorySlug: 'nhom-cau-lac-bo',
      neighborhoodSlug: 'ala-moana',
      contactPhone: '808-555-0106',
      userEmail: 'hung.dao@viethawaii.seed',
    },
    {
      title: 'Tình nguyện: Phát cơm miễn phí cho người vô gia cư',
      titleEn: 'Volunteer: Free meal distribution for homeless',
      description: 'Hội từ thiện Việt Nam Hawaii cần tình nguyện viên phát cơm miễn phí cho người vô gia cư tại Chinatown. Mỗi chủ nhật đầu tháng, 11am-1pm. Cần người nấu cơm, đóng gói, và phát. Liên hệ chị Hương.',
      price: 0,
      priceType: 'FREE' as const,
      categorySlug: 'tinh-nguyen',
      neighborhoodSlug: 'downtown-chinatown',
      contactPhone: '808-555-0103',
      userEmail: 'huong.pham@viethawaii.seed',
    },
  ];

  for (const listing of communityListings) {
    const categoryId = catMap[listing.categorySlug];
    const neighborhoodId = hoodMap[listing.neighborhoodSlug];
    const userId = users[listing.userEmail];
    if (!categoryId || !userId) continue;

    await prisma.listing.create({
      data: {
        userId,
        categoryId,
        neighborhoodId,
        title: listing.title,
        titleEn: listing.titleEn,
        description: listing.description,
        price: listing.price,
        priceType: listing.priceType,
        contactPhone: listing.contactPhone,
        listingType: 'GENERAL',
        status: 'ACTIVE',
        approvedAt: new Date(),
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        views: Math.floor(Math.random() * 90) + 15,
      },
    });
  }

  console.log(`Seeded ${communityListings.length} community listings`);

  // ==================== FOOD LISTINGS ====================
  console.log('Seeding food listings...');

  const foodListings = [
    {
      title: 'Nhận đặt bánh mì thịt nguội, giao tận nơi',
      titleEn: 'Vietnamese banh mi orders, delivery available',
      description: 'Nhận đặt bánh mì thịt nguội homemade. Bánh mì giòn, nhân đầy đặn, đúng vị Sài Gòn. $8/ổ, đặt 10 ổ giảm còn $7/ổ. Giao hàng miễn phí cho đơn từ 5 ổ trở lên (khu vực Honolulu). Đặt trước 1 ngày.',
      price: 8,
      priceType: 'FIXED' as const,
      categorySlug: 'do-an-nha-lam',
      neighborhoodSlug: 'kalihi',
      contactPhone: '808-555-0101',
      zaloNumber: '808-555-0101',
      userEmail: 'trang.nguyen@viethawaii.seed',
    },
    {
      title: 'Đặt tiệc: Bún bò Huế, phở, gỏi cuốn',
      titleEn: 'Catering: Bun bo Hue, pho, spring rolls',
      description: 'Nhận nấu tiệc đồ ăn Việt Nam cho party 10-50 người. Menu: phở, bún bò Huế, gỏi cuốn, chả giò, cơm tấm, bánh xèo. Giá từ $15/người. Kinh nghiệm nấu tiệc thôi nôi, sinh nhật, đám cưới. Đặt trước 1 tuần.',
      price: 15,
      priceType: 'FIXED' as const,
      categorySlug: 'catering-tiec',
      neighborhoodSlug: 'waipahu',
      contactPhone: '808-555-0107',
      zaloNumber: '808-555-0107',
      userEmail: 'mai.bui@viethawaii.seed',
    },
    {
      title: 'Bán nước mắm, tương ớt, gia vị Việt Nam xách tay',
      titleEn: 'Vietnamese fish sauce, chili sauce, imported seasonings',
      description: 'Bán gia vị Việt Nam xách tay: nước mắm Phú Quốc ($12), tương ớt Chin-su ($5), bột nêm Knorr VN ($4), mì Hảo Hảo ($15/thùng 30 gói). Hàng mới về mỗi tháng. Nhận order trước. Lấy tại Kalihi hoặc giao hàng.',
      price: null,
      priceType: 'NEGOTIABLE' as const,
      categorySlug: 'thuc-pham-viet-nam',
      neighborhoodSlug: 'kalihi',
      contactPhone: '808-555-0105',
      zaloNumber: '808-555-0105',
      userEmail: 'lan.vo@viethawaii.seed',
    },
  ];

  for (const listing of foodListings) {
    const categoryId = catMap[listing.categorySlug];
    const neighborhoodId = hoodMap[listing.neighborhoodSlug];
    const userId = users[listing.userEmail];
    if (!categoryId || !userId) continue;

    await prisma.listing.create({
      data: {
        userId,
        categoryId,
        neighborhoodId,
        title: listing.title,
        titleEn: listing.titleEn,
        description: listing.description,
        price: listing.price,
        priceType: listing.priceType,
        contactPhone: listing.contactPhone,
        zaloNumber: listing.zaloNumber,
        listingType: 'GENERAL',
        status: 'ACTIVE',
        approvedAt: new Date(),
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        views: Math.floor(Math.random() * 50) + 10,
      },
    });
  }

  console.log(`Seeded ${foodListings.length} food listings`);

  // ==================== EVENTS ====================
  console.log('Seeding events...');

  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const twoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  const threeWeeks = new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000);

  const events = [
    {
      title: 'Hội Chợ Tết Việt Nam Hawaii 2026',
      titleEn: 'Vietnamese New Year Festival Hawaii 2026',
      description: 'Hội chợ Tết Nguyên Đán lớn nhất Hawaii! Có múa lân, văn nghệ, ẩm thực Việt Nam, trò chơi cho trẻ em, lì xì. Miễn phí vào cửa. Tổ chức tại Foster Botanical Garden.',
      eventType: 'FESTIVAL' as const,
      startDate: new Date(now.getFullYear(), 1, 15, 10, 0),
      endDate: new Date(now.getFullYear(), 1, 15, 20, 0),
      location: 'Foster Botanical Garden',
      address: '180 N Vineyard Blvd, Honolulu, HI 96817',
      neighborhoodSlug: 'downtown-chinatown',
      isFree: true,
      userEmail: 'huong.pham@viethawaii.seed',
      contactPhone: '808-555-0103',
    },
    {
      title: 'Lễ Phật Đản tại chùa Việt Nam',
      titleEn: 'Buddha Birthday Celebration at Vietnamese Temple',
      description: 'Lễ Phật Đản tại chùa Việt Nam Pearl City. Có lễ tắm Phật, tụng kinh, thả đèn hoa đăng, và cơm chay miễn phí. Mời tất cả bà con tham dự.',
      eventType: 'RELIGIOUS' as const,
      startDate: new Date(now.getFullYear(), 4, 12, 9, 0),
      endDate: new Date(now.getFullYear(), 4, 12, 16, 0),
      location: 'Chùa Việt Nam Pearl City',
      address: 'Pearl City, HI',
      neighborhoodSlug: 'pearl-city',
      isFree: true,
      userEmail: 'mai.bui@viethawaii.seed',
      contactPhone: '808-555-0107',
    },
    {
      title: 'Workshop: Nấu phở bò truyền thống',
      titleEn: 'Workshop: Traditional Beef Pho Cooking Class',
      description: 'Học nấu phở bò truyền thống với đầu bếp kinh nghiệm 20 năm. Từ cách ninh xương, pha nước dùng, đến cách trình bày. Giới hạn 15 người. Bao gồm nguyên liệu và ăn tại chỗ.',
      eventType: 'CULTURAL' as const,
      startDate: twoWeeks,
      endDate: new Date(twoWeeks.getTime() + 3 * 60 * 60 * 1000),
      location: 'Community Kitchen, Kalihi',
      address: 'Kalihi, Honolulu, HI',
      neighborhoodSlug: 'kalihi',
      isFree: false,
      price: 45,
      userEmail: 'minh.le@viethawaii.seed',
      contactPhone: '808-555-0102',
    },
    {
      title: 'Họp mặt doanh nhân Việt Nam Hawaii',
      titleEn: 'Vietnamese Business Networking Hawaii',
      description: 'Buổi họp mặt hàng tháng của cộng đồng doanh nhân Việt Nam tại Hawaii. Networking, chia sẻ kinh nghiệm kinh doanh, cơ hội hợp tác. Có ăn nhẹ. RSVP qua điện thoại.',
      eventType: 'BUSINESS' as const,
      startDate: threeWeeks,
      endDate: new Date(threeWeeks.getTime() + 2 * 60 * 60 * 1000),
      location: 'Pacific Club',
      address: '1451 Queen Emma St, Honolulu, HI',
      neighborhoodSlug: 'downtown-chinatown',
      isFree: false,
      price: 10,
      userEmail: 'thanh.ho@viethawaii.seed',
      contactPhone: '808-555-0108',
    },
  ];

  for (const event of events) {
    const neighborhoodId = hoodMap[event.neighborhoodSlug];
    const userId = users[event.userEmail];
    if (!userId) continue;

    await prisma.event.create({
      data: {
        userId,
        title: event.title,
        titleEn: event.titleEn,
        description: event.description,
        eventType: event.eventType,
        startDate: event.startDate,
        endDate: event.endDate,
        location: event.location,
        address: event.address,
        neighborhoodId,
        isFree: event.isFree,
        price: event.price,
        contactPhone: event.contactPhone,
        status: 'APPROVED',
        views: Math.floor(Math.random() * 150) + 30,
      },
    });
  }

  console.log(`Seeded ${events.length} events`);

  // ==================== SUMMARY ====================
  const totalListings = housingListings.length + jobListings.length + marketListings.length
    + vehicleListings.length + serviceListings.length + communityListings.length + foodListings.length;

  console.log('\n========== SEED SUMMARY ==========');
  console.log(`Users:        ${Object.keys(users).length}`);
  console.log(`Housing:      ${housingListings.length}`);
  console.log(`Jobs:         ${jobListings.length}`);
  console.log(`Marketplace:  ${marketListings.length}`);
  console.log(`Vehicles:     ${vehicleListings.length}`);
  console.log(`Services:     ${serviceListings.length}`);
  console.log(`Community:    ${communityListings.length}`);
  console.log(`Food:         ${foodListings.length}`);
  console.log(`Events:       ${events.length}`);
  console.log(`TOTAL:        ${totalListings} listings + ${events.length} events`);
  console.log('==================================\n');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
