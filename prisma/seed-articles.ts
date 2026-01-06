import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  console.log('Seeding articles...');

  // Add 'Việc làm' category if it doesn't exist
  const jobsCategory = await db.contentCategory.upsert({
    where: { slug: 'viec-lam' },
    update: {},
    create: {
      slug: 'viec-lam',
      nameVn: 'Việc làm',
      nameEn: 'Jobs',
      type: 'BLOG',
      color: '#3B82F6',
      sortOrder: 6,
      isActive: true,
    },
  });
  console.log('Jobs category ID:', jobsCategory.id);

  // Get admin user for author
  const admin = await db.user.findFirst({ where: { role: 'SUPERADMIN' } });
  if (!admin) throw new Error('No admin user found');
  console.log('Admin user:', admin.id);

  // Article 1: Hướng dẫn tìm nhà thuê
  const article1Content = `# Hướng dẫn tìm nhà thuê tại Hawaii cho người Việt

Tìm nhà thuê tại Hawaii có thể là một thử thách, đặc biệt với những người mới đến. Bài viết này sẽ giúp bạn hiểu rõ thị trường thuê nhà và tìm được nơi ở phù hợp.

## Các khu vực phổ biến

### Honolulu
- **Chinatown**: Giá rẻ hơn, gần chợ Việt, nhiều người Việt sinh sống
- **Kalihi**: Khu vực bình dân, gần Costco và nhiều cửa hàng Á Châu
- **Ala Moana**: Khu vực trung tâm, gần biển và trung tâm mua sắm

### Các khu vực khác trên Oahu
- **Pearl City**: Giá hợp lý, gần trung tâm
- **Waipahu**: Nhiều gia đình Việt Nam, có chùa và nhà thờ Việt
- **Aiea**: Khu vực yên tĩnh, phù hợp gia đình

## Mức giá trung bình (2025)

| Loại nhà | Giá/tháng |
|----------|-----------|
| Studio | $1,200 - $1,800 |
| 1 phòng ngủ | $1,500 - $2,200 |
| 2 phòng ngủ | $2,000 - $3,000 |
| 3 phòng ngủ | $2,500 - $4,000 |

## Những điều cần chuẩn bị

1. **Credit Score**: Điểm tín dụng tốt (trên 650) sẽ giúp bạn dễ thuê hơn
2. **Proof of Income**: Bằng chứng thu nhập (thường yêu cầu 2.5-3x tiền thuê)
3. **References**: Thư giới thiệu từ chủ nhà cũ
4. **Security Deposit**: Tiền đặt cọc (thường 1-2 tháng tiền thuê)

## Mẹo hữu ích

- **Đi xem nhà trực tiếp**: Không thuê nhà chỉ qua hình ảnh
- **Kiểm tra hợp đồng kỹ**: Đọc kỹ điều khoản về tiện ích, pets, và thời hạn
- **Hỏi về chi phí phụ**: Điện, nước, internet có bao gồm không?
- **Tìm roommate**: Chia sẻ phòng có thể tiết kiệm đáng kể

## Các trang web tìm nhà uy tín

- VietHawaii.com (Rao vặt cộng đồng Việt)
- Craigslist Hawaii
- Facebook Marketplace
- Zillow, Apartments.com

## Cảnh báo lừa đảo

⚠️ **Không bao giờ** chuyển tiền trước khi xem nhà trực tiếp
⚠️ **Cẩn thận** với giá quá rẻ so với thị trường
⚠️ **Xác minh** chủ nhà thật sự sở hữu bất động sản

Chúc bạn tìm được nơi ở ưng ý tại Hawaii!`;

  const article1 = await db.article.upsert({
    where: { slug: 'huong-dan-tim-nha-thue-hawaii' },
    update: {
      contentVn: article1Content,
      status: 'PUBLISHED',
    },
    create: {
      authorId: admin.id,
      categoryId: 2, // Hướng dẫn
      slug: 'huong-dan-tim-nha-thue-hawaii',
      titleVn: 'Hướng dẫn tìm nhà thuê tại Hawaii cho người Việt',
      titleEn: 'Guide to Finding Rentals in Hawaii for Vietnamese',
      excerptVn: 'Những điều cần biết khi tìm nhà thuê tại Hawaii: khu vực, giá cả, và mẹo hữu ích.',
      excerptEn: 'Everything you need to know about finding rentals in Hawaii: areas, prices, and useful tips.',
      contentVn: article1Content,
      contentEn: 'Guide to finding rentals in Hawaii for Vietnamese community.',
      status: 'PUBLISHED',
      publishedAt: new Date('2025-01-01'),
      views: 156,
    },
  });
  console.log('Article 1 created:', article1.slug);

  // Article 2: Việc làm phổ biến
  const article2Content = `# Những công việc phổ biến cho người Việt tại Hawaii

Hawaii có nền kinh tế đa dạng với nhiều cơ hội việc làm cho cộng đồng người Việt. Dưới đây là những ngành nghề phổ biến nhất.

## 1. Ngành Du Lịch & Khách Sạn

Hawaii là điểm du lịch hàng đầu thế giới, tạo ra hàng ngàn việc làm:

- **Khách sạn**: Lễ tân, housekeeping, bellman
- **Nhà hàng**: Server, bartender, hostess
- **Tour guide**: Hướng dẫn viên du lịch (biết tiếng Việt là lợi thế)
- **Spa & Massage**: Kỹ thuật viên massage, nail technician

**Mức lương trung bình**: $15 - $25/giờ + tips

## 2. Ngành Y Tế

Nhu cầu nhân viên y tế tại Hawaii rất cao:

- **CNA (Certified Nursing Assistant)**: $18 - $25/giờ
- **Caregiver**: Chăm sóc người già tại nhà, $15 - $22/giờ
- **Medical Assistant**: $20 - $28/giờ
- **Registered Nurse**: $40 - $60/giờ

**Lưu ý**: Cần có chứng chỉ và license phù hợp

## 3. Ngành Xây Dựng

Hawaii đang có nhiều dự án xây dựng lớn:

- **General laborer**: $20 - $30/giờ
- **Electrician**: $35 - $55/giờ
- **Plumber**: $30 - $50/giờ
- **Carpenter**: $25 - $45/giờ

**Lợi thế**: Nhiều công ty xây dựng do người Việt làm chủ

## 4. Ngành Nhà Hàng & Ẩm Thực

Với nhiều nhà hàng Việt Nam tại Hawaii:

- **Đầu bếp**: $18 - $35/giờ
- **Phụ bếp**: $15 - $20/giờ
- **Server**: $12 - $15/giờ + tips
- **Manager**: $50,000 - $70,000/năm

## 5. Ngành Nail & Làm Đẹp

Ngành nghề truyền thống của cộng đồng Việt:

- **Nail Technician**: $15 - $25/giờ + tips
- **Hair Stylist**: $15 - $30/giờ + tips
- **Esthetician**: $18 - $28/giờ + tips

**Yêu cầu**: License của Hawaii State

## 6. Ngành Vận Tải

- **Uber/Lyft Driver**: $15 - $30/giờ
- **Delivery Driver**: $15 - $25/giờ
- **CDL Truck Driver**: $25 - $40/giờ

## Mẹo tìm việc

1. **Networking**: Tham gia cộng đồng Việt Nam tại Hawaii
2. **Học tiếng Anh**: Tiếng Anh tốt mở nhiều cơ hội hơn
3. **Lấy chứng chỉ**: Nhiều nghề cần license của Hawaii
4. **Dùng VietHawaii**: Đăng tin tìm việc miễn phí

## Các nguồn tìm việc

- VietHawaii.com - Việc làm cộng đồng Việt
- Indeed.com
- LinkedIn
- Hawaii State Job Portal
- Các nhóm Facebook cộng đồng Việt Hawaii

Chúc bạn sớm tìm được công việc phù hợp!`;

  const article2 = await db.article.upsert({
    where: { slug: 'viec-lam-pho-bien-nguoi-viet-hawaii' },
    update: {
      contentVn: article2Content,
      status: 'PUBLISHED',
    },
    create: {
      authorId: admin.id,
      categoryId: jobsCategory.id, // Việc làm
      slug: 'viec-lam-pho-bien-nguoi-viet-hawaii',
      titleVn: 'Những công việc phổ biến cho người Việt tại Hawaii',
      titleEn: 'Popular Jobs for Vietnamese in Hawaii',
      excerptVn: 'Tổng hợp các ngành nghề có nhiều cơ hội việc làm cho cộng đồng người Việt.',
      excerptEn: 'Overview of industries with many job opportunities for the Vietnamese community.',
      contentVn: article2Content,
      contentEn: 'Popular jobs for Vietnamese in Hawaii.',
      status: 'PUBLISHED',
      publishedAt: new Date('2025-01-01'),
      views: 234,
    },
  });
  console.log('Article 2 created:', article2.slug);

  // Article 3: Quán ăn Việt ngon nhất
  const article3Content = `# Những quán ăn Việt ngon nhất ở Honolulu

Honolulu có một cộng đồng người Việt sôi động với nhiều nhà hàng, quán ăn ngon. Dưới đây là những địa điểm được yêu thích nhất.

## 🍜 Phở

### 1. Phở Việt
📍 **Địa chỉ**: 1120 Maunakea St, Honolulu
⭐ **Đánh giá**: 4.5/5
💰 **Giá**: $12 - $18

Phở Việt nổi tiếng với nước dùng đậm đà, thịt bò tươi ngon. Đây là điểm đến yêu thích của nhiều người Việt nhớ hương vị quê nhà.

**Món nên thử**:
- Phở tái nạm gầu
- Phở bò viên
- Gỏi cuốn tôm thịt

### 2. Phở 97
📍 **Địa chỉ**: 980 N Beretania St, Honolulu
⭐ **Đánh giá**: 4.3/5
💰 **Giá**: $10 - $15

Quán nhỏ nhưng phở rất ngon, giá cả phải chăng. Đông khách vào buổi trưa.

## 🍚 Cơm Tấm & Cơm Phần

### 3. Viet Cuisine
📍 **Địa chỉ**: 2615 S King St, Honolulu
⭐ **Đánh giá**: 4.4/5
💰 **Giá**: $12 - $20

Cơm tấm sườn nướng tuyệt vời, đầy đủ đồ ăn kèm truyền thống.

**Món nên thử**:
- Cơm tấm sườn bì chả
- Cơm gà xối mỡ
- Bún thịt nướng

### 4. The Pig & The Lady
📍 **Địa chỉ**: 83 N King St, Honolulu
⭐ **Đánh giá**: 4.6/5
💰 **Giá**: $15 - $35

Nhà hàng Việt fusion nổi tiếng, kết hợp ẩm thực Việt với phong cách hiện đại. Thích hợp cho dịp đặc biệt.

**Món nên thử**:
- Phở French Dip
- Banh Mi Burger
- Vietnamese Coffee Dessert

## 🥢 Bún & Mì

### 5. Lucky Belly
📍 **Địa chỉ**: 50 N Hotel St, Honolulu
⭐ **Đánh giá**: 4.5/5
💰 **Giá**: $14 - $22

Chuyên về mì và bún với phong cách fusion. Không gian hiện đại, thích hợp hẹn hò.

### 6. Quán Bún Bò Huế Lạc Cầu
📍 **Địa chỉ**: 1156 Maunakea St, Honolulu
⭐ **Đánh giá**: 4.4/5
💰 **Giá**: $12 - $16

Bún bò Huế cay nồng đúng vị miền Trung. Giò heo mềm, chả cua ngon.

## 🥖 Bánh Mì

### 7. Ba-Le Sandwich
📍 **Địa chỉ**: Nhiều chi nhánh tại Honolulu
⭐ **Đánh giá**: 4.2/5
💰 **Giá**: $6 - $10

Chuỗi bánh mì phổ biến nhất Hawaii. Bánh giòn, nhân đầy đặn.

**Món nên thử**:
- Bánh mì thịt nguội
- Bánh mì gà nướng
- Chè thái

## 🧋 Trà Sữa & Chè

### 8. TapioKing
📍 **Địa chỉ**: 2330 Kalakaua Ave, Honolulu
⭐ **Đánh giá**: 4.3/5
💰 **Giá**: $5 - $8

Trà sữa ngon, nhiều topping. Có cả chè Việt Nam.

## Mẹo khi đi ăn

- **Giờ cao điểm**: 11:30 - 13:00 và 18:00 - 20:00 thường đông
- **Tiền tip**: Thường 15-20% tại nhà hàng
- **Đậu xe**: Chinatown khó đậu xe, nên đi Uber hoặc đậu ở bãi xe công cộng
- **Mang về**: Nhiều quán có take-out, tiết kiệm hơn

## Bản đồ khu vực ẩm thực Việt

Hầu hết các quán ăn Việt tập trung tại:
- **Chinatown**: Maunakea St, Hotel St, River St
- **Kalihi**: Dillingham Blvd
- **Kapahulu**: Kapahulu Ave

Chúc bạn có những bữa ăn ngon tại Hawaii!`;

  const article3 = await db.article.upsert({
    where: { slug: 'quan-an-viet-ngon-nhat-honolulu' },
    update: {
      contentVn: article3Content,
      status: 'PUBLISHED',
    },
    create: {
      authorId: admin.id,
      categoryId: 5, // Ẩm thực
      slug: 'quan-an-viet-ngon-nhat-honolulu',
      titleVn: 'Những quán ăn Việt ngon nhất ở Honolulu',
      titleEn: 'Best Vietnamese Restaurants in Honolulu',
      excerptVn: 'Khám phá các quán phở, bún, cơm tấm được yêu thích nhất tại Honolulu.',
      excerptEn: 'Discover the most popular pho, bun, and com tam restaurants in Honolulu.',
      contentVn: article3Content,
      contentEn: 'Best Vietnamese restaurants in Honolulu.',
      status: 'PUBLISHED',
      publishedAt: new Date('2025-01-01'),
      views: 312,
    },
  });
  console.log('Article 3 created:', article3.slug);

  console.log('\n✅ All articles created successfully!');
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
