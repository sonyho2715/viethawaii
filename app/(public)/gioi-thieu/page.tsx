import { Users, Heart, Target, Globe } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Giới Thiệu | VietHawaii',
  description: 'VietHawaii - Kết nối cộng đồng người Việt tại Hawaii. Tìm nhà, việc làm, và thông tin hữu ích.',
};

const values = [
  {
    icon: Users,
    titleVn: 'Cộng đồng',
    titleEn: 'Community',
    descVn: 'Xây dựng mối quan hệ gắn kết giữa người Việt tại Hawaii',
    descEn: 'Building connections within the Vietnamese community in Hawaii',
  },
  {
    icon: Heart,
    titleVn: 'Hỗ trợ',
    titleEn: 'Support',
    descVn: 'Giúp đồng hương tìm nhà ở, việc làm và ổn định cuộc sống',
    descEn: 'Helping compatriots find housing, jobs, and stability',
  },
  {
    icon: Target,
    titleVn: 'Minh bạch',
    titleEn: 'Transparency',
    descVn: 'Thông tin rõ ràng, đáng tin cậy cho mọi người',
    descEn: 'Clear and trustworthy information for everyone',
  },
  {
    icon: Globe,
    titleVn: 'Đa ngôn ngữ',
    titleEn: 'Bilingual',
    descVn: 'Hỗ trợ tiếng Việt và tiếng Anh cho mọi thế hệ',
    descEn: 'Supporting Vietnamese and English for all generations',
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Về VietHawaii
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Nền tảng kết nối cộng đồng người Việt tại Hawaii
        </p>
        <p className="text-gray-500 mt-2">
          Connecting the Vietnamese Community in Hawaii
        </p>
      </div>

      {/* Mission */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Sứ Mệnh Của Chúng Tôi
        </h2>
        <p className="text-gray-700 text-lg text-center max-w-3xl mx-auto leading-relaxed">
          VietHawaii được xây dựng với mục tiêu trở thành cầu nối cho cộng đồng người Việt tại Hawaii.
          Chúng tôi cung cấp nền tảng để mọi người có thể tìm kiếm nhà ở, việc làm,
          và các dịch vụ một cách dễ dàng bằng tiếng Việt.
        </p>
        <p className="text-gray-600 text-center mt-4">
          VietHawaii is built to connect the Vietnamese community in Hawaii,
          providing a platform for housing, jobs, and services in Vietnamese.
        </p>
      </div>

      {/* Values */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Giá Trị Cốt Lõi
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {values.map((value) => (
            <div
              key={value.titleVn}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center mb-4">
                <value.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {value.titleVn}
              </h3>
              <p className="text-sm text-gray-500 mb-2">{value.titleEn}</p>
              <p className="text-gray-600">{value.descVn}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Story */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Câu Chuyện Của Chúng Tôi
        </h2>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-4">
            Hawaii là nơi có cộng đồng người Việt đông đảo với hơn 10,000 người sinh sống và làm việc.
            Tuy nhiên, việc tìm kiếm thông tin bằng tiếng Việt về nhà ở, việc làm, hay các dịch vụ
            vẫn còn rất hạn chế.
          </p>
          <p className="text-gray-600 mb-4">
            VietHawaii ra đời để lấp đầy khoảng trống đó. Chúng tôi muốn tạo ra một nơi mà bất kỳ ai
            trong cộng đồng đều có thể dễ dàng đăng tin, tìm kiếm, và kết nối với nhau.
          </p>
          <p className="text-gray-600">
            Từ những người mới đến Hawaii tìm chỗ ở, đến các chủ nhà muốn cho thuê,
            từ người tìm việc đến nhà tuyển dụng. VietHawaii là nơi kết nối tất cả.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
          <p className="text-3xl font-bold text-teal-600">10,000+</p>
          <p className="text-gray-600 text-sm mt-1">Người Việt tại Hawaii</p>
        </div>
        <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
          <p className="text-3xl font-bold text-teal-600">100%</p>
          <p className="text-gray-600 text-sm mt-1">Song ngữ Việt-Anh</p>
        </div>
        <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
          <p className="text-3xl font-bold text-teal-600">24/7</p>
          <p className="text-gray-600 text-sm mt-1">Hoạt động liên tục</p>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="text-center p-8 bg-gray-50 rounded-2xl">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Có câu hỏi?
        </h3>
        <p className="text-gray-600 mb-4">
          Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn.
        </p>
        <a
          href="/lien-he"
          className="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-medium rounded-full hover:bg-teal-700 transition-colors"
        >
          Liên hệ với chúng tôi
        </a>
      </div>
    </div>
  );
}
