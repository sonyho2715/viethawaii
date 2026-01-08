import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

// Unsplash images (free to use, high quality)
const IMAGES = {
  tet: 'https://images.unsplash.com/photo-1548695607-9c73430ba065?w=1200&q=80', // Lunar new year lanterns
  pho: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1200&q=80', // Pho bowl
  restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80', // Restaurant
  driving: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&q=80', // Driving
  bank: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=1200&q=80', // Bank
  health: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80', // Healthcare
  community: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80', // Community gathering
  success: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80', // Restaurant owner
  kids: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80', // Kids learning
  banhmi: 'https://images.unsplash.com/photo-1600688640154-9619e002df30?w=1200&q=80', // Banh mi
  market: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80', // Market
  waikiki: 'https://images.unsplash.com/photo-1507876466758-bc54f384809c?w=1200&q=80', // Waikiki beach
  hawaii: 'https://images.unsplash.com/photo-1542259009477-d625272157b7?w=1200&q=80', // Hawaii landscape
  hiking: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=80', // Hiking
  house: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80', // House rental
  job: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&q=80', // Job interview
  food: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&q=80', // Vietnamese food
};

const articleUpdates = [
  // ===== TIN TỨC =====
  {
    slug: 'cong-dong-viet-hawaii-tet-2026',
    featuredImage: IMAGES.tet,
    titleVn: 'Cộng đồng Việt Hawaii tổ chức Tết Nguyên Đán Bính Ngọ 2026 hoành tráng',
    contentVn: `# Tết Nguyên Đán Bính Ngọ 2026 tại Hawaii

![Lễ hội Tết](${IMAGES.tet})

## Sự kiện Tết lớn nhất năm

Cộng đồng người Việt tại Hawaii vừa tổ chức thành công lễ hội Tết Nguyên Đán 2026 (Năm Bính Ngọ) tại **Kapolei Community Park**, thu hút hơn **5,000 người** tham dự từ khắp các đảo.

Sự kiện năm nay đánh dấu năm thứ 15 liên tiếp cộng đồng Việt Nam tổ chức lễ hội Tết công cộng tại Oahu, với quy mô ngày càng lớn và thu hút nhiều du khách cũng như người dân địa phương từ các cộng đồng khác.

## Các hoạt động nổi bật

### Biểu diễn nghệ thuật
- **Múa lân sư rồng**: Đoàn múa lân Thăng Long từ California biểu diễn với 3 con rồng và 5 con lân
- **Áo dài show**: 50 người mẫu trình diễn áo dài từ truyền thống đến hiện đại
- **Văn nghệ**: Ca nhạc với các ca sĩ từ Việt Nam và địa phương, cải lương, hát quan họ Bắc Ninh

### Ẩm thực
Hơn **30 gian hàng** thức ăn Việt Nam phục vụ:
- Phở, bún bò Huế, bánh mì
- Bánh chưng, bánh tét, bánh dày
- Chè, nước mía, sinh tố
- Nem nướng, gỏi cuốn, chả giò

### Trò chơi dân gian
- Đập niêu đất
- Nhảy bao bố
- Kéo co
- Ô ăn quan
- Thi gói bánh chưng

### Khu vực trẻ em
- Lì xì đầu năm
- Tô màu tranh Tết
- Học viết thư pháp
- Trò chơi truyền thống

## Thông tin tổ chức

| Chi tiết | Thông tin |
|----------|-----------|
| Ngày tổ chức | Chủ nhật, 1 tháng 2, 2026 |
| Địa điểm | Kapolei Community Park |
| Thời gian | 10:00 AM - 6:00 PM |
| Vé vào cửa | Miễn phí |
| Parking | Miễn phí tại parking lot |

## Lời cảm ơn từ Ban Tổ Chức

> "Chúng tôi rất vui khi thấy cộng đồng Việt Nam tại Hawaii ngày càng lớn mạnh và đoàn kết. Tết năm nay là dịp để chúng ta cùng nhau gìn giữ văn hóa truyền thống, cho con cháu hiểu về nguồn cội của mình."
> 
> — Ông Nguyễn Văn Minh, Trưởng Ban Tổ Chức

## Các nhà tài trợ

Sự kiện được tổ chức với sự hỗ trợ của:
- Hội Người Việt Hawaii
- First Hawaiian Bank
- Bank of Hawaii
- Các doanh nghiệp Việt Nam tại Hawaii

## Thông tin sự kiện năm sau

**Tết 2027 (Năm Đinh Mùi)** dự kiến sẽ được tổ chức vào **cuối tháng 1, 2027** tại cùng địa điểm. 

Các tổ chức muốn **tham gia tài trợ** hoặc **đăng ký gian hàng**, xin liên hệ:
- Email: tet@viethawaii.org
- Điện thoại: (808) 555-0100

---

*📸 Ảnh và video sự kiện có thể xem trên Facebook: VietHawaii Community*

*Bài viết cập nhật: Tháng 2, 2026*`,
  },
  {
    slug: 'nha-hang-pho-saigon-khai-truong',
    featuredImage: IMAGES.pho,
    contentVn: `# Phở Sài Gòn Authentic khai trương tại Kalihi

![Phở Việt Nam](${IMAGES.pho})

## Địa điểm mới cho người yêu phở

Một nhà hàng phở mới mang tên **"Phở Sài Gòn Authentic"** vừa khai trương trên đường N. King Street, khu vực Kalihi, mang đến thêm một lựa chọn ẩm thực Việt cho cộng đồng người Việt và cư dân Hawaii.

Chủ nhà hàng, anh **Trần Văn Hùng**, người gốc Sài Gòn, đã dành 2 năm để hoàn thiện công thức nước dùng từ bà ngoại trước khi mở quán.

## Đặc điểm nổi bật

### Nước dùng gia truyền
- Hầm xương bò và gà **24 giờ** theo công thức gia truyền 3 đời
- Không sử dụng bột ngọt (MSG-free)
- Nước dùng trong vắt, ngọt tự nhiên

### Nguyên liệu tươi
- **Thịt bò**: Nhập từ ranch địa phương tại Big Island
- **Bánh phở**: Tự làm tại chỗ mỗi ngày
- **Rau thơm**: Từ farm hữu cơ tại Waimanalo

### Món đặc biệt
- **Phở tái**: Thịt bò tươi thái tại chỗ, chần trong nước dùng nóng
- **Phở đặc biệt**: Đầy đủ tái, nạm, gầu, gân, sách
- **Bánh cuốn**: Tráng tại chỗ mỗi sáng từ 7AM
- **Cà phê Việt**: Cà phê phin pha theo phong cách Sài Gòn với sữa đặc Longevity

## Menu và giá cả

| Món | Size nhỏ | Size lớn |
|-----|----------|----------|
| Phở đặc biệt | $14.95 | $17.95 |
| Phở tái | $12.95 | $15.95 |
| Phở chín | $12.95 | $15.95 |
| Phở gà | $12.95 | $15.95 |
| Bánh cuốn | $12.95 | - |
| Cơm tấm | $14.95 | - |
| Bún bò Huế | $14.95 | $17.95 |

*Giá chưa bao gồm thuế. Tất cả phở đều có thể thêm thịt với $3.*

## Thông tin liên hệ

| | |
|---|---|
| **Địa chỉ** | 1234 N. King Street, Honolulu, HI 96817 |
| **Điện thoại** | (808) 555-0199 |
| **Giờ mở cửa** | 7:00 AM - 9:00 PM |
| **Ngày nghỉ** | Thứ 2 hàng tuần |
| **Parking** | Parking lot miễn phí phía sau |

## Đánh giá ban đầu

> "Nước phở trong, ngọt tự nhiên, không bị mặn như nhiều quán khác. Bánh phở mềm vừa, thịt bò tươi thật sự. Sẽ quay lại!"
> — Chị Lan, khách hàng

> "Cuối cùng cũng có quán phở ở Hawaii giống Sài Gòn. Bánh cuốn tráng tại chỗ là điểm cộng lớn."
> — Anh Minh, khách hàng

## Khuyến mãi khai trương

🎉 **Giảm 15%** tất cả các món trong **2 tuần đầu** (đến hết 20/01/2026)

📱 Follow Instagram **@phosaigonhi** để nhận thêm ưu đãi

---

*Đây là bài viết giới thiệu nhà hàng mới, không phải quảng cáo có trả phí. Thông tin và giá có thể thay đổi.*`,
  },

  // ===== HƯỚNG DẪN =====
  {
    slug: 'huong-dan-xin-bang-lai-xe-hawaii',
    featuredImage: IMAGES.driving,
    contentVn: `# Hướng dẫn chi tiết xin bằng lái xe tại Hawaii (2026)

![Lái xe](${IMAGES.driving})

## Tổng quan

Bằng lái xe là giấy tờ quan trọng nhất khi sống tại Hawaii vì hệ thống giao thông công cộng còn hạn chế. Bài viết này hướng dẫn chi tiết từng bước để lấy bằng lái xe tại Hawaii.

## Giấy tờ cần chuẩn bị

### 1. Chứng minh danh tính (Primary ID)
Một trong các giấy tờ sau:
- ✅ Hộ chiếu Mỹ hoặc nước ngoài còn hiệu lực
- ✅ Thẻ xanh (Permanent Resident Card)
- ✅ Giấy phép lao động (EAD Card)
- ✅ Visa và I-94

### 2. Chứng minh Social Security Number
- ✅ Thẻ Social Security
- ✅ Thư xác nhận từ Social Security Administration
- ✅ W-2 hoặc 1099 có SSN

### 3. Chứng minh địa chỉ Hawaii (2 loại khác nhau)
- ✅ Hóa đơn điện/nước/gas (trong vòng 60 ngày)
- ✅ Hợp đồng thuê nhà
- ✅ Statement ngân hàng
- ✅ Thư từ cơ quan chính phủ

### 4. Bằng lái xe cũ (nếu có)
- Bằng lái từ tiểu bang khác
- Bằng lái quốc tế (kèm bằng gốc)

## Quy trình xin bằng lái

### Bước 1: Đăng ký lịch hẹn online

1. Truy cập website: **alohaq.honolulu.gov**
2. Tạo tài khoản
3. Chọn dịch vụ: "Driver License"
4. Chọn địa điểm và thời gian phù hợp

⚠️ **Lưu ý**: Lịch hẹn thường đầy trước 2-3 tuần. Đăng ký sớm!

### Bước 2: Thi lý thuyết (Written Test)

| Chi tiết | Thông tin |
|----------|-----------|
| Số câu hỏi | 30 câu trắc nghiệm |
| Điểm đậu | 24/30 câu (80%) |
| Ngôn ngữ | Có tiếng Việt |
| Phí thi | $5 (Honolulu County) |
| Thời gian | Không giới hạn |

**Nội dung thi:**
- Luật giao thông Hawaii
- Biển báo đường bộ
- Quy tắc an toàn
- Xử lý tình huống

**Tài liệu học:**
- Sách "Hawaii Driver Manual" (miễn phí tại DMV hoặc online)
- Có bản tiếng Việt
- Thi thử online: dmv-written-test.com/hawaii

### Bước 3: Thi thực hành (Road Test)

Sau khi đậu lý thuyết, bạn nhận được **Learner's Permit** và có thể đăng ký thi thực hành.

**Yêu cầu:**
- Có xe để thi (có thể mượn)
- Xe phải có bảo hiểm còn hiệu lực
- Phải có người trên 21 tuổi có bằng lái đi cùng khi đến thi
- Phí thi: Bao gồm trong phí bằng lái

**Nội dung thi:**
- Kiểm tra xe trước khi lái
- Ra khỏi chỗ đậu xe
- Rẽ trái, rẽ phải
- Chuyển làn đường
- Đậu xe song song (parallel parking)
- Dừng tại biển STOP
- Quan sát gương và điểm mù

**Thời gian thi**: 15-20 phút

### Bước 4: Nhận bằng lái

Sau khi đậu, bạn:
1. Chụp hình
2. Đóng phí
3. Nhận bằng tạm thời (giấy)
4. Bằng chính thức gửi về nhà trong 2-3 tuần

## Địa điểm DMV tại Oahu

| Địa điểm | Địa chỉ | Ghi chú |
|----------|---------|---------|
| **Kapolei** | 1043 Makepono St | Mới nhất, ít đông |
| **Honolulu (Dillingham)** | 1199 Dillingham Blvd | Lớn nhất, đông nhất |
| **Kaneohe** | 46-024 Kamehameha Hwy | Windward side |
| **Pearl City** | 98-350 Kamehameha Hwy | Central Oahu |
| **Wahiawa** | 822-A Kilani Ave | North Shore area |

## Bảng phí (Cập nhật 2026)

| Loại bằng | Phí |
|-----------|-----|
| Bằng lái 8 năm | $40 |
| Bằng lái 4 năm (65+ tuổi) | $20 |
| Bằng lái 2 năm | $25 |
| Đổi bằng từ tiểu bang khác | $5 |
| Thi lý thuyết | $5 (Honolulu) |
| Thi lại | $5 |
| Bằng REAL ID | Thêm $0 (miễn phí upgrade) |

## Mẹo thi đậu từ lần đầu

### Thi lý thuyết
1. ✅ Đọc kỹ sách Hawaii Driver Manual 2-3 lần
2. ✅ Làm bài thi thử online ít nhất 10 lần
3. ✅ Chú ý các con số: tốc độ, khoảng cách, nồng độ cồn
4. ✅ Học kỹ các biển báo

### Thi thực hành
1. ✅ Tập lái ít nhất **20 giờ** trước khi thi
2. ✅ **LUÔN dừng hoàn toàn** tại biển STOP (full stop)
3. ✅ Kiểm tra gương và quay đầu trước khi chuyển làn
4. ✅ Giữ tốc độ đúng quy định (không nhanh, không chậm quá)
5. ✅ Sử dụng đèn xi-nhan sớm
6. ✅ Giữ khoảng cách an toàn với xe trước

## Những lỗi thường gặp (tránh!)

❌ Không dừng hoàn toàn tại biển STOP (rolling stop)
❌ Không kiểm tra điểm mù khi chuyển làn
❌ Đậu xe song song chạm lề
❌ Vượt tốc độ quy định
❌ Không nhường đường cho người đi bộ

## Đổi bằng lái từ Việt Nam

Bằng lái Việt Nam **không được chấp nhận** để đổi trực tiếp. Bạn phải:
1. Thi lý thuyết
2. Thi thực hành
3. Như người mới hoàn toàn

**Bằng lái quốc tế (IDP)** chỉ có hiệu lực **1 năm** và phải kèm bằng lái gốc.

## Liên hệ hỗ trợ

- **DMV Hotline**: (808) 768-4385
- **Website**: honolulu.gov/csd
- **Đặt lịch hẹn**: alohaq.honolulu.gov

---

*📅 Cập nhật: Tháng 1, 2026*

*💡 Mẹo: Nếu cần phiên dịch khi thi, liên hệ VietHawaii để được hỗ trợ!*`,
  },
  {
    slug: 'huong-dan-mo-tai-khoan-ngan-hang',
    featuredImage: IMAGES.bank,
    contentVn: `# Hướng dẫn mở tài khoản ngân hàng tại Hawaii (2026)

![Ngân hàng](${IMAGES.bank})

## Tại sao cần tài khoản ngân hàng?

Khi sống tại Mỹ, tài khoản ngân hàng là **bắt buộc** để:
- Nhận lương (direct deposit)
- Trả bills (điện, nước, internet)
- Xây dựng credit history
- Thuê nhà (landlord cần kiểm tra)
- Mua xe, mua nhà sau này

## So sánh các ngân hàng tại Hawaii

### 🏦 Bank of Hawaii (BOH)

| Ưu điểm | Nhược điểm |
|---------|------------|
| Ngân hàng lớn nhất Hawaii | Phí cao hơn |
| 60+ chi nhánh, 400+ ATM | Yêu cầu balance cao để miễn phí |
| App mobile tốt | |
| Có nhân viên nói tiếng Việt | |

**Checking Account:**
- Phí hàng tháng: $8 (miễn nếu có $500 balance hoặc direct deposit)
- ATM ngoài mạng: $3/lần

### 🏦 First Hawaiian Bank (FHB)

| Ưu điểm | Nhược điểm |
|---------|------------|
| Lịch sử lâu đời (1858) | Ít ATM hơn BOH |
| Dịch vụ khách hàng tốt | |
| 44 chi nhánh tại Hawaii | |
| Ứng dụng Zelle miễn phí | |

**Checking Account:**
- Phí hàng tháng: $7 (miễn nếu có $300 balance hoặc direct deposit)
- ATM ngoài mạng: $2.50/lần

### 🏦 American Savings Bank (ASB)

| Ưu điểm | Nhược điểm |
|---------|------------|
| Phí thấp nhất trong 3 ngân hàng lớn | Ít chi nhánh hơn |
| Chương trình rewards tốt | |
| Thân thiện với người mới | |
| Online banking tốt | |

**Checking Account:**
- Phí hàng tháng: $5 (miễn nếu có direct deposit)
- ATM ngoài mạng: $2/lần

### 🏛️ Credit Unions (Khuyến khích!)

Credit unions là tổ chức phi lợi nhuận, thường có lãi suất và phí tốt hơn ngân hàng.

**Hawaii State FCU**
- Phí thấp, lãi suất savings cao
- Dễ qualify
- membership fee: $5 một lần

**HawaiiUSA FCU**
- Nhiều chi nhánh
- Auto loan rate tốt

**Aloha Pacific FCU**
- Mortgage rate tốt
- Thân thiện với người mới đến

## Giấy tờ cần thiết

### Bắt buộc:
1. ✅ **ID có ảnh**: Hộ chiếu, thẻ xanh, State ID, hoặc Driver's License
2. ✅ **Social Security Number**: Thẻ SSN hoặc ITIN
3. ✅ **Proof of Address**: Hóa đơn điện/nước, hợp đồng thuê nhà
4. ✅ **Tiền đặt cọc ban đầu**: $25-100 tùy ngân hàng

### Không bắt buộc nhưng có lợi:
- Employment letter
- Pay stub gần nhất
- Bằng lái xe Hawaii

## Các loại tài khoản

### 💳 Checking Account
- **Mục đích**: Chi tiêu hàng ngày
- **Đặc điểm**:
  - Có debit card
  - Có thể viết check
  - Không giới hạn số lần giao dịch
  - Lãi suất: 0% hoặc rất thấp
  - Có thể có phí hàng tháng (tránh bằng cách có direct deposit)

### 💰 Savings Account
- **Mục đích**: Để dành tiền
- **Đặc điểm**:
  - Lãi suất cao hơn checking (0.5% - 4% APY)
  - Giới hạn 6 lần rút/tháng (theo Regulation D)
  - Không có debit card (thường)
  - Tốt cho emergency fund

## Quy trình mở tài khoản

### Online (nhanh nhất):
1. Vào website ngân hàng
2. Chọn "Open Account"
3. Điền thông tin cá nhân
4. Upload giấy tờ
5. Chờ xác nhận (1-2 ngày làm việc)
6. Fund tài khoản

### Tại chi nhánh:
1. Mang đầy đủ giấy tờ
2. Gặp banker
3. Điền form
4. Đặt cọc tiền
5. Nhận debit card tạm thời
6. Card chính thức gửi về nhà (7-10 ngày)

## Mẹo quan trọng

### Tránh phí hàng tháng:
1. ✅ Set up **direct deposit** từ lương
2. ✅ Giữ **minimum balance** theo yêu cầu
3. ✅ Dùng ATM **trong mạng** của ngân hàng
4. ✅ Chọn **paperless statements**

### Xây dựng Credit Score:
Mở tài khoản ngân hàng là bước đầu tiên. Sau đó:

1. **Secured Credit Card**: Đặt cọc $200-500, dùng như credit card
2. **Credit Builder Loan**: Vay nhỏ để xây dựng history
3. **Authorized User**: Được thêm vào credit card người thân

**Timeline:**
- 0-6 tháng: Mở bank account, secured card
- 6-12 tháng: Credit score bắt đầu xuất hiện (650+)
- 12-24 tháng: Có thể apply unsecured card, auto loan

## Mobile Banking Tips

Hầu hết ngân hàng đều có app để:
- 📱 Check balance
- 📱 Transfer tiền (Zelle miễn phí)
- 📱 Deposit check bằng camera
- 📱 Pay bills
- 📱 Khóa/mở khóa card

## Liên hệ

| Ngân hàng | Điện thoại | Website |
|-----------|------------|---------|
| Bank of Hawaii | (888) 643-3888 | boh.com |
| First Hawaiian Bank | (888) 844-4444 | fhb.com |
| American Savings Bank | (808) 627-6900 | asbhawaii.com |
| Hawaii State FCU | (808) 587-2700 | hsfcu.com |

---

*📅 Cập nhật: Tháng 1, 2026*

*💡 Liên hệ VietHawaii nếu cần giúp đỡ dịch thuật khi mở tài khoản!*`,
  },
  {
    slug: 'huong-dan-dang-ky-bao-hiem-y-te',
    featuredImage: IMAGES.health,
    contentVn: `# Hướng dẫn đăng ký bảo hiểm y tế tại Hawaii (2026)

![Bảo hiểm y tế](${IMAGES.health})

## Tại sao bảo hiểm y tế quan trọng?

Hawaii là một trong những tiểu bang có **chi phí y tế cao nhất** nước Mỹ:

| Dịch vụ | Chi phí không có bảo hiểm |
|---------|---------------------------|
| Khám bệnh thông thường | $150 - $300 |
| Cấp cứu ER | $1,500 - $5,000 |
| Nhập viện 1 ngày | $2,500 - $10,000 |
| Phẫu thuật ruột thừa | $15,000 - $40,000 |
| Sinh con | $10,000 - $25,000 |

**Không có bảo hiểm = Rủi ro phá sản nếu bệnh nặng!**

## Các loại bảo hiểm y tế

### 1. 🏢 Employer-Sponsored Insurance (Bảo hiểm qua công ty)

**Đặc điểm:**
- Phổ biến nhất tại Hawaii
- Công ty trả 50-80%, bạn trả phần còn lại
- **Hawaii là tiểu bang duy nhất** bắt buộc công ty cung cấp bảo hiểm nếu nhân viên làm 20+ giờ/tuần (Prepaid Health Care Act)

**Chi phí trung bình:**
- Cá nhân: $50-200/tháng (phần bạn đóng)
- Gia đình: $200-600/tháng

**Cách đăng ký:**
- Liên hệ HR khi bắt đầu làm việc
- Thường có 30 ngày để enroll

### 2. 🏥 Medicaid (QUEST Integration)

**Dành cho:**
- Thu nhập thấp (dưới 138% Federal Poverty Level)
- Khoảng $20,000/năm cho cá nhân
- $41,000/năm cho gia đình 4 người

**Chi phí:** Miễn phí hoặc rất thấp

**Đăng ký:** 
- Online: **mybenefits.hawaii.gov**
- Điện thoại: (808) 524-3370
- Tại văn phòng DHS

### 3. 👴 Medicare

**Dành cho:**
- Người 65 tuổi trở lên
- Người khuyết tật
- Bệnh thận giai đoạn cuối

**Các phần:**
- Part A: Bệnh viện (thường miễn phí)
- Part B: Bác sĩ ($174.70/tháng năm 2024)
- Part D: Thuốc
- Part C: Medicare Advantage (kết hợp tất cả)

### 4. 🛒 Marketplace (ACA/Obamacare)

**Dành cho:**
- Không có bảo hiểm qua công ty
- Không đủ điều kiện Medicaid

**Website:** healthcare.gov

**Open Enrollment:** 1 tháng 11 - 15 tháng 1 hàng năm

**Trợ cấp:**
- Dựa trên thu nhập
- Có thể giảm 50-90% chi phí

## Các hãng bảo hiểm tại Hawaii

### HMSA (Hawaii Medical Service Association)
- **Lớn nhất Hawaii** (>50% thị phần)
- Mạng lưới bác sĩ rộng nhất
- Plans: HMO, PPO, POS
- Website: hmsa.com

### Kaiser Permanente
- Mô hình **integrated care** (bác sĩ + bệnh viện + pharmacy cùng hệ thống)
- Facilities tập trung (Honolulu, Waipio)
- Tốt nếu sống gần Kaiser facility
- Website: kp.org/hawaii

### UnitedHealthcare
- Công ty bảo hiểm lớn quốc gia
- Nhiều plan options
- Good for travel coverage

### AlohaCare
- Chuyên về Medicaid/QUEST
- Nonprofit
- Tập trung cộng đồng thu nhập thấp

## So sánh plan types

| Loại | Flexibility | Chi phí | Cần referral? |
|------|-------------|---------|---------------|
| HMO | Thấp | Thấp nhất | Có |
| PPO | Cao | Cao hơn | Không |
| EPO | Trung bình | Trung bình | Không |
| POS | Trung bình | Trung bình | Có |

## Thuật ngữ quan trọng

| Thuật ngữ | Giải thích |
|-----------|------------|
| **Premium** | Phí hàng tháng bạn đóng |
| **Deductible** | Số tiền bạn phải trả trước khi bảo hiểm bắt đầu chi |
| **Copay** | Phí cố định mỗi lần khám ($20-50) |
| **Coinsurance** | % bạn trả sau khi đạt deductible (thường 20%) |
| **Out-of-pocket max** | Tổng tiền tối đa bạn trả/năm |
| **In-network** | Bác sĩ/bệnh viện trong mạng lưới (rẻ hơn) |
| **Out-of-network** | Ngoài mạng lưới (đắt hơn hoặc không cover) |

## Quy trình đăng ký

### Qua công ty:
1. Hỏi HR về enrollment period
2. So sánh các plan options
3. Chọn plan phù hợp
4. Điền enrollment form
5. Premiums sẽ trừ từ lương

### Qua Marketplace:
1. Tạo tài khoản tại healthcare.gov
2. Nhập thông tin thu nhập
3. Xem subsidy eligibility
4. So sánh plans
5. Chọn và đăng ký
6. Trả premium hàng tháng

### Qua Medicaid:
1. Vào mybenefits.hawaii.gov
2. Tạo tài khoản
3. Điền đơn xin
4. Upload giấy tờ (ID, proof of income, residence)
5. Chờ phê duyệt (30-45 ngày)

## Mẹo tiết kiệm

1. ✅ Luôn đi bác sĩ **in-network**
2. ✅ Dùng **generic drugs** thay vì brand name
3. ✅ Dùng **urgent care** thay vì ER khi có thể
4. ✅ Dùng **telehealth** cho vấn đề đơn giản
5. ✅ Kiểm tra **preventive care** miễn phí (checkup hàng năm)
6. ✅ Dùng **HSA/FSA** nếu có để tiết kiệm thuế

## Liên hệ hỗ trợ

| Tổ chức | Điện thoại | Website |
|---------|------------|---------|
| HMSA | (808) 948-6111 | hmsa.com |
| Kaiser | (808) 432-5955 | kp.org/hawaii |
| DHS (Medicaid) | (808) 524-3370 | mybenefits.hawaii.gov |
| Healthcare.gov | 1-800-318-2596 | healthcare.gov |

---

*📅 Cập nhật: Tháng 1, 2026*

*⚠️ Lưu ý: Thông tin có thể thay đổi. Luôn kiểm tra nguồn chính thức trước khi đăng ký.*`,
  },

  // Continue in next message due to length...
];

// Update articles
async function main() {
  console.log('🔄 Updating articles with images and expanded content...\n');

  let updated = 0;
  let notFound = 0;

  for (const article of articleUpdates) {
    try {
      const existing = await db.article.findUnique({
        where: { slug: article.slug },
      });

      if (!existing) {
        console.log(`⚠️  Not found: ${article.slug}`);
        notFound++;
        continue;
      }

      await db.article.update({
        where: { slug: article.slug },
        data: {
          featuredImage: article.featuredImage,
          contentVn: article.contentVn,
          ...(article.titleVn && { titleVn: article.titleVn }),
        },
      });

      console.log(`✅ Updated: ${article.slug}`);
      updated++;
    } catch (error) {
      console.error(`❌ Error updating "${article.slug}":`, error);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Update complete!`);
  console.log(`   Updated: ${updated} articles`);
  console.log(`   Not found: ${notFound} articles`);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
