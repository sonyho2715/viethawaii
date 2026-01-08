import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const IMAGES = {
  community: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80',
  success: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80',
  kids: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80',
  pho: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1200&q=80',
  banhmi: 'https://images.unsplash.com/photo-1600688640154-9619e002df30?w=1200&q=80',
  market: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80',
  waikiki: 'https://images.unsplash.com/photo-1507876466758-bc54f384809c?w=1200&q=80',
  hawaii: 'https://images.unsplash.com/photo-1542259009477-d625272157b7?w=1200&q=80',
  hiking: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=80',
  house: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80',
  job: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&q=80',
  food: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&q=80',
};

const articleUpdates = [
  // ===== CỘNG ĐỒNG =====
  {
    slug: 'hoi-nguoi-viet-hawaii-hop-mat',
    featuredImage: IMAGES.community,
    contentVn: `# Họp mặt thường niên Hội Người Việt Hawaii 2026

![Cộng đồng Việt Nam](${IMAGES.community})

## Sự kiện kết nối cộng đồng

Hội Người Việt Hawaii (Vietnamese Association of Hawaii) vừa tổ chức thành công buổi họp mặt thường niên lần thứ 30 tại **Ala Moana Hotel**, quy tụ hơn **200 thành viên** và khách mời.

Sự kiện đánh dấu 30 năm Hội được thành lập (1995-2025), với mục tiêu kết nối và hỗ trợ cộng đồng Việt Nam tại Hawaii.

## Báo cáo hoạt động năm qua

### Hỗ trợ cộng đồng
- 🏠 **50 gia đình** mới định cư được hỗ trợ tìm nhà, việc làm
- 📚 **25 học sinh** nhận học bổng ($1,000-$2,500 mỗi em)
- 🍲 **200 phần quà** Tết cho người cao tuổi
- 💊 **3 buổi** khám sức khỏe miễn phí

### Sự kiện văn hóa
- 🎊 Tết Nguyên Đán 2025 (5,000+ người tham dự)
- 🥮 Tết Trung Thu (1,500+ trẻ em)
- 🎤 Đêm nhạc gây quỹ ($15,000)
- 🏃 Giải chạy cộng đồng (300 người)

### Tài chính
- **Tổng thu**: $85,000
- **Tổng chi**: $78,000
- **Học bổng phát ra**: $25,000
- **Quỹ dự phòng**: $32,000

## Kế hoạch năm 2026

### Chương trình giáo dục
| Chương trình | Thời gian | Mục tiêu |
|--------------|-----------|----------|
| Lớp tiếng Việt cho trẻ em | Hàng tuần | 100 học sinh |
| ESL cho người lớn | 2 lần/tuần | 50 người |
| Workshop kỹ năng sống | Hàng tháng | Nhiều chủ đề |
| Mentorship cho sinh viên | Năm học | 20 cặp mentor |

### Sự kiện dự kiến
- **Tháng 2**: Tết Nguyên Đán 2026
- **Tháng 4**: Giỗ Tổ Hùng Vương
- **Tháng 6**: Picnic mùa hè
- **Tháng 9**: Tết Trung Thu
- **Tháng 11**: Lễ Tạ Ơn cộng đồng
- **Tháng 12**: Tiệc cuối năm

### Mục tiêu mới
- 📱 Ra mắt app VietHawaii Connect
- 🤝 Mở rộng partnership với các tổ chức khác
- 💼 Chương trình hỗ trợ khởi nghiệp
- 🏥 Hợp tác với bệnh viện cho translation services

## Ban Chấp Hành nhiệm kỳ 2026-2028

| Chức vụ | Họ tên |
|---------|--------|
| Hội trưởng | Ông Nguyễn Văn Minh |
| Phó Hội trưởng | Bà Trần Thị Lan |
| Thư ký | Cô Lê Hương |
| Thủ quỹ | Ông Phạm Đức |
| Trưởng ban Văn hóa | Bà Võ Kim Chi |
| Trưởng ban Thanh niên | Anh Đặng Hoàng |

## Cách tham gia Hội

### Thành viên chính thức
- **Phí hàng năm**: $25 cá nhân / $40 gia đình
- **Quyền lợi**: Tham gia bầu cử, giảm giá sự kiện, nhận newsletter

### Tình nguyện viên
- Không cần đóng phí
- Giúp tổ chức sự kiện
- Cơ hội networking

### Đăng ký
1. 📧 Email: membership@hoinguoiviethawaii.org
2. 🌐 Website: hoinguoiviethawaii.org/dangky
3. 📱 Facebook: Hội Người Việt Hawaii
4. 📞 Hotline: (808) 555-0101

## Đóng góp & Tài trợ

Mọi đóng góp đều được sử dụng cho:
- Học bổng sinh viên
- Hỗ trợ người mới định cư
- Bảo tồn văn hóa Việt

**Donation:**
- Zelle: donate@hoinguoiviethawaii.org
- Check: Vietnamese Association of Hawaii, PO Box 12345, Honolulu, HI 96814
- Tax-deductible (501c3 nonprofit)

---

*📅 Hội Người Việt Hawaii được thành lập năm 1995*

*📍 Văn phòng: 1234 Kapiolani Blvd, Suite 567, Honolulu, HI 96814*`,
  },
  {
    slug: 'cau-chuyen-thanh-cong-chu-nha-hang',
    featuredImage: IMAGES.success,
    contentVn: `# Câu chuyện thành công: Từ du học sinh đến chủ chuỗi nhà hàng

![Nhà hàng thành công](${IMAGES.success})

## Hành trình của chị Mai Trần

Chị **Mai Trần**, 35 tuổi, đến Hawaii năm 2010 với tư cách du học sinh tại **University of Hawaii at Manoa**. Sau 15 năm, chị hiện là chủ của **3 nhà hàng Việt Nam** tại Honolulu với hơn 40 nhân viên.

## Những ngày đầu khó khăn

> "Tôi đến Mỹ với **$2,000** trong túi và tiếng Anh còn rất kém. Ba mẹ tôi là nông dân ở Đồng Tháp, bán hết ruộng để cho tôi đi du học. Áp lực phải thành công rất lớn."

### Công việc đầu tiên
- **Năm 1**: Làm busser tại một nhà hàng Việt ở Chinatown
- **Lương**: $8/giờ + tips
- **Giờ làm**: 6PM-2AM, sau đó học sáng hôm sau

### Thăng tiến
- **Năm 2**: Được lên server
- **Năm 3**: Làm shift supervisor
- **Năm 4**: Quản lý nhà hàng

## Bước ngoặt

Năm 2014, sau khi tốt nghiệp ngành **Hospitality Management**, chị Mai được một nhà đầu tư địa phương tin tưởng cho vay $50,000 để mở nhà hàng đầu tiên.

> "Nhiều người hỏi sao không đi làm công ty lương cao hơn. Nhưng tôi thấy người Mỹ rất thích phở, mà nhiều nhà hàng phở ở đây không đủ authentic. Tôi muốn mang hương vị Việt Nam **thật sự** đến Hawaii."

### Nhà hàng đầu tiên (2014)
- **Địa điểm**: Keeaumoku Street
- **Vốn**: $50,000 vay + $20,000 tiết kiệm
- **Diện tích**: 1,200 sqft, 40 chỗ ngồi
- **Tháng đầu**: Lỗ $8,000
- **Tháng thứ 6**: Hòa vốn
- **Năm đầu**: Lãi $15,000

## Mở rộng

| Năm | Nhà hàng | Vị trí | Nhân viên |
|-----|----------|--------|-----------|
| 2014 | Mai's Kitchen | Keeaumoku St | 8 |
| 2018 | Mai's Express | Ala Moana Food Court | 12 |
| 2022 | Mai's Pho | Kapahulu Ave | 20 |

**Tổng doanh thu 2024**: Khoảng $2.5 triệu

## Bài học kinh doanh từ chị Mai

### 1. Chất lượng là số 1
> "Tôi không bao giờ thỏa hiệp về nguyên liệu. Xương bò phải từ local farm, không frozen. Rau thơm phải tươi mỗi ngày. Khách hàng biết sự khác biệt."

### 2. Hiểu khách hàng
- Điều chỉnh độ cay cho khẩu vị địa phương
- Thêm options cho vegetarian, gluten-free
- Giữ authentic nhưng accessible

### 3. Xây dựng đội ngũ
> "Tôi trả lương cao hơn mức trung bình 15-20%. Nhân viên gắn bó 5-7 năm rất nhiều. Họ là gia đình."

- Health insurance cho full-time
- Paid vacation
- Thưởng Tết
- Training và career path rõ ràng

### 4. Tham gia cộng đồng
- Tài trợ Tết hàng năm
- Donate cho học bổng sinh viên
- Mentorship cho người mới mở nhà hàng
- Tuyển dụng ưu tiên người Việt mới định cư

## Thất bại và bài học

### Food truck thất bại (2019)
- Đầu tư $40,000 vào food truck
- Đóng cửa sau 8 tháng
- **Bài học**: "Tôi không hiểu food truck market. Phở không phù hợp với format nhanh."

### COVID-19 (2020)
- Doanh thu giảm 70%
- Phải sa thải 15 nhân viên
- Pivot sang delivery và meal kits
- **Bài học**: "Đa dạng hóa revenue streams. Đừng bỏ tất cả trứng vào một giỏ."

## Lời khuyên cho người mới

### Cho người muốn mở nhà hàng:
1. ✅ Làm việc trong industry ít nhất 3-5 năm trước
2. ✅ Hiểu mọi position từ dishwasher đến manager
3. ✅ Tiết kiệm 6 tháng operating cost trước khi mở
4. ✅ Location, location, location
5. ✅ Marketing trên social media từ ngày đầu

### Cho người Việt mới đến Hawaii:
> "Đừng sợ khó, đừng sợ thất bại. Hawaii là nơi tuyệt vời cho người Việt vì văn hóa đa dạng và mọi người rất open-minded. Hãy bắt đầu từ nhỏ, làm tốt từng bước. Cộng đồng Việt ở đây rất supportive."

## Kế hoạch tương lai

- **2026**: Mở franchise đầu tiên (Big Island)
- **2027**: Ra mắt dòng sauce đóng chai
- **2028**: Cookbook "Mai's Kitchen Stories"

## Thông tin nhà hàng

| Nhà hàng | Địa chỉ | Giờ mở cửa |
|----------|---------|------------|
| Mai's Kitchen | 123 Keeaumoku St | 11AM-10PM |
| Mai's Express | Ala Moana Center | 10AM-9PM |
| Mai's Pho | 456 Kapahulu Ave | 7AM-9PM |

---

*📝 Bài viết thuộc series "Câu chuyện thành công người Việt tại Hawaii"*

*📧 Nếu bạn có câu chuyện muốn chia sẻ, liên hệ: stories@viethawaii.org*`,
  },
  {
    slug: 'lop-tieng-viet-cho-tre-em',
    featuredImage: IMAGES.kids,
    contentVn: `# Lớp tiếng Việt cho trẻ em tại Hawaii - Đăng ký ngay!

![Trẻ em học tiếng Việt](${IMAGES.kids})

## Giới thiệu chương trình

Chương trình **"Tiếng Việt cho Em"** được tổ chức hàng tuần nhằm giúp các em thiếu nhi Việt kiều tại Hawaii **giữ gìn ngôn ngữ và văn hóa** Việt Nam.

> "Ngôn ngữ là cầu nối giữa các thế hệ. Khi con cháu nói được tiếng Việt, chúng có thể giao tiếp với ông bà, hiểu được nguồn cội của mình."
> — Cô Nguyễn Thị Hoa, Trưởng ban giáo vụ

## Thông tin lớp học

| Chi tiết | Thông tin |
|----------|-----------|
| **Thời gian** | Chủ nhật hàng tuần, 9:00 AM - 12:00 PM |
| **Địa điểm** | Chùa Việt Nam Hawaii, 1123 N. King St, Pearl City |
| **Độ tuổi** | 5-15 tuổi |
| **Học phí** | $50/tháng (hỗ trợ cho gia đình khó khăn) |
| **Niên học** | Tháng 9 - Tháng 6 (nghỉ hè tháng 7-8) |

## Các lớp học

### Lớp Mầm (5-7 tuổi)
- Học bảng chữ cái
- Tập đọc cơ bản
- Hát thiếu nhi Việt Nam
- Tô màu, vẽ tranh

### Lớp Lá (8-10 tuổi)
- Đọc hiểu đoạn văn ngắn
- Viết câu đơn giản
- Từ vựng theo chủ đề (gia đình, trường học, động vật...)
- Học về lịch sử, địa lý Việt Nam cơ bản

### Lớp Hoa (11-15 tuổi)
- Đọc truyện ngắn, thơ
- Viết đoạn văn
- Hội thoại thực tế
- Văn hóa và lịch sử Việt Nam nâng cao

## Nội dung giảng dạy

### Ngôn ngữ
- ✍️ Đọc và viết tiếng Việt
- 🗣️ Phát âm chuẩn (miền Nam)
- 📖 Từ vựng theo chủ đề
- 💬 Hội thoại thực tế

### Văn hóa
- 🎵 Hát những bài hát thiếu nhi Việt Nam
- 📚 Học về lịch sử Việt Nam
- 🎭 Tìm hiểu các phong tục, lễ hội
- 🥢 Ẩm thực Việt Nam

### Hoạt động
- 🎨 Tô màu tranh dân gian
- 🎯 Trò chơi dân gian (ô ăn quan, nhảy dây...)
- 🎪 Biểu diễn văn nghệ cuối năm
- 🏕️ Field trips đến địa điểm Việt Nam tại Hawaii

## Đội ngũ giáo viên

- **8 giáo viên** tình nguyện (có bằng sư phạm hoặc kinh nghiệm giảng dạy)
- **4 trợ giảng** (sinh viên đại học)
- Tất cả đều nói tiếng Việt lưu loát
- Background check đầy đủ

## Lịch học chi tiết

| Thời gian | Hoạt động |
|-----------|-----------|
| 9:00 - 9:15 | Điểm danh, hát quốc ca Mỹ và Việt Nam |
| 9:15 - 10:15 | Học tiếng Việt (theo lớp) |
| 10:15 - 10:30 | Giải lao, ăn nhẹ |
| 10:30 - 11:15 | Học tiếng Việt (tiếp) |
| 11:15 - 11:45 | Hoạt động văn hóa/trò chơi |
| 11:45 - 12:00 | Tổng kết, chuẩn bị về |

## Các sự kiện đặc biệt

- **Tháng 2**: Biểu diễn Tết
- **Tháng 4**: Giỗ Tổ Hùng Vương (học về nguồn gốc dân tộc)
- **Tháng 5**: Ngày của Mẹ (làm thiệp tặng mẹ)
- **Tháng 6**: Lễ tốt nghiệp cuối năm
- **Tháng 9**: Tết Trung Thu (rước đèn, phá cỗ)

## Học phí và hỗ trợ

| Loại | Phí/tháng |
|------|-----------|
| 1 em | $50 |
| 2 em (cùng gia đình) | $80 |
| 3+ em | $100 |

**Hỗ trợ tài chính:**
- Giảm 50-100% cho gia đình khó khăn
- Liên hệ để được xem xét: support@tiengvietcboemhi.org

## Đăng ký

### Online:
🌐 tiengvietcboemhi.org/dangky

### Tại lớp:
📍 Đến trực tiếp vào Chủ nhật đầu tiên của tháng

### Liên hệ:
- 📞 (808) 555-0123
- 📧 tiengviet@viethawaii.org
- 📱 Facebook: Tiếng Việt cho Em Hawaii

## Phụ huynh nói gì?

> "Con tôi học ở đây 3 năm rồi. Bây giờ cháu nói chuyện được với bà ngoại ở Việt Nam qua video call. Tôi rất hạnh phúc."
> — Chị Linh, phụ huynh

> "Không chỉ học tiếng Việt, con tôi còn có bạn Việt Nam, hiểu về văn hóa. Đây là điều tôi không dạy được ở nhà."
> — Anh Tùng, phụ huynh

---

*📅 Năm học 2025-2026 bắt đầu từ Chủ nhật, 7 tháng 9, 2025*

*⚠️ Số lượng có hạn (25 em/lớp). Đăng ký sớm!*`,
  },

  // ===== DU LỊCH =====
  {
    slug: 'dia-diem-du-lich-oahu',
    featuredImage: IMAGES.waikiki,
    contentVn: `# 10 địa điểm du lịch không thể bỏ qua tại Oahu (2026)

![Waikiki Beach](${IMAGES.waikiki})

Oahu là đảo đông dân nhất Hawaii và là nơi tập trung nhiều địa điểm du lịch nổi tiếng. Dưới đây là hướng dẫn chi tiết cho 10 địa điểm bạn **nhất định phải đến**.

---

## 1. 🏖️ Waikiki Beach

**Bãi biển nổi tiếng nhất Hawaii**

| Chi tiết | Thông tin |
|----------|-----------|
| **Vị trí** | South Shore Honolulu |
| **Parking** | $3-5/giờ (street parking) hoặc hotel |
| **Hoạt động** | Bơi, lướt sóng, SUP, ngắm hoàng hôn |
| **Đông đúc nhất** | 10AM - 4PM |

**Mẹo:**
- ✅ Đến trước 8AM để có chỗ tốt
- ✅ Thuê surfboard: $20-30/giờ
- ✅ Sunset lúc 6-7PM rất đẹp
- ❌ Tránh để đồ giá trị trên bãi biển

---

## 2. 🌋 Diamond Head State Monument

**Núi lửa biểu tượng của Hawaii**

| Chi tiết | Thông tin |
|----------|-----------|
| **Đường đi** | 1.6 miles (2.6 km) round trip |
| **Độ khó** | Dễ đến trung bình |
| **Thời gian** | 1.5 - 2 giờ |
| **Phí** | $5/người + $10/xe (non-resident) |
| **Giờ mở** | 6AM - 6PM |

**Đặt vé:** Bắt buộc qua gostateparks.hawaii.gov (đặt trước 30 ngày)

**Mẹo:**
- ✅ Đi lúc 6-7AM để tránh nắng
- ✅ Mang 1 lít nước/người
- ✅ Đội mũ, bôi kem chống nắng
- ✅ Có 99 bậc thang + 1 đường hầm hẹp

---

## 3. ⚓ Pearl Harbor National Memorial

**Di tích lịch sử Thế chiến II**

| Chi tiết | Thông tin |
|----------|-----------|
| **Vé USS Arizona Memorial** | Miễn phí + $1 phí đặt chỗ |
| **Đặt vé** | recreation.gov (đặt trước 60 ngày) |
| **Giờ mở** | 7AM - 5PM |
| **Parking** | $7/ngày |
| **Thời gian tham quan** | 3-5 giờ |

**Lưu ý quan trọng:**
- ⚠️ KHÔNG được mang túi (có locker $5)
- ⚠️ Phải đến trước 1 giờ so với giờ đặt
- ✅ Có thể thăm thêm: USS Bowfin, USS Missouri, Aviation Museum (có phí riêng)

---

## 4. 🏄 North Shore

**Thủ đô lướt sóng thế giới**

| Chi tiết | Thông tin |
|----------|-----------|
| **Bãi biển chính** | Pipeline, Sunset Beach, Waimea Bay |
| **Sóng lớn** | Tháng 11 - Tháng 2 |
| **Parking** | Miễn phí (street parking) |
| **Từ Waikiki** | 1 - 1.5 giờ lái xe |

**Phải thử:**
- 🦐 **Giovanni's Shrimp Truck** - $15/phần
- 🍧 **Matsumoto Shave Ice** - $5
- 🐢 Xem rùa biển tại Laniakea Beach

**Mẹo:**
- ✅ Mùa đông: Xem sóng (đừng bơi nếu không chuyên nghiệp!)
- ✅ Mùa hè: Bơi an toàn hơn
- ❌ Không chạm vào rùa biển (bị phạt!)

---

## 5. 🐠 Hanauma Bay Nature Preserve

**Vịnh san hô tuyệt đẹp - Snorkeling #1 Oahu**

| Chi tiết | Thông tin |
|----------|-----------|
| **Phí** | $25/người (dưới 12 tuổi miễn phí) |
| **Parking** | $3 (cash only) |
| **Đặt vé** | Bắt buộc qua honolulu.gov |
| **Giờ mở** | 6:45AM - 4PM (đóng cửa Thứ 2, Thứ 3) |

**Bao gồm:**
- Video giáo dục 9 phút (bắt buộc xem)
- Tram ride xuống bãi biển

**Mẹo:**
- ✅ Đặt vé 2 ngày trước lúc 7AM (hết nhanh!)
- ✅ Thuê snorkel gear trước khi đến ($20 tại ABC Store)
- ✅ Đến sớm slot đầu tiên (6:45AM) để nước trong nhất
- ❌ Không chạm san hô, không cho cá ăn

---

## 6. 🏝️ Lanikai Beach

**Bãi biển đẹp nhất Oahu**

| Chi tiết | Thông tin |
|----------|-----------|
| **Vị trí** | Kailua, Windward side |
| **Parking** | Street parking (rất khó tìm!) |
| **Phí** | Miễn phí |
| **Từ Waikiki** | 30-40 phút |

**Đặc biệt:**
- Cát trắng mịn như bột
- Nước trong xanh ngọc
- View 2 đảo Mokulua (Na Mokulua)
- Kayak ra đảo: $50/2 người/nửa ngày

**Mẹo:**
- ✅ Đến trước 7AM để có parking
- ✅ Đi bộ từ Kailua Beach (dễ parking hơn)
- ✅ Tuyệt vời cho chụp ảnh lúc bình minh

---

## 7. 🦖 Kualoa Ranch

**Nơi quay phim Jurassic Park**

| Chi tiết | Thông tin |
|----------|-----------|
| **Vị trí** | 49-560 Kamehameha Hwy, Kaneohe |
| **Giá tour** | $50 - $200 tùy loại |
| **Thời gian** | 2 - 8 giờ tùy tour |

**Các tour phổ biến:**
| Tour | Giá | Thời gian |
|------|-----|-----------|
| Movie Sites Bus Tour | $55 | 90 phút |
| ATV Tour | $100 | 2 giờ |
| Zipline | $180 | 3 giờ |
| Horseback Riding | $130 | 2 giờ |

**Đặt trước:** kualoa.com (nên đặt 1 tuần trước)

---

## 8. 🎭 Polynesian Cultural Center

**Trải nghiệm văn hóa Polynesian**

| Chi tiết | Thông tin |
|----------|-----------|
| **Vị trí** | 55-370 Kamehameha Hwy, Laie |
| **Giờ mở** | 12PM - 9PM (đóng cửa Chủ nhật) |
| **Giá** | $70 - $230 tùy package |
| **Từ Waikiki** | 1 giờ lái xe |

**Bao gồm:**
- 6 làng văn hóa (Hawaii, Samoa, Fiji, Tonga, Tahiti, Aotearoa)
- Show "HA: Breath of Life" (tối)
- Buffet dinner (package cao hơn)

**Mẹo:**
- ✅ Chọn package có dinner + show
- ✅ Cần ít nhất 5-6 giờ để tham quan hết
- ✅ Mặc đồ thoải mái, đi giày bệt

---

## 9. 🏙️ Chinatown Honolulu

**Khu phố cổ đa văn hóa**

| Chi tiết | Thông tin |
|----------|-----------|
| **Vị trí** | Downtown Honolulu (N. King St, Maunakea St) |
| **Parking** | $2-5 tại parking lots |
| **Phí** | Miễn phí |
| **Thời gian** | 2-4 giờ |

**Phải làm:**
- 🍜 Ăn phở, dim sum, bún
- 🥩 Mua thịt/hải sản tươi tại Oahu Market
- 🎨 Xem street art, galleries
- 🛍️ Mua hàng tại các shop đặc sản

**Mẹo:**
- ✅ Đi buổi sáng (8-11AM) để xem chợ hoạt động
- ⚠️ Cẩn thận buổi tối muộn

---

## 10. 🏖️ Ala Moana Beach Park

**Bãi biển của người địa phương**

| Chi tiết | Thông tin |
|----------|-----------|
| **Vị trí** | 1201 Ala Moana Blvd |
| **Parking** | Miễn phí |
| **Phí** | Miễn phí |
| **Đặc điểm** | Sóng nhỏ, nước yên, có lifeguard |

**Hoàn hảo cho:**
- 👨‍👩‍👧‍👦 Gia đình có trẻ nhỏ
- 🏐 Chơi volleyball
- 🍖 BBQ (có khu vực BBQ)
- 🏃 Jogging, đạp xe

**Bonus:** Ngay cạnh **Ala Moana Shopping Center** - mall lớn nhất Hawaii!

---

## Mẹo tiết kiệm tổng hợp

| Mẹo | Tiết kiệm |
|-----|-----------|
| **Go Oahu Card** | Lên đến 40% cho nhiều attractions |
| **TheBus** | $3/chuyến hoặc $7.50/ngày không giới hạn |
| **Mang đồ ăn** | Thay vì ăn nhà hàng |
| **Hawaii resident** | Nhiều nơi miễn phí hoặc giảm giá với Hawaii ID |

---

*📅 Cập nhật: Tháng 1, 2026*

*💡 Giá và giờ mở cửa có thể thay đổi. Luôn kiểm tra website chính thức trước khi đi!*`,
  },
  {
    slug: 'hiking-trails-oahu',
    featuredImage: IMAGES.hiking,
    contentVn: `# Những đường leo núi đẹp nhất tại Oahu (2026)

![Hiking Hawaii](${IMAGES.hiking})

Oahu có hơn **100 đường hiking** từ dễ đến khó. Bài viết này giới thiệu **10 trails phổ biến nhất** với hướng dẫn chi tiết.

---

## 🟢 TRAILS DỄ (Beginner)

### 1. Diamond Head Summit Trail

**Trail nổi tiếng nhất Hawaii**

| Chi tiết | Thông tin |
|----------|-----------|
| **Độ dài** | 1.6 miles (2.6 km) round trip |
| **Độ cao** | 560 ft (170m) |
| **Thời gian** | 1.5 - 2 giờ |
| **Độ khó** | ⭐⭐ (Dễ) |
| **Phí** | $5/người + $10/xe |
| **Đặt vé** | gostateparks.hawaii.gov |

**Đặc điểm:**
- 99 bậc thang + 1 đường hầm
- View 360° toàn Honolulu và biển
- Có nhà vệ sinh ở trailhead

**Mẹo:** Đi lúc 6-7AM để tránh đông và nắng.

---

### 2. Manoa Falls Trail

**Thác nước trong rừng nhiệt đới**

| Chi tiết | Thông tin |
|----------|-----------|
| **Độ dài** | 1.6 miles (2.6 km) round trip |
| **Độ cao** | 800 ft (244m) |
| **Thời gian** | 1 - 1.5 giờ |
| **Độ khó** | ⭐⭐ (Dễ) |
| **Phí** | $5 parking |

**Đặc điểm:**
- Thác nước cao 150 ft
- Rừng nhiệt đới xanh mướt
- Đường có thể trơn sau mưa

**Mẹo:** 
- ✅ Mang giày chống trượt (không sandals!)
- ✅ Đừng bơi ở thác (có vi khuẩn leptospirosis)
- ✅ Mang thuốc chống muỗi

---

### 3. Makapuu Point Lighthouse Trail

**View bờ biển đông + có thể thấy cá voi**

| Chi tiết | Thông tin |
|----------|-----------|
| **Độ dài** | 2 miles (3.2 km) round trip |
| **Độ cao** | 500 ft (152m) |
| **Thời gian** | 1 - 1.5 giờ |
| **Độ khó** | ⭐⭐ (Dễ) |
| **Phí** | Miễn phí |
| **Parking** | Miễn phí (đầy sớm cuối tuần) |

**Đặc điểm:**
- Đường paved (xe lăn có thể đi được một phần)
- View đảo Rabbit Island và Makapu'u Beach
- **Tháng 12 - Tháng 4**: Có thể thấy cá voi humpback!

**Mẹo:** Không có bóng mát - đội mũ, mang nước.

---

## 🟡 TRAILS TRUNG BÌNH (Intermediate)

### 4. Lanikai Pillbox Trail (Kaiwa Ridge)

**Sunrise spot #1 của Oahu**

| Chi tiết | Thông tin |
|----------|-----------|
| **Độ dài** | 1.8 miles (2.9 km) round trip |
| **Độ cao** | 625 ft (190m) |
| **Thời gian** | 1.5 - 2 giờ |
| **Độ khó** | ⭐⭐⭐ (Trung bình) |
| **Phí** | Miễn phí |
| **Parking** | Street parking ở Kailua |

**Đặc điểm:**
- 2 bunkers WWII (pillboxes)
- View Lanikai Beach và Mokulua Islands từ trên cao
- Bình minh tuyệt đẹp

**Mẹo:**
- ✅ Đi lúc 5AM để xem sunrise
- ⚠️ Đoạn đầu dốc và trơn
- ✅ Mang headlamp nếu đi sớm

---

### 5. Koko Head Crater Stairs

**"Stairmaster from Hell" - 1,048 bậc thang!**

| Chi tiết | Thông tin |
|----------|-----------|
| **Độ dài** | 1.8 miles (2.9 km) round trip |
| **Độ cao** | 1,200 ft (366m) |
| **Thời gian** | 1 - 2 giờ |
| **Độ khó** | ⭐⭐⭐⭐ (Khó về thể lực) |
| **Phí** | Miễn phí |
| **Parking** | Miễn phí tại Koko Head District Park |

**Đặc điểm:**
- Cầu thang trên ray xe lửa cũ
- 1,048 bậc liên tục
- View 360° từ đỉnh

**Mẹo:**
- ✅ Đi lúc 5-6AM để tránh nắng nóng
- ✅ Mang 2 lít nước
- ⚠️ Không phù hợp người sợ độ cao
- ⚠️ Tránh đi sau mưa (trơn)

---

### 6. Waimea Falls Trail

**Thác nước có thể bơi được!**

| Chi tiết | Thông tin |
|----------|-----------|
| **Độ dài** | 1.5 miles (2.4 km) round trip |
| **Độ cao** | 150 ft (46m) |
| **Thời gian** | 1.5 - 2 giờ |
| **Độ khó** | ⭐⭐ (Dễ) |
| **Phí** | $20 người lớn, $12 trẻ em |
| **Giờ mở** | 9AM - 5PM |

**Đặc điểm:**
- Đường paved dễ đi
- Vườn thực vật dọc đường
- **Được phép bơi** ở thác (có lifeguard)
- Cho mượn áo phao miễn phí

**Mẹo:** Mang đồ bơi và khăn!

---

## 🔴 TRAILS KHÓ (Advanced)

### 7. Koko Head Crater Rim Trail

**Không phải cầu thang - mà là rim trail!**

| Chi tiết | Thông tin |
|----------|-----------|
| **Độ dài** | 3 miles (4.8 km) loop |
| **Độ cao** | 1,400 ft (427m) |
| **Thời gian** | 2.5 - 3.5 giờ |
| **Độ khó** | ⭐⭐⭐⭐ (Khó) |
| **Phí** | Miễn phí |

**Lưu ý:** Trail không chính thức, cần kinh nghiệm.

---

### 8. Olomana Three Peaks

**Trail thử thách nhất Oahu**

| Chi tiết | Thông tin |
|----------|-----------|
| **Độ dài** | 4.5 miles (7.2 km) round trip |
| **Độ cao** | 1,643 ft (501m) |
| **Thời gian** | 4 - 6 giờ |
| **Độ khó** | ⭐⭐⭐⭐⭐ (Rất khó) |
| **Phí** | Miễn phí |

**Đặc điểm:**
- 3 đỉnh: First, Second, Third Peak
- Đoạn leo dốc đứng, cần dùng dây (rope sections)
- View tuyệt đẹp nhưng nguy hiểm

**⚠️ CẢNH BÁO:** Đã có người tử vong. Chỉ dành cho người có kinh nghiệm leo núi!

---

## 📋 Checklist chuẩn bị

### Luôn mang theo:
- [ ] Nước (1-2 lít/người)
- [ ] Kem chống nắng SPF 50+
- [ ] Mũ/nón
- [ ] Giày hiking (không sandals)
- [ ] Snacks (granola bars, trái cây)
- [ ] Điện thoại (đầy pin)
- [ ] First aid kit nhỏ

### Tùy chọn:
- [ ] Hiking poles
- [ ] Headlamp (nếu đi sớm)
- [ ] Thuốc chống muỗi
- [ ] Rain jacket (có thể mưa bất ngờ)

---

## ⚠️ An toàn quan trọng

1. **Kiểm tra thời tiết** trước khi đi
2. **Không đi một mình** trails khó
3. **Nói với ai đó** bạn đi đâu
4. **Quay lại** nếu thời tiết xấu
5. **Tôn trọng thiên nhiên** - không xả rác
6. **Không đi trails illegal** (có thể bị phạt $1,000+)

---

## 📍 Bản đồ tất cả trails

Tải app **AllTrails** (miễn phí) để xem bản đồ chi tiết và đánh giá từ người đi trước.

---

*📅 Cập nhật: Tháng 1, 2026*

*💡 Luôn kiểm tra điều kiện trail trước khi đi tại hawaiitrails.hawaii.gov*`,
  },
];

async function main() {
  console.log('🔄 Updating more articles...\n');

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
        },
      });

      console.log(`✅ Updated: ${article.slug}`);
      updated++;
    } catch (error) {
      console.error(`❌ Error:`, error);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`Updated: ${updated} | Not found: ${notFound}`);
}

main().catch(console.error).finally(() => db.$disconnect());
