'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Clock, DollarSign, Globe, Mail, Phone, Building2, Loader2 } from 'lucide-react';

const CATEGORIES = [
  { value: 'cultural', label: 'Van Hoa', labelVi: 'Văn Hóa' },
  { value: 'religious', label: 'Ton Giao', labelVi: 'Tôn Giáo' },
  { value: 'business', label: 'Kinh Doanh', labelVi: 'Kinh Doanh' },
  { value: 'social', label: 'Giao Luu', labelVi: 'Giao Lưu' },
  { value: 'educational', label: 'Giao Duc', labelVi: 'Giáo Dục' },
  { value: 'sports', label: 'The Thao', labelVi: 'Thể Thao' },
  { value: 'food', label: 'Am Thuc', labelVi: 'Ẩm Thực' },
  { value: 'music', label: 'Am Nhac', labelVi: 'Âm Nhạc' },
];

const ISLANDS = [
  { value: 'Oahu', label: "O'ahu" },
  { value: 'Maui', label: 'Maui' },
  { value: 'BigIsland', label: "Hawai'i (Big Island)" },
  { value: 'Kauai', label: "Kaua'i" },
  { value: 'Molokai', label: "Moloka'i" },
  { value: 'Lanai', label: "Lana'i" },
];

export default function EventForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    description: '',
    descriptionEn: '',
    category: 'cultural',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    isAllDay: false,
    venue: '',
    address: '',
    island: 'Oahu',
    city: '',
    virtualLink: '',
    isFree: true,
    ticketPrice: '',
    ticketLink: '',
    organizationName: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    image: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/community/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra');
      }

      router.push('/cong-dong/su-kien?success=submitted');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-rose-500" />
          Thông Tin Sự Kiện
        </h2>
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên Sự Kiện (Tiếng Việt) *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="VD: Lễ Hội Tết Nguyên Đán 2026"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Name (English)
            </label>
            <input
              type="text"
              name="titleEn"
              value={formData.titleEn}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="e.g., Lunar New Year Festival 2026"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại Sự Kiện *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.labelVi}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô Tả Chi Tiết (Tiếng Việt) *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="Mô tả chi tiết về sự kiện, chương trình, hoạt động..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (English)
            </label>
            <textarea
              name="descriptionEn"
              value={formData.descriptionEn}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="Event description in English..."
            />
          </div>
        </div>
      </section>

      {/* Date & Time */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-500" />
          Thời Gian
        </h2>
        <div className="grid gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isAllDay"
              id="isAllDay"
              checked={formData.isAllDay}
              onChange={handleChange}
              className="w-4 h-4 text-rose-500 focus:ring-rose-500 rounded"
            />
            <label htmlFor="isAllDay" className="text-sm text-gray-700">
              Sự kiện cả ngày
            </label>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày Bắt Đầu *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
            {!formData.isAllDay && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giờ Bắt Đầu
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày Kết Thúc
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
            {!formData.isAllDay && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giờ Kết Thúc
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Location */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-green-500" />
          Địa Điểm
        </h2>
        <div className="grid gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đảo *
              </label>
              <select
                name="island"
                value={formData.island}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                {ISLANDS.map(island => (
                  <option key={island.value} value={island.value}>
                    {island.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thành Phố
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="VD: Honolulu"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên Địa Điểm
            </label>
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="VD: Honolulu Hale, Ala Moana Beach Park..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa Chỉ
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="VD: 530 South King St, Honolulu, HI 96813"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Globe className="w-4 h-4 inline mr-1" />
              Link Tham Gia Online (nếu có)
            </label>
            <input
              type="url"
              name="virtualLink"
              value={formData.virtualLink}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="https://zoom.us/..."
            />
          </div>
        </div>
      </section>

      {/* Tickets */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-yellow-500" />
          Vé / Đăng Ký
        </h2>
        <div className="grid gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isFree"
              id="isFree"
              checked={formData.isFree}
              onChange={handleChange}
              className="w-4 h-4 text-rose-500 focus:ring-rose-500 rounded"
            />
            <label htmlFor="isFree" className="text-sm text-gray-700">
              Sự kiện miễn phí
            </label>
          </div>
          {!formData.isFree && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá Vé ($)
              </label>
              <input
                type="number"
                name="ticketPrice"
                value={formData.ticketPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link Đăng Ký / Mua Vé
            </label>
            <input
              type="url"
              name="ticketLink"
              value={formData.ticketLink}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="https://eventbrite.com/..."
            />
          </div>
        </div>
      </section>

      {/* Organizer */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-purple-500" />
          Ban Tổ Chức
        </h2>
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên Tổ Chức / Nhóm
            </label>
            <input
              type="text"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="VD: Hội Người Việt Hawaii"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Mail className="w-4 h-4 inline mr-1" />
                Email Liên Hệ
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Phone className="w-4 h-4 inline mr-1" />
                Số Điện Thoại
              </label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="https://"
            />
          </div>
        </div>
      </section>

      {/* Image */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Hình Ảnh</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL Hình Ảnh Sự Kiện
          </label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            placeholder="https://..."
          />
          <p className="mt-1 text-sm text-gray-500">
            Dán link hình ảnh từ Google Drive, Dropbox, hoặc dịch vụ lưu trữ khác
          </p>
        </div>
      </section>

      {/* Submit */}
      <div className="flex gap-4 pt-4 border-t">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-lg hover:from-rose-600 hover:to-orange-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Đang Gửi...
            </>
          ) : (
            'Gửi Sự Kiện'
          )}
        </button>
      </div>

      <p className="text-sm text-gray-500 text-center">
        Sự kiện sẽ được xem xét và duyệt trong vòng 24 giờ.
      </p>
    </form>
  );
}
