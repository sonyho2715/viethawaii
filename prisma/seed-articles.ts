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

  // Article 1: Hướng dẫn tìm nhà thuê 2026
  const article1Content = `Tìm nhà tại Hawaii luôn là một thử thách lớn do chi phí đắt đỏ và tính cạnh tranh cao. Bài viết này cung cấp thông tin thực tế về thị trường, các khu vực người Việt thường sống và những lưu ý pháp lý quan trọng để tránh rủi ro.

---

## 1. Các Khu Vực Phổ Biến (Phân Theo Nhu Cầu)

Việc chọn khu vực sống phụ thuộc lớn vào nơi bạn làm việc và khả năng chịu đựng kẹt xe (traffic).

### Tại Honolulu (Thành phố chính)

**Kalihi**: Khu vực có đông người Việt sinh sống nhất.
- ✅ **Ưu điểm**: Giá thuê rẻ nhất, gần chợ Việt, nhiều đồ ăn Việt, gần trung tâm
- ⚠️ **Nhược điểm**: Một số khu vực an ninh không tốt, nhà cửa thường cũ

**Chinatown**: Rất thuận tiện mua sắm và đi lại bằng xe bus. Tuy nhiên, vấn đề người vô gia cư và an ninh vào ban đêm là điều cần cân nhắc kỹ.

**Makiki / McCully / Moiliili**: Khu vực tập trung nhiều sinh viên và người đi làm. Gần Waikiki và Ala Moana nhưng giá mềm hơn trung tâm một chút.

### Khu Vực Phía Tây & Trung Tâm Đảo (Central & West Oahu)

**Waipahu**: "Thủ phủ" thứ hai của cộng đồng người Việt. Nhiều gia đình chọn ở đây vì nhà rộng hơn. Có chợ, nhà hàng và chùa Việt Nam.

**Pearl City / Aiea**: Khu dân cư yên tĩnh, an ninh tốt hơn, nằm giữa trung tâm và phía Tây. Gần trung tâm mua sắm Pearlridge.

**Kapolei**: Thành phố mới. Nhà cửa đẹp, hiện đại, đường sá rộng rãi nhưng rất xa trung tâm Honolulu (mất 45-60 phút lái xe giờ cao điểm).

---

## 2. Mức Giá Thuê Trung Bình (Ước tính 2026)

⚠️ **Lưu ý**: Giá dưới đây chưa bao gồm điện nước (utilities). Giá điện tại Hawaii rất cao (trung bình **$150 - $250/tháng** cho căn hộ nhỏ nếu dùng điều hòa).

| Loại nhà | Mức giá trung bình | Đối tượng phù hợp |
|----------|-------------------|-------------------|
| Phòng lẻ (Room for rent) | $800 - $1,200 | Sinh viên, người độc thân. Thường chung bếp/toilet |
| Studio / Ohana Unit | $1,400 - $1,800 | Người độc thân hoặc cặp đôi. "Ohana Unit" là dạng nhà phụ, gắn liền với nhà chính |
| 1 Phòng ngủ (Apartment) | $1,700 - $2,400 | Cặp đôi muốn riêng tư |
| 2 Phòng ngủ | $2,300 - $3,200+ | Gia đình nhỏ (3-4 người) |

---

## 3. Quy Trình & Giấy Tờ Cần Thiết

Thị trường Hawaii cạnh tranh rất gay gắt. Khi đi xem nhà, hãy chuẩn bị sẵn hồ sơ để nộp ngay nếu ưng ý.

### Chứng minh thu nhập (Proof of Income)
Chủ nhà thường yêu cầu thu nhập gộp (gross income) gấp **2.5 đến 3 lần** tiền thuê nhà.
> Ví dụ: Thuê nhà $2,000 thì lương phải khoảng $5,000 - $6,000

### Điểm tín dụng (Credit Score)
- Điểm tốt thường là **650+**
- Nếu bạn mới đến Mỹ và chưa có điểm tín dụng, hãy nhờ người thân ký bảo lãnh (Co-signer)

### Tiền đặt cọc (Security Deposit)
- ⚖️ **Luật Hawaii quy định**: Tiền cọc không được vượt quá **1 tháng tiền thuê**
- Nếu có thú cưng, chủ nhà có thể thu thêm khoản cọc thú cưng (nhưng tổng cộng cũng bị giới hạn theo luật định)

### Bảo hiểm người thuê (Renter's Insurance)
Nhiều chung cư hiện đại bắt buộc bạn phải mua bảo hiểm này (khoảng $15-$20/tháng).

---

## 4. Mẹo Tìm Nhà Riêng Cho Người Việt

### 🚗 Tìm biển "For Rent" trên cửa sổ
Ở các khu vực như Kalihi hay Palolo, nhiều chủ nhà lớn tuổi (bao gồm người Việt) không đăng tin lên mạng. Họ chỉ treo bảng trước cửa. Hãy lái xe quanh khu vực bạn muốn thuê.

### 🗣️ Hỏi người quen (Word of Mouth)
Cộng đồng người Việt tại Hawaii rất gắn kết. Hãy hỏi thăm tại các tiệm Nail, chợ Việt hoặc nơi làm việc. Nhiều căn "Ohana unit" giá tốt được truyền miệng trước khi đăng báo.

### 🚨 Cẩn thận với lừa đảo (Scams)

⛔ **Không bao giờ** chuyển tiền cọc qua Zelle/Venmo trước khi gặp chủ nhà và xem nhà trực tiếp.

⛔ Nếu giá quá rẻ so với mặt bằng chung (ví dụ: nhà 2 phòng ngủ giá $1,200), đó **99% là lừa đảo**.

⛔ Kẻ lừa đảo thường lấy hình trên mạng, nói rằng "đang đi công tác xa" và yêu cầu bạn chuyển tiền để giữ chỗ.

---

## 5. Các Kênh Tìm Nhà Uy Tín

### Facebook Groups (Hiệu quả nhất với cộng đồng Việt)
- Tìm các nhóm: "Nguoi Viet o Hawaii", "Hawaii Rentals", "Oahu Housing"
- **Facebook Marketplace**: Cập nhật nhanh, dễ nhắn tin trực tiếp cho chủ nhà

### Các trang web khác
- **Craigslist Hawaii**: Nguồn tin phong phú nhất nhưng cũng nhiều lừa đảo nhất. Hãy cảnh giác
- **Hicentral.com**: Trang web chính thức của hiệp hội môi giới bất động sản Hawaii (MLS), thông tin chính xác, an toàn
- **Zillow / Apartments.com**: Tốt để khảo sát giá thị trường

---

*Thông tin trong bài viết mang tính chất tham khảo và dựa trên thị trường thực tế đầu năm 2026. Hãy luôn đọc kỹ hợp đồng thuê nhà trước khi đặt bút ký.*`;

  const article1 = await db.article.upsert({
    where: { slug: 'huong-dan-tim-nha-thue-hawaii' },
    update: {
      titleVn: 'Hướng Dẫn Tìm Nhà Thuê Tại Hawaii Cho Người Việt (Cập Nhật 2026)',
      titleEn: 'Guide to Finding Rentals in Hawaii for Vietnamese (2026 Update)',
      excerptVn: 'Thông tin thực tế về thị trường, các khu vực người Việt thường sống và những lưu ý pháp lý quan trọng.',
      excerptEn: 'Practical information about the market, Vietnamese community areas, and important legal considerations.',
      contentVn: article1Content,
      status: 'PUBLISHED',
      publishedAt: new Date('2026-01-06'),
    },
    create: {
      authorId: admin.id,
      categoryId: 2, // Hướng dẫn
      slug: 'huong-dan-tim-nha-thue-hawaii',
      titleVn: 'Hướng Dẫn Tìm Nhà Thuê Tại Hawaii Cho Người Việt (Cập Nhật 2026)',
      titleEn: 'Guide to Finding Rentals in Hawaii for Vietnamese (2026 Update)',
      excerptVn: 'Thông tin thực tế về thị trường, các khu vực người Việt thường sống và những lưu ý pháp lý quan trọng.',
      excerptEn: 'Practical information about the market, Vietnamese community areas, and important legal considerations.',
      contentVn: article1Content,
      contentEn: 'Guide to finding rentals in Hawaii for Vietnamese community - 2026 update.',
      status: 'PUBLISHED',
      publishedAt: new Date('2026-01-06'),
      views: 156,
    },
  });
  console.log('Article 1 created:', article1.slug);

  // Article 2: Cẩm Nang Việc Làm 2026
  const article2Content = `Chào mừng bạn đến với thị trường lao động tại Hawaii. Hawaii không chỉ là thiên đường du lịch mà còn là nơi có cộng đồng người Việt phát triển mạnh (đặc biệt tại khu vực Honolulu/Kalihi). Dưới đây là thông tin chi tiết về các ngành nghề phổ biến, mức lương thực tế và các lưu ý pháp lý quan trọng cho năm 2026.

## ⚠️ Lưu ý quan trọng về Lương Tối Thiểu (2026)

Kể từ ngày 01/01/2026, mức lương tối thiểu tại Hawaii là **$16.00/giờ**. Mọi công việc trả dưới mức này (trừ một số trường hợp đặc biệt có tiền tip) đều cần được xem xét kỹ về tính hợp pháp.

---

## 1. Ngành Du Lịch & Khách Sạn (Hospitality)

Đây là "xương sống" của kinh tế Hawaii. Biết tiếng Việt là một lợi thế lớn khi phục vụ du khách Á Đông.

### Khách sạn (Hotel)
- **Vị trí**: Lễ tân (Front Desk), Dọn phòng (Housekeeping), Hành lý (Bellman)
- **Mức lương**: $18 - $28/giờ (Các vị trí thuộc nghiệp đoàn thường có lương và phúc lợi rất tốt)

### Nhà hàng (F&B)
- **Vị trí**: Phục vụ (Server), Pha chế (Bartender), Đón khách (Hostess)
- **Thu nhập**: Lương cơ bản ($14.75 - $16.00) + Tiền tip. Tổng thu nhập thường đạt **$25 - $40/giờ** tại các khu du lịch Waikiki

### Du lịch
- **Vị trí**: Hướng dẫn viên, Tài xế xe tour
- **Yêu cầu**: Tiếng Anh giao tiếp tốt, bằng lái xe phù hợp

---

## 2. Ngành Nail & Làm Đẹp (Beauty Industry)

Ngành nghề truyền thống và thế mạnh của người Việt.

- **Vị trí**: Thợ Nail (Nail Technician), Thợ tóc (Hair Stylist), Chăm sóc da (Esthetician)
- **Thu nhập**: $16.00/giờ (Lương cứng) + Tiền tip
- **Thợ lành nghề** có thể kiếm **$4,000 - $7,000/tháng**

### Yêu cầu bắt buộc
- ✅ Phải có chứng chỉ hành nghề (License) từ Hawaii Board of Barbering and Cosmetology
- ✅ Cần hoàn thành giờ học (ví dụ: 350 giờ cho thợ Nail) và thi đỗ kỳ thi của tiểu bang

---

## 3. Ngành Y Tế (Healthcare)

Nhu cầu cực cao do dân số già hóa. Đây là ngành có thu nhập ổn định nhất.

| Vị trí | Mức lương | Ghi chú |
|--------|-----------|---------|
| Y tá (RN) | $50 - $75+/giờ | Hawaii trả lương y tá cao nhất nước Mỹ |
| Trợ lý điều dưỡng (CNA) | $20 - $28/giờ | Cần chứng chỉ CNA |
| Chăm sóc người già (Caregiver) | $18 - $25/giờ | Nhiều chủ Care Home là người Việt |
| Trợ lý y tế (Medical Assistant) | $22 - $30/giờ | |

---

## 4. Ngành Xây Dựng (Construction)

Hawaii luôn có nhiều dự án cải tạo và xây dựng mới.

- **Lao động phổ thông (Laborer)**: $22 - $30/giờ
- **Thợ chuyên môn (Thợ điện, Thợ nước, Thợ mộc)**: $35 - $60+/giờ

**Lợi thế**: Nhiều nhà thầu (Contractor) là người Việt, dễ dàng hơn trong giao tiếp và xin việc.

**Lưu ý**: Các công việc chuyên môn (điện, nước) yêu cầu License từ DCCA (Department of Commerce and Consumer Affairs).

---

## 5. Ngành Ẩm Thực Việt Nam

Hawaii có rất nhiều nhà hàng, quán phở, tiệm bánh mì của người Việt.

- **Đầu bếp chính (Chef/Cook)**: $25 - $40/giờ (tùy tay nghề)
- **Phụ bếp (Prep Cook)**: $17 - $22/giờ
- **Quản lý (Manager)**: $55,000 - $80,000/năm

---

## 6. Ngành Vận Tải (Transportation)

Linh hoạt về thời gian, phù hợp cho người mới đến cần thu nhập ngay.

- **Tài xế công nghệ (Uber/Lyft)**: $25 - $35+/giờ (chưa trừ xăng xe/khấu hao). Nhu cầu cao ở khu vực Honolulu và sân bay HNL
- **Giao đồ ăn (DoorDash/UberEats)**: $18 - $25/giờ
- **Lái xe tải (CDL Driver)**: $28 - $45/giờ. Cần bằng lái thương mại (CDL)

---

## 💡 Thông Tin Bổ Sung Quan Trọng

### 1. Chi Phí Sinh Hoạt (Cost of Living)

⚠️ **Cảnh báo**: Hawaii là tiểu bang đắt đỏ nhất nước Mỹ. Mức lương $20/giờ tại đây chỉ tương đương khoảng $12-$14/giờ ở các tiểu bang khác về sức mua.

**Nhà ở**: Thuê căn hộ 1 phòng ngủ tại Honolulu trung bình **$1,600 - $2,200/tháng**

### 2. Ngôn Ngữ

- Mặc dù cộng đồng Việt đông, **Tiếng Anh là chìa khóa** để có mức lương cao (đặc biệt trong Y tế và Khách sạn cao cấp)
- Các công việc lao động tay chân hoặc trong khu phố người Việt (Chinatown, Kalihi) có thể yêu cầu tiếng Anh thấp hơn

### 3. Nguồn Tìm Việc Uy Tín

Đừng chỉ dựa vào một nguồn. Hãy kết hợp:

- **Facebook Groups**: Tìm từ khóa "Nguoi Viet o Hawaii", "Viec Lam Hawaii", "Cho Hawaii". Đây là nơi cập nhật nhanh nhất các việc làm trong cộng đồng
- **Indeed / Glassdoor**: Tốt cho các việc làm Y tế, Khách sạn, Văn phòng
- **Craigslist Hawaii**: Phổ biến cho các công việc lao động, xây dựng, nhà hàng (cẩn thận lừa đảo)
- **Mối quan hệ (Networking)**: Đi chợ, sinh hoạt tôn giáo (Chùa, Nhà thờ) là cách tốt nhất để nghe ngóng thông tin tuyển dụng nội bộ

### 4. Lời Khuyên Cho Người Mới

- 🚗 **Học bằng lái xe ngay lập tức**: Giao thông công cộng (TheBus) khá tốt nhưng đi làm bằng xe riêng vẫn thuận tiện hơn nhiều
- ⚠️ **Kiểm tra giấy phép**: Đừng làm chui (trá hình) trong các ngành cần bằng cấp (Nail, Massage, Điện nước). Mức phạt của tiểu bang rất nặng

---

*Thông tin được cập nhật đến tháng 01/2026. Mức lương thực tế có thể thay đổi tùy thuộc vào kinh nghiệm và địa điểm làm việc cụ thể.*`;

  const article2 = await db.article.upsert({
    where: { slug: 'viec-lam-pho-bien-nguoi-viet-hawaii' },
    update: {
      titleVn: 'Cẩm Nang Việc Làm Cho Người Việt Tại Hawaii (Cập Nhật 2026)',
      titleEn: 'Job Guide for Vietnamese in Hawaii (2026 Update)',
      excerptVn: 'Hướng dẫn chi tiết về các ngành nghề, mức lương thực tế và lưu ý pháp lý cho năm 2026.',
      excerptEn: 'Comprehensive guide on industries, actual wages, and legal considerations for 2026.',
      contentVn: article2Content,
      status: 'PUBLISHED',
      publishedAt: new Date('2026-01-06'),
    },
    create: {
      authorId: admin.id,
      categoryId: jobsCategory.id, // Việc làm
      slug: 'viec-lam-pho-bien-nguoi-viet-hawaii',
      titleVn: 'Cẩm Nang Việc Làm Cho Người Việt Tại Hawaii (Cập Nhật 2026)',
      titleEn: 'Job Guide for Vietnamese in Hawaii (2026 Update)',
      excerptVn: 'Hướng dẫn chi tiết về các ngành nghề, mức lương thực tế và lưu ý pháp lý cho năm 2026.',
      excerptEn: 'Comprehensive guide on industries, actual wages, and legal considerations for 2026.',
      contentVn: article2Content,
      contentEn: 'Job guide for Vietnamese in Hawaii - 2026 update.',
      status: 'PUBLISHED',
      publishedAt: new Date('2026-01-06'),
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
