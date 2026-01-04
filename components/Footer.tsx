import Link from 'next/link';
import { Facebook, Instagram, Mail, Phone, MapPin, Newspaper, ShoppingBag, Wrench, Users } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-3xl">🌺</span>
              <h3 className="text-2xl font-black bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                VietHawaii
              </h3>
            </div>
            <p className="text-gray-300 leading-relaxed mb-2">
              Cổng thông tin dành cho cộng đồng người Việt tại Hawaii.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Your comprehensive directory for Vietnamese businesses, culture, and community across the Hawaiian Islands.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-primary-500 hover:to-accent-500 flex items-center justify-center transition-all hover:scale-110"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-primary-500 hover:to-accent-500 flex items-center justify-center transition-all hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links - Vietnamese First */}
          <div>
            <h4 className="text-lg font-black mb-4 text-primary-400">Liên Kết Nhanh</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/news" className="text-gray-300 hover:text-primary-400 transition-colors flex items-center gap-2">
                  <Newspaper className="w-4 h-4" />
                  Tin Tức Cộng Đồng
                </Link>
              </li>
              <li>
                <Link href="/rao-vat" className="text-gray-300 hover:text-primary-400 transition-colors flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Chợ & Rao Vặt
                </Link>
              </li>
              <li>
                <Link href="/cong-cu" className="text-gray-300 hover:text-primary-400 transition-colors flex items-center gap-2">
                  <Wrench className="w-4 h-4" />
                  Công Cụ Hữu Ích
                </Link>
              </li>
              <li>
                <Link href="/cong-dong" className="text-gray-300 hover:text-primary-400 transition-colors flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Cộng Đồng & Sự Kiện
                </Link>
              </li>
              <li>
                <Link href="/huong-dan" className="text-gray-300 hover:text-primary-400 transition-colors flex items-center gap-2">
                  → Hướng Dẫn Định Cư
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-gray-300 hover:text-primary-400 transition-colors flex items-center gap-2">
                  → Thêm Doanh Nghiệp
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-black mb-4 text-primary-400">Danh Mục Phổ Biến</h4>
            <ul className="space-y-2">
              <li className="text-gray-300">🍜 Nhà Hàng & Ẩm Thực</li>
              <li className="text-gray-300">💇 Làm Đẹp & Spa</li>
              <li className="text-gray-300">🏥 Y Tế & Sức Khỏe</li>
              <li className="text-gray-300">🛍️ Mua Sắm</li>
              <li className="text-gray-300">💼 Dịch Vụ Chuyên Nghiệp</li>
              <li className="text-gray-300">🏠 Nhà Đất & Bất Động Sản</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-black mb-4 text-primary-400">Liên Hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-gray-300">
                <MapPin className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <span>Phục vụ tất cả các đảo Hawaii</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a href="mailto:info@viethawaii.com" className="hover:text-primary-400 transition-colors">
                  info@viethawaii.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a href="tel:+1808555VIET" className="hover:text-primary-400 transition-colors">
                  (808) 555-VIET
                </a>
              </li>
            </ul>
            <Link
              href="/contact"
              className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg font-bold hover:shadow-xl transition-all hover:scale-105"
            >
              Liên Hệ Ngay
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} VietHawaii. Kết nối cộng đồng người Việt tại Hawaii.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-primary-400 transition-colors">
                Chính Sách Bảo Mật
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-primary-400 transition-colors">
                Điều Khoản Sử Dụng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
