import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const AUTHOR_ID = 'a55e5b2e-6d22-445e-be1c-55a6414dcc65';

const articles = [
  // ===== TIN TỨC (News) - Category 1 =====
  {
    categoryId: 1,
    slug: 'cong-dong-viet-hawaii-tet-2026',
    titleVn: 'Cộng đồng Việt Hawaii tổ chức Tết Nguyên Đán 2026 hoành tráng',
    titleEn: 'Hawaii Vietnamese Community Celebrates Lunar New Year 2026',
    excerptVn: 'Hơn 5,000 người tham dự lễ hội Tết tại Kapolei với nhiều hoạt động văn hóa đặc sắc.',
    excerptEn: 'Over 5,000 attendees at the Kapolei Tet Festival featuring cultural performances.',
    contentVn: `# Tết Nguyên Đán 2026 tại Hawaii

## Sự kiện Tết lớn nhất năm

Cộng đồng người Việt tại Hawaii vừa tổ chức thành công lễ hội Tết Nguyên Đán 2026 tại Kapolei Community Park, thu hút hơn 5,000 người tham dự.

## Các hoạt động nổi bật

- **Múa lân**: Đoàn múa lân từ California biểu diễn
- **Áo dài show**: Trình diễn áo dài truyền thống
- **Ẩm thực**: Hơn 30 gian hàng thức ăn Việt Nam
- **Văn nghệ**: Ca nhạc, cải lương, hát quan họ
- **Trò chơi dân gian**: Đập niêu, nhảy bao bố, kéo co

## Lời cảm ơn từ Ban Tổ Chức

"Chúng tôi rất vui khi thấy cộng đồng Việt Nam tại Hawaii ngày càng lớn mạnh. Tết năm nay là dịp để chúng ta cùng nhau gìn giữ văn hóa truyền thống."

---

*Ảnh và video sự kiện có thể xem trên Facebook: VietHawaii Community*`,
    contentEn: `# Lunar New Year 2026 in Hawaii\n\nThe Vietnamese community successfully organized the 2026 Lunar New Year Festival at Kapolei Community Park.`,
    contentType: 'ARTICLE',
  },
  {
    categoryId: 1,
    slug: 'nha-hang-pho-saigon-khai-truong',
    titleVn: 'Nhà hàng Phở Sài Gòn mới khai trương tại Kalihi',
    titleEn: 'New Pho Saigon Restaurant Opens in Kalihi',
    excerptVn: 'Nhà hàng phở mới hứa hẹn mang đến hương vị phở Sài Gòn chính hiệu.',
    excerptEn: 'New pho restaurant promises authentic Saigon-style pho.',
    contentVn: `# Phở Sài Gòn khai trương tại Kalihi

## Địa điểm mới cho người yêu phở

Một nhà hàng phở mới mang tên "Phở Sài Gòn Authentic" vừa khai trương trên đường N. King Street.

## Đặc điểm nổi bật

- **Nước dùng**: Hầm xương 24 giờ theo công thức gia truyền
- **Phở tái**: Thịt bò tươi thái tại chỗ
- **Bánh cuốn**: Tráng tại chỗ mỗi sáng

## Menu và giá cả

| Món | Giá |
|-----|-----|
| Phở đặc biệt | $15.95 |
| Phở tái | $13.95 |
| Bánh cuốn | $12.95 |

**Địa chỉ**: 1234 N. King Street, Honolulu
**Giờ mở cửa**: 7AM - 9PM (Thứ 2 nghỉ)`,
    contentEn: `# Pho Saigon Opens in Kalihi\n\nA new pho restaurant has opened on N. King Street.`,
    contentType: 'ARTICLE',
  },

  // ===== HƯỚNG DẪN (Guides) - Category 2 =====
  {
    categoryId: 2,
    slug: 'huong-dan-xin-bang-lai-xe-hawaii',
    titleVn: 'Hướng dẫn chi tiết xin bằng lái xe tại Hawaii',
    titleEn: 'Complete Guide to Getting a Driver\'s License in Hawaii',
    excerptVn: 'Tất cả những gì bạn cần biết để lấy bằng lái xe tại Hawaii.',
    excerptEn: 'Everything you need to know about getting your driver\'s license in Hawaii.',
    contentVn: `# Hướng dẫn xin bằng lái xe tại Hawaii

## Giấy tờ cần chuẩn bị

1. **Chứng minh danh tính**: Hộ chiếu, thẻ xanh, hoặc giấy phép lao động
2. **Chứng minh địa chỉ**: Hóa đơn điện/nước, hợp đồng thuê nhà
3. **Social Security Number**: Thẻ SSN hoặc thư xác nhận từ SSA
4. **Bằng lái xe cũ** (nếu có)

## Các bước xin bằng lái

### Bước 1: Đăng ký lịch hẹn
- Truy cập website: alohaq.honolulu.gov
- Chọn loại dịch vụ: "Driver License"

### Bước 2: Thi lý thuyết
- 30 câu hỏi trắc nghiệm
- Cần đúng 24 câu (80%) để đậu
- **Có thể thi bằng tiếng Việt**
- Phí thi: $5

### Bước 3: Thi thực hành
- Cần có xe để thi (bảo hiểm còn hiệu lực)
- Thời gian thi khoảng 15-20 phút

## Địa điểm DMV tại Oahu

- **Kapolei**: 1043 Makepono St
- **Honolulu**: 1199 Dillingham Blvd
- **Kaneohe**: 46-024 Kamehameha Hwy

## Lệ phí

| Loại bằng | Phí |
|-----------|-----|
| Bằng lái 8 năm | $40 |
| Bằng lái 4 năm (65+ tuổi) | $5 |

---
*Cập nhật: Tháng 1, 2026*`,
    contentEn: `# Guide to Getting a Driver\'s License in Hawaii\n\nStep-by-step guide for getting your Hawaii driver\'s license.`,
    contentType: 'GUIDE',
  },
  {
    categoryId: 2,
    slug: 'huong-dan-mo-tai-khoan-ngan-hang',
    titleVn: 'Hướng dẫn mở tài khoản ngân hàng tại Hawaii',
    titleEn: 'How to Open a Bank Account in Hawaii',
    excerptVn: 'So sánh các ngân hàng phổ biến và hướng dẫn từng bước mở tài khoản.',
    excerptEn: 'Compare popular banks and get step-by-step instructions.',
    contentVn: `# Hướng dẫn mở tài khoản ngân hàng tại Hawaii

## Các ngân hàng phổ biến

### Bank of Hawaii
- Ngân hàng lớn nhất Hawaii
- Nhiều chi nhánh và ATM
- Có nhân viên nói tiếng Việt tại một số chi nhánh

### First Hawaiian Bank
- Lịch sử lâu đời
- Dịch vụ khách hàng tốt

### American Savings Bank
- Phí thấp
- Thân thiện với người mới

### Credit Unions
- **Hawaii State FCU**: Phí thấp, lãi suất tốt
- **HawaiiUSA FCU**: Dễ đăng ký

## Giấy tờ cần thiết

1. **ID có ảnh**: Hộ chiếu, thẻ xanh, hoặc State ID
2. **SSN**: Social Security Number
3. **Proof of Address**: Hóa đơn điện/nước
4. **Tiền đặt cọc ban đầu**: $25-100

## Các loại tài khoản

### Checking Account
- Dùng cho chi tiêu hàng ngày
- Có debit card, có thể viết check

### Savings Account
- Để dành tiền
- Lãi suất cao hơn checking

---
*Liên hệ VietHawaii nếu cần giúp đỡ dịch thuật*`,
    contentEn: `# How to Open a Bank Account in Hawaii\n\nGuide to opening checking and savings accounts.`,
    contentType: 'GUIDE',
  },
  {
    categoryId: 2,
    slug: 'huong-dan-dang-ky-bao-hiem-y-te',
    titleVn: 'Hướng dẫn đăng ký bảo hiểm y tế tại Hawaii',
    titleEn: 'Guide to Health Insurance in Hawaii',
    excerptVn: 'Tìm hiểu về các loại bảo hiểm y tế và cách đăng ký cho cá nhân và gia đình.',
    excerptEn: 'Learn about health insurance types and how to enroll.',
    contentVn: `# Hướng dẫn đăng ký bảo hiểm y tế tại Hawaii

## Tại sao cần bảo hiểm y tế?

Hawaii là một trong những tiểu bang có chi phí y tế cao nhất. Một lần đi cấp cứu có thể tốn $5,000-$20,000 nếu không có bảo hiểm.

## Các loại bảo hiểm

### 1. Bảo hiểm qua công ty (Employer-sponsored)
- Phổ biến nhất tại Hawaii
- Công ty trả một phần, bạn trả một phần
- Bắt buộc theo luật Hawaii nếu làm 20+ giờ/tuần

### 2. Medicaid (QUEST)
- Dành cho người thu nhập thấp
- Miễn phí hoặc rất rẻ
- Đăng ký tại: mybenefits.hawaii.gov

### 3. Medicare
- Dành cho người 65+ tuổi
- Hoặc người khuyết tật

### 4. Marketplace (ACA)
- Mua trực tiếp qua healthcare.gov
- Có thể được trợ cấp tùy thu nhập

## Các hãng bảo hiểm tại Hawaii

- **HMSA** (Hawaii Medical Service Association): Lớn nhất
- **Kaiser Permanente**: Mô hình HMO
- **UnitedHealthcare**
- **AlohaCare**: Cho QUEST

## Cách đăng ký

1. Nếu có việc làm: Hỏi HR của công ty
2. Thu nhập thấp: Đăng ký QUEST tại mybenefits.hawaii.gov
3. Tự mua: healthcare.gov (mở đăng ký tháng 11-1)

---
*Lưu ý: Thông tin có thể thay đổi, luôn kiểm tra nguồn chính thức*`,
    contentEn: `# Guide to Health Insurance in Hawaii\n\nUnderstanding health insurance options in Hawaii.`,
    contentType: 'GUIDE',
  },

  // ===== CỘNG ĐỒNG (Community) - Category 4 =====
  {
    categoryId: 4,
    slug: 'hoi-nguoi-viet-hawaii-hop-mat',
    titleVn: 'Hội Người Việt Hawaii tổ chức họp mặt thường niên',
    titleEn: 'Vietnamese Association of Hawaii Annual Gathering',
    excerptVn: 'Sự kiện họp mặt kết nối các thành viên trong cộng đồng.',
    excerptEn: 'Annual gathering connects community members.',
    contentVn: `# Họp mặt thường niên Hội Người Việt Hawaii

## Sự kiện kết nối cộng đồng

Hội Người Việt Hawaii vừa tổ chức buổi họp mặt thường niên, quy tụ hơn 200 thành viên và khách mời.

## Báo cáo hoạt động năm qua

- Hỗ trợ 50 gia đình mới định cư
- Tổ chức 12 sự kiện văn hóa
- Quyên góp $25,000 cho quỹ học bổng

## Kế hoạch năm mới

- Mở lớp tiếng Việt cho trẻ em
- Tổ chức Tết Trung Thu
- Chương trình mentorship cho sinh viên

## Cách tham gia Hội

1. Đăng ký thành viên trên website
2. Tham gia group Facebook "Người Việt Hawaii"
3. Đến các sự kiện do Hội tổ chức

---
*Hội Người Việt Hawaii được thành lập năm 1995*`,
    contentEn: `# Vietnamese Association of Hawaii Annual Gathering\n\nConnecting the Vietnamese community in Hawaii.`,
    contentType: 'ARTICLE',
  },
  {
    categoryId: 4,
    slug: 'cau-chuyen-thanh-cong-chu-nha-hang',
    titleVn: 'Câu chuyện thành công: Từ du học sinh đến chủ nhà hàng',
    titleEn: 'Success Story: From International Student to Restaurant Owner',
    excerptVn: 'Hành trình đầy cảm hứng của chị Mai Trần.',
    excerptEn: 'The inspiring journey of Mai Tran.',
    contentVn: `# Từ du học sinh đến chủ nhà hàng

## Hành trình của chị Mai Trần

Chị Mai Trần, 35 tuổi, đến Hawaii năm 2010 với tư cách du học sinh. Sau 15 năm, chị hiện là chủ của 3 nhà hàng Việt Nam tại Honolulu.

## Những ngày đầu khó khăn

"Tôi đến Mỹ với $2,000 trong túi và tiếng Anh còn rất kém. Những năm đầu, tôi vừa đi học vừa làm thêm tại nhà hàng."

## Bài học kinh doanh

1. **Chất lượng là số 1**: Không thỏa hiệp về nguyên liệu
2. **Hiểu khách hàng**: Điều chỉnh menu phù hợp
3. **Xây dựng đội ngũ**: Nhân viên được đối xử tốt sẽ phục vụ khách tốt
4. **Tham gia cộng đồng**: Hỗ trợ các sự kiện Việt Nam

## Lời khuyên

"Đừng sợ khó, đừng sợ thất bại. Hawaii là nơi tuyệt vời cho người Việt vì văn hóa đa dạng và mọi người rất open-minded."

---
*Bài viết thuộc series "Câu chuyện thành công người Việt tại Hawaii"*`,
    contentEn: `# From International Student to Restaurant Owner\n\nMai Tran\'s inspiring journey in Hawaii.`,
    contentType: 'ARTICLE',
  },
  {
    categoryId: 4,
    slug: 'lop-tieng-viet-cho-tre-em',
    titleVn: 'Lớp tiếng Việt cho trẻ em tại Hawaii mở đăng ký',
    titleEn: 'Vietnamese Language Classes for Children Now Enrolling',
    excerptVn: 'Giúp con em giữ gìn tiếng Việt và văn hóa Việt Nam.',
    excerptEn: 'Help children maintain Vietnamese language and culture.',
    contentVn: `# Lớp tiếng Việt cho trẻ em tại Hawaii

## Giới thiệu chương trình

Chương trình dạy tiếng Việt cho trẻ em được tổ chức hàng tuần, giúp các em giữ gìn ngôn ngữ và văn hóa Việt Nam.

## Thông tin lớp học

- **Thời gian**: Chủ nhật hàng tuần, 9AM - 12PM
- **Địa điểm**: Chùa Việt Nam Hawaii, Pearl City
- **Độ tuổi**: 5-15 tuổi
- **Học phí**: $50/tháng (hỗ trợ cho gia đình khó khăn)

## Nội dung giảng dạy

- Đọc và viết tiếng Việt
- Hát những bài hát thiếu nhi Việt Nam
- Học về lịch sử và văn hóa Việt Nam
- Các hoạt động vui chơi, trò chơi dân gian

## Đăng ký

- Liên hệ: (808) 555-0123
- Email: tiengviet@viethawaii.org
- Hoặc đăng ký trực tiếp tại lớp học

---
*Số lượng có hạn, đăng ký sớm!*`,
    contentEn: `# Vietnamese Language Classes for Children\n\nWeekly classes to help children maintain their Vietnamese heritage.`,
    contentType: 'ARTICLE',
  },

  // ===== ẨM THỰC (Food) - Category 5 =====
  {
    categoryId: 5,
    slug: 'cong-thuc-pho-bo-tai-nha',
    titleVn: 'Công thức nấu phở bò tại nhà đơn giản',
    titleEn: 'Simple Homemade Beef Pho Recipe',
    excerptVn: 'Hướng dẫn chi tiết cách nấu phở bò thơm ngon ngay tại nhà.',
    excerptEn: 'Detailed guide to making delicious beef pho at home.',
    contentVn: `# Công thức nấu phở bò tại nhà

## Nguyên liệu (cho 6-8 người)

### Nước dùng
- 3 lbs xương bò (beef bones)
- 2 lbs gầu bò (beef brisket)
- 1 củ gừng lớn
- 2 củ hành tây lớn
- 5 star anise (hoa hồi)
- 6 whole cloves (đinh hương)
- 2 cinnamon sticks (quế)
- 3 tbsp fish sauce
- 1 tbsp sugar

### Topping
- 1 lb thịt bò tái (eye round, thái mỏng)
- Bánh phở
- Giá đỗ, rau húng quế, ngò gai
- Chanh, ớt, tương đen, tương ớt

## Cách nấu

### Bước 1: Chuẩn bị xương
1. Rửa sạch xương bò
2. Đun sôi, bỏ nước đầu tiên
3. Rửa lại xương

### Bước 2: Nướng hành gừng
Nướng cho đến khi cháy vỏ ngoài, cạo bỏ phần cháy.

### Bước 3: Nấu nước dùng
Nấu liu riu 3-4 giờ, vớt bọt thường xuyên.

### Bước 4: Hoàn thành
Chan nước dùng nóng lên bánh phở và thịt.

## Mua nguyên liệu ở đâu

- **Xương bò, thịt bò**: Costco, Don Quijote
- **Gia vị**: Chinatown, Don Quijote
- **Bánh phở**: Marukai, Don Quijote

---
*Thời gian chuẩn bị: 30 phút | Thời gian nấu: 4 giờ*`,
    contentEn: `# Simple Homemade Beef Pho Recipe\n\nMake authentic Vietnamese pho at home.`,
    contentType: 'GUIDE',
  },
  {
    categoryId: 5,
    slug: 'banh-mi-viet-o-hawaii',
    titleVn: 'Những tiệm bánh mì Việt ngon nhất tại Hawaii',
    titleEn: 'Best Vietnamese Banh Mi in Hawaii',
    excerptVn: 'Danh sách những tiệm bánh mì Việt Nam được yêu thích nhất.',
    excerptEn: 'Top-rated Vietnamese banh mi shops.',
    contentVn: `# Những tiệm bánh mì Việt ngon nhất tại Hawaii

## 1. Ba Le Sandwich Shop
- **Địa chỉ**: 150 N King St, Chinatown
- **Đặc sản**: Bánh mì thịt nguội truyền thống
- **Giá**: $6-8
- **Đánh giá**: Bánh mì ngon nhất Honolulu theo nhiều người

## 2. Pig & The Lady
- **Địa chỉ**: 83 N King St
- **Đặc sản**: Bánh mì fusion cao cấp
- **Giá**: $12-15
- **Đánh giá**: Phiên bản hiện đại, sáng tạo

## 3. Lee's Bakery
- **Địa chỉ**: 1236 S King St
- **Đặc sản**: Bánh mì giá rẻ, phục vụ nhanh
- **Giá**: $5-7
- **Đánh giá**: Giá tốt, đông khách

## 4. Pho 97
- **Địa chỉ**: 1040 S King St
- **Đặc sản**: Bánh mì đi kèm phở
- **Giá**: $6-8

## Bánh mì gồm những gì?

- Bánh mì Pháp (giòn bên ngoài, mềm bên trong)
- Thịt (chả lụa, thịt nguội, pa-tê, hoặc thịt nướng)
- Đồ chua (cà rốt, củ cải ngâm)
- Rau (ngò, dưa leo, ớt)
- Nước sốt (mayonnaise, nước tương)

---
*Bạn có tiệm bánh mì yêu thích? Chia sẻ với VietHawaii!*`,
    contentEn: `# Best Vietnamese Banh Mi in Hawaii\n\nTop banh mi shops in Honolulu.`,
    contentType: 'ARTICLE',
  },
  {
    categoryId: 5,
    slug: 'cho-viet-tai-honolulu',
    titleVn: 'Hướng dẫn đi chợ Việt tại Honolulu',
    titleEn: 'Guide to Vietnamese Markets in Honolulu',
    excerptVn: 'Tìm hiểu các chợ Việt và cửa hàng bán thực phẩm Việt Nam.',
    excerptEn: 'Find Vietnamese markets and grocery stores.',
    contentVn: `# Hướng dẫn đi chợ Việt tại Honolulu

## Chinatown - Trung tâm mua sắm

Khu vực Chinatown (đường Maunakea, River, King) là nơi tập trung nhiều cửa hàng thực phẩm Á Đông nhất.

### Các cửa hàng nổi bật

**Oahu Market**
- Địa chỉ: 145 N King St
- Đặc điểm: Chợ truyền thống, có thịt tươi, rau củ, hải sản

**Sing Cheong Yuan**
- Địa chỉ: 1027 Maunakea St
- Đặc điểm: Bánh, thực phẩm khô

## Các siêu thị Á Đông

### Don Quijote (Kaheka)
- **Địa chỉ**: 801 Kaheka St
- **Giờ mở cửa**: 24/7
- **Đặc điểm**: Siêu thị Nhật, có nhiều đồ Việt
- **Tìm thấy**: Nước mắm, bánh phở, rau Việt, đồ đông lạnh

### Marukai
- **Địa chỉ**: 2310 Kuhio Ave (Waikiki) và nhiều địa điểm khác
- **Đặc điểm**: Siêu thị Nhật, giá phải chăng

### H Mart
- **Địa chỉ**: Kaka'ako (đang xây dựng)
- **Đặc điểm**: Siêu thị Hàn, nhiều đồ Á Đông

## Mua online

- **Amazon**: Nước mắm, bánh phở khô, gia vị
- **Weee!**: App giao hàng thực phẩm Á Đông

---
*Mẹo: Đi chợ Chinatown vào buổi sáng sớm để có đồ tươi nhất*`,
    contentEn: `# Guide to Vietnamese Markets in Honolulu\n\nWhere to find Vietnamese groceries.`,
    contentType: 'GUIDE',
  },

  // ===== DU LỊCH (Travel) - Category 7 =====
  {
    categoryId: 7,
    slug: 'dia-diem-du-lich-oahu',
    titleVn: '10 địa điểm du lịch không thể bỏ qua tại Oahu',
    titleEn: '10 Must-Visit Places in Oahu',
    excerptVn: 'Danh sách những điểm đến hấp dẫn nhất Oahu.',
    excerptEn: 'List of the most attractive destinations in Oahu.',
    contentVn: `# 10 địa điểm du lịch không thể bỏ qua tại Oahu

## 1. Waikiki Beach
Bãi biển nổi tiếng nhất Hawaii. Bơi, lướt sóng, ngắm hoàng hôn.

## 2. Diamond Head
Núi lửa biểu tượng. Leo núi 1.6 miles. Phí: $5/người.

## 3. Pearl Harbor
Di tích lịch sử WWII. USS Arizona Memorial. Miễn phí (đặt vé trước online).

## 4. North Shore
Vùng lướt sóng nổi tiếng thế giới. Shrimp trucks ngon.

## 5. Hanauma Bay
Vịnh san hô tuyệt đẹp. Snorkeling. $25/người.

## 6. Lanikai Beach
Bãi biển đẹp nhất Oahu. Đến trước 8AM.

## 7. Kualoa Ranch
Nơi quay phim Jurassic Park. Tour ATV, zip line.

## 8. Polynesian Cultural Center
Trải nghiệm văn hóa Polynesian. Cần cả ngày.

## 9. Chinatown
Khu phố cổ đa văn hóa. Ăn uống, mua sắm.

## 10. Ala Moana Beach Park
Bãi biển yên bình, ít sóng. BBQ, volleyball.

## Mẹo tiết kiệm

1. **Go Oahu Card**: Tiết kiệm 40%
2. **TheBus**: $3/chuyến, $7.50/ngày unlimited
3. **Picnic**: Mang đồ ăn thay vì ăn nhà hàng`,
    contentEn: `# 10 Must-Visit Places in Oahu\n\nTop attractions in Oahu, Hawaii.`,
    contentType: 'GUIDE',
  },
  {
    categoryId: 7,
    slug: 'du-lich-neighbor-islands',
    titleVn: 'Hướng dẫn du lịch các đảo láng giềng từ Oahu',
    titleEn: 'Guide to Visiting Neighbor Islands from Oahu',
    excerptVn: 'Mẹo đặt vé máy bay, khách sạn và lịch trình du lịch Maui, Big Island, Kauai.',
    excerptEn: 'Tips for visiting Maui, Big Island, and Kauai.',
    contentVn: `# Du lịch các đảo láng giềng từ Oahu

## Các đảo chính

### Maui (Valley Isle)
- **Nổi tiếng**: Road to Hana, Haleakala sunrise
- **Thời gian**: 3-5 ngày
- **Bay**: 30-40 phút, $80-150 round trip

### Big Island (Hawaii Island)
- **Nổi tiếng**: Núi lửa Kilauea, Mauna Kea
- **Thời gian**: 4-6 ngày
- **Bay**: 45 phút, $100-180 round trip

### Kauai (Garden Isle)
- **Nổi tiếng**: Na Pali Coast, Waimea Canyon
- **Thời gian**: 3-4 ngày
- **Bay**: 30 phút, $80-150 round trip

## Hãng hàng không

- **Hawaiian Airlines**: Nhiều chuyến, có checked bag miễn phí
- **Southwest Airlines**: Giá rẻ hơn, 2 checked bags miễn phí

## Mẹo đặt vé

1. Đặt sớm 2-3 tuần
2. Bay giữa tuần rẻ hơn
3. Tránh peak season (tháng 12, mùa hè)

## Chi phí ước tính (1 người, 3-4 ngày)

| Hạng mục | Giá |
|----------|-----|
| Vé máy bay | $80-150 |
| Khách sạn | $150-300/đêm |
| Thuê xe | $50-100/ngày |
| Tổng | $700-1,500 |

---
*Mẹo: Đi cùng nhóm bạn để chia tiền*`,
    contentEn: `# Guide to Visiting Neighbor Islands\n\nTips for island hopping in Hawaii.`,
    contentType: 'GUIDE',
  },
  {
    categoryId: 7,
    slug: 'hiking-trails-oahu',
    titleVn: 'Những đường leo núi đẹp nhất tại Oahu',
    titleEn: 'Best Hiking Trails in Oahu',
    excerptVn: 'Khám phá thiên nhiên Hawaii qua những đường hiking tuyệt vời.',
    excerptEn: 'Explore Hawaii nature through beautiful hiking trails.',
    contentVn: `# Những đường leo núi đẹp nhất tại Oahu

## Dành cho người mới bắt đầu

### 1. Diamond Head
- **Độ dài**: 1.6 miles round trip
- **Độ khó**: Dễ
- **View**: Toàn cảnh Waikiki và biển
- **Phí**: $5/người

### 2. Manoa Falls
- **Độ dài**: 1.6 miles round trip
- **Độ khó**: Dễ
- **View**: Thác nước đẹp
- **Mẹo**: Mang giày chống trượt, đường bùn

### 3. Makapu'u Point Lighthouse
- **Độ dài**: 2 miles round trip
- **Độ khó**: Dễ
- **View**: Đường bờ biển, có thể thấy cá voi mùa đông

## Dành cho người có kinh nghiệm

### 4. Koko Head Crater
- **Độ dài**: 1.8 miles round trip
- **Độ khó**: Khó (1,000+ bậc thang)
- **View**: 360 độ toàn đảo
- **Mẹo**: Đi sớm tránh nắng

### 5. Lanikai Pillbox
- **Độ dài**: 2 miles round trip
- **Độ khó**: Trung bình
- **View**: Lanikai Beach từ trên cao

## Lưu ý an toàn

- Mang đủ nước (1-2 lít/người)
- Đội mũ, bôi kem chống nắng
- Đi theo nhóm
- Kiểm tra thời tiết trước khi đi
- Không đi khi trời mưa (đường trơn)

---
*Hawaii có nhiều đường hiking đẹp, nhưng luôn đặt an toàn lên hàng đầu!*`,
    contentEn: `# Best Hiking Trails in Oahu\n\nExplore Oahu\'s beautiful hiking trails.`,
    contentType: 'GUIDE',
  },
];

async function main() {
  console.log('🌺 Seeding more articles for VietHawaii...\n');

  let created = 0;
  let skipped = 0;

  for (const article of articles) {
    try {
      const existing = await db.article.findUnique({
        where: { slug: article.slug },
      });

      if (existing) {
        console.log(`⏭️  Skipped (exists): ${article.titleVn}`);
        skipped++;
        continue;
      }

      await db.article.create({
        data: {
          authorId: AUTHOR_ID,
          categoryId: article.categoryId,
          slug: article.slug,
          titleVn: article.titleVn,
          titleEn: article.titleEn,
          excerptVn: article.excerptVn,
          excerptEn: article.excerptEn,
          contentVn: article.contentVn,
          contentEn: article.contentEn,
          contentType: article.contentType as any,
          status: 'PUBLISHED',
          publishedAt: new Date(),
          views: Math.floor(Math.random() * 500) + 50,
        },
      });

      console.log(`✅ Created: ${article.titleVn}`);
      created++;
    } catch (error) {
      console.error(`❌ Error creating "${article.titleVn}":`, error);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Seeding complete!`);
  console.log(`   Created: ${created} articles`);
  console.log(`   Skipped: ${skipped} articles`);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
