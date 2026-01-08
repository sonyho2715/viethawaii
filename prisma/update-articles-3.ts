import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const IMAGES = {
  pho: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1200&q=80',
  banhmi: 'https://images.unsplash.com/photo-1600688640154-9619e002df30?w=1200&q=80',
  market: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80',
  hawaii: 'https://images.unsplash.com/photo-1542259009477-d625272157b7?w=1200&q=80',
  job: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&q=80',
  house: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80',
  food: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&q=80',
};

const articleUpdates = [
  // ===== ẨM THỰC =====
  {
    slug: 'cong-thuc-pho-bo-tai-nha',
    featuredImage: IMAGES.pho,
    contentVn: `# Công thức nấu phở bò tại nhà - Authentic Saigon Style (2026)

![Phở bò Việt Nam](${IMAGES.pho})

Phở là món ăn quốc hồn quốc túy của Việt Nam. Bài viết này hướng dẫn chi tiết cách nấu **phở bò kiểu Sài Gòn** tại nhà với nguyên liệu dễ tìm ở Hawaii.

---

## 📝 Nguyên liệu (cho 8-10 người)

### Nước dùng (Broth)

| Nguyên liệu | Số lượng | Ghi chú |
|-------------|----------|---------|
| Xương ống bò (beef marrow bones) | 4 lbs | Costco hoặc Chinatown |
| Xương đuôi bò (oxtail) | 2 lbs | Thêm vị ngọt |
| Gầu bò (beef brisket) | 2 lbs | Để ăn kèm |
| Gừng tươi | 6 inch | Nướng cháy vỏ |
| Hành tây lớn | 3 củ | Nướng cháy vỏ |
| Nước | 6 quarts | Nước lọc |

### Gia vị nướng (Spice packet)

| Gia vị | Số lượng | Tên tiếng Anh |
|--------|----------|---------------|
| Hoa hồi | 6 cánh | Star anise |
| Quế | 2 thanh | Cinnamon sticks |
| Đinh hương | 8 nụ | Whole cloves |
| Hạt ngò | 2 tbsp | Coriander seeds |
| Thảo quả | 2 quả | Black cardamom |
| Hạt tiêu đen | 1 tbsp | Black peppercorns |

### Nêm nếm

| Nguyên liệu | Số lượng | Ghi chú |
|-------------|----------|---------|
| Nước mắm | 4-5 tbsp | Red Boat hoặc Three Crabs |
| Đường phèn | 2 tbsp | Hoặc đường cát |
| Muối | 2 tbsp | Nêm theo khẩu vị |

### Topping & Garnish

| Nguyên liệu | Số lượng |
|-------------|----------|
| Thịt bò tái (eye round) | 1 lb |
| Bánh phở tươi/khô | 2 lbs |
| Giá đỗ | 1 lb |
| Rau húng quế (Thai basil) | 1 bunch |
| Ngò gai (culantro/sawtooth) | 1 bunch |
| Hành lá | 1 bunch |
| Ngò (cilantro) | 1 bunch |
| Chanh | 4 quả |
| Ớt | 4-5 quả |
| Tương đen (hoisin) | |
| Tương ớt (sriracha) | |

---

## 👨‍🍳 Cách nấu chi tiết

### Bước 1: Chuẩn bị xương (30 phút)

1. **Ngâm xương** trong nước lạnh 30 phút để ra máu bẩn
2. **Rửa sạch** xương dưới vòi nước
3. Cho xương vào nồi lớn, đổ nước ngập
4. **Đun sôi mạnh** 10 phút - sẽ nổi nhiều bọt bẩn
5. **Đổ hết nước**, rửa lại xương thật sạch
6. Rửa nồi

> 💡 **Mẹo:** Bước này gọi là "chần xương" - giúp nước dùng trong và không hôi.

### Bước 2: Nướng hành gừng (15 phút)

**Cách 1: Bếp gas**
- Đặt hành tây và gừng trực tiếp lên lửa
- Xoay đều cho cháy khắp vỏ ngoài (15-20 phút)

**Cách 2: Lò nướng**
- Nướng ở 450°F trong 30 phút
- Hoặc broil 10-15 phút, lật đều

Sau khi nướng:
- Cạo bỏ phần cháy đen
- Rửa sạch dưới vòi nước
- Đập dập gừng

> 💡 **Tại sao nướng?** Hành gừng nướng cho mùi thơm đặc trưng và vị ngọt caramel hóa.

### Bước 3: Rang gia vị (5 phút)

1. Cho tất cả gia vị vào **chảo khô** (không dầu)
2. Rang trên lửa nhỏ-vừa **2-3 phút** đến khi thơm
3. **Không rang cháy!** Sẽ đắng
4. Cho vào **túi vải** hoặc **tea ball** để dễ vớt

> 💡 **Mẹo:** Rang gia vị giúp kích hoạt tinh dầu, nước dùng thơm hơn.

### Bước 4: Nấu nước dùng (4-6 giờ)

1. Cho xương đã chần vào nồi lớn (12+ quart)
2. Đổ **6 quarts nước LẠNH**
3. Đun **sôi lớn** trên lửa cao
4. Giảm xuống **lửa nhỏ** (barely simmering)
5. **Vớt bọt** liên tục trong 30 phút đầu
6. Thêm:
   - Hành gừng nướng
   - Túi gia vị
   - Gầu bò
7. Đậy vung hé, nấu **4-6 giờ**

**Kiểm tra gầu bò:**
- Sau 1.5-2 giờ, dùng đũa xiên
- Nếu mềm, vớt ra, ngâm nước đá để giữ texture
- Để nguội rồi cắt miếng mỏng

### Bước 5: Nêm nếm (quan trọng!)

Sau 4 giờ nấu:
1. Vớt bỏ túi gia vị
2. Lọc nước dùng qua rây
3. Nêm:
   - **Nước mắm**: 4 tbsp (thêm từ từ)
   - **Đường phèn**: 2 tbsp
   - **Muối**: 1-2 tbsp

> ⚠️ **Quan trọng:** Nêm nhạt hơn một chút vì sẽ thêm nước mắm khi ăn.

### Bước 6: Chuẩn bị thịt tái

1. **Để thịt eye round vào freezer 30-45 phút** (dễ cắt mỏng)
2. Dùng dao sắc cắt **mỏng như giấy** (against the grain)
3. Xếp thịt trên đĩa

### Bước 7: Hoàn thành

**Chuẩn bị bánh phở:**
- Bánh phở tươi: Trụng nước sôi 5-10 giây
- Bánh phở khô: Ngâm nước ấm 30 phút, trụng 30 giây

**Bày tô:**
1. Bánh phở → đáy tô
2. Hành lá thái + ngò
3. Thịt gầu (chín) + thịt tái (sống)
4. Chan nước dùng **sôi** (để làm chín thịt tái)
5. Dọn kèm đĩa rau

---

## 🛒 Mua nguyên liệu ở Hawaii

| Nguyên liệu | Địa điểm |
|-------------|----------|
| Xương bò, gầu, thịt tái | Costco, Don Quijote, Chinatown |
| Gia vị nấu phở | Chinatown (Maunakea St), Don Quijote |
| Bánh phở | Marukai, Don Quijote, 99 Ranch |
| Rau thơm | Chinatown, Don Quijote, Whole Foods |
| Nước mắm Red Boat | Whole Foods, Amazon |

---

## ⏱️ Timeline

| Thời gian | Công việc |
|-----------|-----------|
| T-1 ngày | Mua nguyên liệu |
| 6:00 AM | Chần xương, nướng hành gừng |
| 7:00 AM | Bắt đầu nấu nước dùng |
| 8:30 AM | Vớt gầu bò |
| 11:00 AM | Nêm nếm, lọc nước dùng |
| 11:30 AM | Chuẩn bị topping |
| 12:00 PM | Ăn! 🍜 |

---

## 💡 Mẹo từ đầu bếp chuyên nghiệp

1. **Nước lạnh** từ đầu giúp nước dùng trong
2. **Lửa nhỏ liu riu**, không sôi mạnh
3. **Vớt bọt thường xuyên** - bọt = nước đục
4. Có thể nấu **ngày hôm trước**, để tủ lạnh qua đêm, gạn mỡ trên mặt
5. **Đông lạnh** nước dùng thừa được 3 tháng

---

## 🍜 Biến tấu

- **Phở gà**: Thay xương bò bằng xương gà, nấu 2 giờ
- **Phở chay**: Nấu với củ cải, cà rốt, nấm
- **Instant Pot**: 90 phút high pressure (không ngon bằng nấu chậm)

---

*⏰ Thời gian chuẩn bị: 1 giờ | Thời gian nấu: 4-6 giờ | Serves: 8-10 người*`,
  },
  {
    slug: 'banh-mi-viet-o-hawaii',
    featuredImage: IMAGES.banhmi,
    contentVn: `# Những tiệm bánh mì Việt ngon nhất tại Hawaii (2026)

![Bánh mì Việt Nam](${IMAGES.banhmi})

Bánh mì Việt Nam đã được **CNN bình chọn** là một trong những loại sandwich ngon nhất thế giới. Tại Hawaii, có khá nhiều nơi bán bánh mì authentic. Dưới đây là danh sách **top 8** tiệm bánh mì được cộng đồng Việt đánh giá cao nhất.

---

## 🥇 1. Ba Le Sandwich & Bakery

**"OG" của bánh mì Hawaii - Mở từ năm 1984**

| Chi tiết | Thông tin |
|----------|-----------|
| **Địa chỉ** | 150 N King St, Honolulu (Chinatown) |
| **Giờ mở cửa** | 6:30 AM - 3:00 PM (đóng Chủ nhật) |
| **Giá** | $6.50 - $8.50 |
| **Thanh toán** | Cash only! |

**Điểm nổi bật:**
- ⭐ Bánh mì **giòn nhất** Honolulu
- ⭐ Chả lụa, pa-tê tự làm
- ⭐ Đông khách từ sáng sớm

**Menu nổi bật:**
- Bánh mì đặc biệt (thịt nguội combo): $7.50
- Bánh mì thịt nướng: $8.00
- Bánh mì chả lụa: $6.50

> "40 năm rồi vẫn giữ chất lượng. Bánh giòn, nhân đầy. Cash only nên nhớ mang tiền mặt!" — Anh Tùng, khách quen

---

## 🥈 2. The Pig and The Lady

**Bánh mì fusion cao cấp**

| Chi tiết | Thông tin |
|----------|-----------|
| **Địa chỉ** | 83 N King St, Honolulu |
| **Giờ mở cửa** | 10:30 AM - 2:00 PM, 5:30 PM - 9:00 PM |
| **Giá** | $14 - $18 |
| **Thanh toán** | Card accepted |

**Điểm nổi bật:**
- ⭐ Chef Andrew Le - James Beard semifinalist
- ⭐ Modern twist trên classic
- ⭐ Không gian nhà hàng đẹp

**Menu nổi bật:**
- Pho French Dip Banh Mi: $16
- Bánh mì with 12-hour brisket: $15

> "Đắt nhưng xứng đáng. Bánh mì ở đây là fine dining version." — Chị Linh

---

## 🥉 3. Lee's Bakery

**Giá rẻ, phục vụ nhanh**

| Chi tiết | Thông tin |
|----------|-----------|
| **Địa chỉ** | 1236 S King St, Honolulu |
| **Giờ mở cửa** | 7:00 AM - 5:00 PM |
| **Giá** | $5.50 - $7.00 |
| **Thanh toán** | Cash preferred |

**Điểm nổi bật:**
- ⭐ Giá phải chăng nhất
- ⭐ Phục vụ nhanh
- ⭐ Có bán bánh ngọt Việt Nam

---

## 4. Pig & the Lady at Farmers Market

**Outdoor experience**

| Chi tiết | Thông tin |
|----------|-----------|
| **Địa điểm** | KCC Farmers Market, Saturday morning |
| **Giờ** | 7:30 AM - 11:00 AM |
| **Giá** | $10 - $14 |

---

## 5. Pho 97

**Combo phở + bánh mì**

| Chi tiết | Thông tin |
|----------|-----------|
| **Địa chỉ** | 1040 S King St, Honolulu |
| **Giờ mở cửa** | 9:00 AM - 2:00 AM |
| **Giá** | $7 - $9 |

**Điểm nổi bật:**
- ⭐ Mở khuya đến 2AM
- ⭐ Tốt cho late night craving

---

## 6. Maguro Brothers (Chinatown)

**Bánh mì cá ngừ fusion**

| Chi tiết | Thông tin |
|----------|-----------|
| **Địa chỉ** | 115 N King St, Honolulu |
| **Giá** | $12 - $15 |

**Điểm nổi bật:**
- ⭐ Bánh mì cá ngừ tươi
- ⭐ Fusion style độc đáo

---

## 🗺️ Bản đồ các tiệm

Tất cả các tiệm trên đều nằm trong **Chinatown** hoặc gần đó - có thể đi bộ giữa các quán!

---

## 📊 So sánh nhanh

| Tiệm | Giá | Authentic | Chất lượng | Giờ mở |
|------|-----|-----------|------------|--------|
| Ba Le | $ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Sáng-chiều |
| Pig & Lady | $$$ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Trưa-tối |
| Lee's | $ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Sáng-chiều |
| Pho 97 | $$ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Đến 2AM |

---

## 🥖 Bánh mì gồm những gì?

Cho những ai chưa biết, bánh mì Việt Nam chuẩn gồm:

**Bánh:**
- Ổ bánh mì kiểu Pháp (giòn ngoài, mềm trong)
- Thường dài 6-12 inch

**Nhân:**
- **Protein**: Thịt nguội (chả lụa, thịt heo), pa-tê, hoặc thịt nướng
- **Đồ chua**: Cà rốt + củ cải trắng ngâm chua ngọt
- **Rau**: Ngò, dưa leo, ớt
- **Sốt**: Mayonnaise, nước tương, Maggi

**Variants:**
- Bánh mì thịt nguội (classic combo)
- Bánh mì thịt nướng (grilled pork)
- Bánh mì gà (chicken)
- Bánh mì chay (vegetarian)
- Bánh mì trứng ốp la (fried egg)

---

## 💡 Tips khi mua bánh mì

1. **Đến sớm** - Nhiều tiệm hết bánh vào buổi chiều
2. **Order "ít ớt"** nếu không ăn cay
3. **"Thêm rau"** nếu thích nhiều rau
4. **Cash only** tại nhiều tiệm nhỏ
5. **Ăn ngay** - Bánh mì ngon nhất khi còn giòn

---

*📅 Cập nhật: Tháng 1, 2026*

*💬 Bạn có tiệm bánh mì yêu thích? Comment bên dưới hoặc email tips@viethawaii.org!*`,
  },
  {
    slug: 'cho-viet-tai-honolulu',
    featuredImage: IMAGES.market,
    contentVn: `# Hướng dẫn đi chợ Việt tại Honolulu (2026)

![Chợ Việt](${IMAGES.market})

Một trong những điều người Việt mới đến Hawaii hay hỏi là: **"Mua đồ Việt ở đâu?"** Bài viết này giới thiệu tất cả các địa điểm mua thực phẩm và đồ dùng Việt Nam tại Honolulu.

---

## 🏪 Chinatown - Trung tâm mua sắm Á Đông

**Khu vực:** Maunakea St, N. King St, River St

Chinatown là nơi **tập trung nhiều cửa hàng thực phẩm Á Đông nhất** tại Oahu. Mặc dù gọi là "Chinatown", nhưng có rất nhiều cửa hàng Việt, Thái, Hàn, Filipino.

### Oahu Market
| Chi tiết | Thông tin |
|----------|-----------|
| **Địa chỉ** | 145 N King St |
| **Giờ mở cửa** | 6:00 AM - 4:00 PM |
| **Đặc điểm** | Chợ ướt truyền thống |

**Có bán:**
- 🥩 Thịt heo, bò, gà tươi
- 🐟 Hải sản tươi sống
- 🥬 Rau Việt Nam (rau muống, húng, ngò gai...)
- 🌿 Lá chuối, lá dong (cho bánh chưng)

### Các cửa hàng trên Maunakea St

**Thanh Thao Market**
- Nước mắm, mì gói, gia vị Việt
- Đồ đông lạnh (chả giò, nem)

**Sing Cheong Yuan**
- Bánh Việt (bánh pía, bánh in)
- Đồ khô

**Viet Hoa Market**
- Thực phẩm Việt đầy đủ
- Rau củ tươi

### Mẹo đi Chinatown:
- ✅ Đi **buổi sáng sớm** (7-10 AM) để có đồ tươi nhất
- ✅ Mang **tiền mặt** (nhiều nơi không nhận card)
- ✅ **Mặc cả** được ở một số gian hàng nhỏ
- ✅ Parking: Lot trên Smith St (~$2-3)

---

## 🛒 Siêu thị Á Đông lớn

### Don Quijote (Kaheka)

| Chi tiết | Thông tin |
|----------|-----------|
| **Địa chỉ** | 801 Kaheka St, Honolulu |
| **Giờ mở cửa** | 24/7 |
| **Parking** | Miễn phí |

**Điểm nổi bật:**
- ⭐ Siêu thị Nhật lớn nhất
- ⭐ Mở 24/7
- ⭐ Có section đồ Việt lớn

**Đồ Việt tìm được:**
- Nước mắm (Three Crabs, Squid, Red Boat)
- Bánh phở, bún khô
- Mì gói Việt Nam
- Rau Việt (húng quế, ngò gai)
- Đồ đông lạnh (chả giò, bánh cuốn)

### Marukai Market

| Chi tiết | Thông tin |
|----------|-----------|
| **Địa chỉ** | 2310 Kuhio Ave (Waikiki) + nhiều địa điểm |
| **Giờ mở cửa** | 8:00 AM - 10:00 PM |

**Đặc điểm:**
- Membership store (như Costco nhỏ)
- Giá tốt
- Nhiều đồ Á Đông

### 99 Ranch Market (coming soon!)

Siêu thị Á Đông lớn từ California đang mở tại Hawaii. Check for updates!

---

## 🥡 Mua đồ Việt online

### Amazon
- Nước mắm Red Boat
- Gia vị, bánh phở khô
- Đồ dùng nhà bếp Việt

### Weee!
- App giao hàng thực phẩm Á Đông
- Delivery tận nhà
- Nhiều đồ Việt

### 99 Ranch Online
- Ship từ California
- Đồ đông lạnh, tươi

---

## 📍 Tổng hợp theo khu vực

### Downtown/Chinatown
- Oahu Market
- Thanh Thao Market
- Viet Hoa Market

### Kalihi
- Tamashiro Market (hải sản)
- Don Quijote Dillingham

### Pearl City/Aiea
- Don Quijote Pearl City
- Marukai Pearl City

### Kailua/Windward
- Foodland (có section Asian nhỏ)
- Down to Earth (organic)

---

## 🛒 Danh sách đồ Việt cơ bản

### Pantry staples:
- [ ] Nước mắm
- [ ] Nước tương (maggi)
- [ ] Dầu hào
- [ ] Đường phèn
- [ ] Bột nêm
- [ ] Mì gói

### Nấu phở:
- [ ] Xương bò
- [ ] Hoa hồi, quế, đinh hương
- [ ] Bánh phở
- [ ] Rau húng quế, ngò gai

### Đồ tươi:
- [ ] Rau muống
- [ ] Rau mồng tơi
- [ ] Giá đỗ
- [ ] Ớt
- [ ] Chanh

---

## 💰 So sánh giá (tham khảo)

| Sản phẩm | Chinatown | Don Quijote | Amazon |
|----------|-----------|-------------|--------|
| Nước mắm Three Crabs | $5 | $6 | $8 |
| Bánh phở khô 2lb | $4 | $5 | $7 |
| Rau húng quế/bunch | $2 | $3 | N/A |

*Chinatown thường rẻ nhất, nhưng không tiện bằng supermarket*

---

*📅 Cập nhật: Tháng 1, 2026*

*💡 Mẹo: Đi chợ Chinatown vào sáng Thứ 7 - đông vui và nhiều đồ tươi!*`,
  },
  {
    slug: 'du-lich-neighbor-islands',
    featuredImage: IMAGES.hawaii,
    contentVn: `# Hướng dẫn du lịch các đảo láng giềng từ Oahu (2026)

![Hawaii Islands](${IMAGES.hawaii})

Hawaii có **6 đảo chính** có thể du lịch. Nếu bạn đang sống tại Oahu, việc đi thăm các đảo khác là trải nghiệm tuyệt vời. Bài viết này hướng dẫn chi tiết cách plan trip đến **Maui, Big Island, và Kauai**.

---

## 🏝️ Tổng quan các đảo

| Đảo | Biệt danh | Đặc điểm nổi bật | Thời gian đề xuất |
|-----|-----------|------------------|-------------------|
| **Maui** | Valley Isle | Road to Hana, Haleakala | 4-5 ngày |
| **Big Island** | Orchid Isle | Núi lửa, Mauna Kea | 5-7 ngày |
| **Kauai** | Garden Isle | Na Pali Coast, thiên nhiên hoang sơ | 3-4 ngày |
| **Lanai** | Pineapple Isle | Luxury resort, yên tĩnh | 2-3 ngày |
| **Molokai** | Friendly Isle | Ít du lịch, nguyên sơ | 2-3 ngày |

---

## ✈️ Đặt vé máy bay

### Các hãng hàng không nội địa

| Hãng | Ưu điểm | Nhược điểm | Website |
|------|---------|------------|---------|
| **Hawaiian Airlines** | Nhiều chuyến, reliable | Đắt hơn | hawaiianairlines.com |
| **Southwest Airlines** | Giá rẻ, 2 bags miễn phí | Ít chuyến | southwest.com |
| **Mokulele Airlines** | Bay đến sân bay nhỏ | Máy bay 9 chỗ | mokuleleairlines.com |

### Giá vé tham khảo (round trip)

| Route | Economy | Thời gian bay |
|-------|---------|---------------|
| Honolulu → Maui (OGG) | $90-150 | 35 phút |
| Honolulu → Kona (Big Island) | $100-180 | 45 phút |
| Honolulu → Hilo (Big Island) | $100-180 | 50 phút |
| Honolulu → Lihue (Kauai) | $90-150 | 30 phút |

### Mẹo đặt vé rẻ:
- ✅ Đặt **2-3 tuần trước**
- ✅ Bay **giữa tuần** (Tue-Thu rẻ nhất)
- ✅ Tránh **holidays** và **spring break**
- ✅ Dùng **Google Flights** để so sánh
- ✅ Set **price alerts**

---

## 🚗 Thuê xe

**Bắt buộc thuê xe** ở hầu hết các đảo (trừ resort areas).

### Giá thuê xe tham khảo:
| Loại xe | Giá/ngày | Phù hợp |
|---------|----------|---------|
| Economy | $50-70 | 2 người |
| Compact SUV | $70-100 | 4 người |
| Full-size SUV | $100-150 | Gia đình |
| Jeep Wrangler | $120-180 | Off-road |

### Mẹo thuê xe:
- ✅ **Costco Travel** thường có giá tốt nhất
- ✅ Đặt **sớm** (xe ở Hawaii hay hết)
- ✅ Không cần **4WD** cho hầu hết tourists
- ✅ Check **deductible** kỹ

---

## 🏝️ MAUI - Chi tiết

### Thời gian đề xuất: 4-5 ngày

### Lịch trình gợi ý:

**Ngày 1: Đến + West Maui**
- Bay đến Kahului (OGG)
- Nhận xe, check-in resort
- Chiều: Bãi biển Kaanapali
- Tối: Sunset ở Lahaina

**Ngày 2: Road to Hana**
- Khởi hành 7AM
- 52 miles, 620 curves, 59 bridges
- Dừng: Twin Falls, Waikani Falls, Black Sand Beach
- Về tối hoặc ngủ lại Hana

**Ngày 3: Haleakala Sunrise**
- Đặt vé trước tại recreation.gov
- Khởi hành 3AM để kịp sunrise
- Chiều: Upcountry Maui, Makawao town

**Ngày 4: South Maui**
- Snorkeling tại Molokini (book tour)
- Wailea Beach
- Big Beach (Makena)

**Ngày 5: Bay về**
- Shopping ở Kahului
- Ra sân bay

### Chi phí ước tính (1 người, 4 đêm):
| Hạng mục | Chi phí |
|----------|---------|
| Vé máy bay | $100-150 |
| Khách sạn (4 đêm) | $600-1000 |
| Thuê xe (4 ngày) | $250-350 |
| Ăn uống | $200-300 |
| Hoạt động | $100-200 |
| **Tổng** | **$1,250-2,000** |

---

## 🌋 BIG ISLAND - Chi tiết

### Thời gian đề xuất: 5-7 ngày

### Lịch trình gợi ý:

**Ngày 1: Kona Side**
- Bay đến Kona (KOA)
- Kailua-Kona town
- Snorkeling tại Kahalu'u Beach

**Ngày 2: South Point + Black Sand**
- Green Sand Beach (Papakolea)
- Punalu'u Black Sand Beach
- Lái về Hilo

**Ngày 3: Volcanoes National Park**
- Kilauea Crater
- Thurston Lava Tube
- Chain of Craters Road
- Night viewing (nếu có lava activity)

**Ngày 4: Hilo + Waterfalls**
- Rainbow Falls
- Akaka Falls
- Hilo town, farmers market

**Ngày 5: Mauna Kea**
- Sunset + stargazing tại đỉnh
- Cần 4WD hoặc tour
- Mặc ấm (có thể 30°F!)

**Ngày 6: Relax/Buffer**
- Coffee farm tour (Kona coffee)
- Beach day
- Bay về

---

## 🌿 KAUAI - Chi tiết

### Thời gian đề xuất: 3-4 ngày

### Highlights:
- **Na Pali Coast**: Chỉ có thể xem bằng helicopter, boat, hoặc hiking
- **Waimea Canyon**: "Grand Canyon of the Pacific"
- **Hanalei Bay**: Bãi biển đẹp nhất
- **Poipu Beach**: Tốt cho gia đình

### Chi phí ước tính (1 người, 3 đêm): $900-1,500

---

## 💡 Tips tổng hợp

1. **Book early**: Đặt máy bay + xe + khách sạn 3-4 tuần trước
2. **Pack light**: Chỉ cần carry-on nếu đi ngắn ngày
3. **Rent at airport**: Thuận tiện và thường rẻ hơn
4. **Download offline maps**: Nhiều nơi không có signal
5. **Đi với nhóm**: Chia tiền xe, khách sạn tiết kiệm 30-50%

---

*📅 Cập nhật: Tháng 1, 2026*

*💡 Muốn đi tour group? Check VietHawaii Travel Group trên Facebook!*`,
  },
];

async function main() {
  console.log('🔄 Updating food & travel articles...\n');

  let updated = 0;

  for (const article of articleUpdates) {
    try {
      const existing = await db.article.findUnique({ where: { slug: article.slug } });
      if (!existing) { console.log(`⚠️ Not found: ${article.slug}`); continue; }

      await db.article.update({
        where: { slug: article.slug },
        data: { featuredImage: article.featuredImage, contentVn: article.contentVn },
      });
      console.log(`✅ Updated: ${article.slug}`);
      updated++;
    } catch (error) { console.error(`❌ Error:`, error); }
  }

  console.log(`\nUpdated: ${updated} articles`);
}

main().catch(console.error).finally(() => db.$disconnect());
