import { Shield } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chính Sách Bảo Mật | VietHawaii',
  description: 'Chính sách bảo mật thông tin người dùng của VietHawaii.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 mb-4">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Chính Sách Bảo Mật
        </h1>
        <p className="text-gray-600">Privacy Policy</p>
        <p className="text-sm text-gray-500 mt-2">
          Cập nhật lần cuối: Tháng 1, 2025
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-8 prose prose-gray max-w-none">
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            1. Giới thiệu
          </h2>
          <p className="text-gray-600 mb-4">
            VietHawaii (&quot;chúng tôi&quot;, &quot;của chúng tôi&quot;) cam kết bảo vệ quyền riêng tư của bạn.
            Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng, và bảo vệ
            thông tin cá nhân của bạn khi sử dụng website viethawaii.com.
          </p>
          <p className="text-gray-500 text-sm italic">
            VietHawaii is committed to protecting your privacy. This policy explains how we collect,
            use, and protect your personal information when using viethawaii.com.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            2. Thông tin chúng tôi thu thập
          </h2>
          <h3 className="text-lg font-medium text-gray-800 mb-2">2.1 Thông tin bạn cung cấp</h3>
          <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-1">
            <li>Tên và địa chỉ email khi đăng ký tài khoản</li>
            <li>Số điện thoại khi đăng tin (tùy chọn)</li>
            <li>Nội dung tin đăng và hình ảnh</li>
            <li>Tin nhắn liên hệ và phản hồi</li>
          </ul>

          <h3 className="text-lg font-medium text-gray-800 mb-2">2.2 Thông tin tự động thu thập</h3>
          <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-1">
            <li>Địa chỉ IP và thông tin trình duyệt</li>
            <li>Cookies và dữ liệu phiên làm việc</li>
            <li>Lịch sử truy cập và tương tác trên website</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            3. Cách chúng tôi sử dụng thông tin
          </h2>
          <p className="text-gray-600 mb-4">Chúng tôi sử dụng thông tin của bạn để:</p>
          <ul className="list-disc pl-6 text-gray-600 space-y-1">
            <li>Cung cấp và duy trì dịch vụ website</li>
            <li>Xử lý và hiển thị tin đăng của bạn</li>
            <li>Gửi thông báo về tài khoản và hoạt động</li>
            <li>Cải thiện trải nghiệm người dùng</li>
            <li>Ngăn chặn gian lận và bảo mật hệ thống</li>
            <li>Tuân thủ các yêu cầu pháp lý</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            4. Chia sẻ thông tin
          </h2>
          <p className="text-gray-600 mb-4">
            Chúng tôi <strong>không bán</strong> thông tin cá nhân của bạn cho bên thứ ba.
            Thông tin có thể được chia sẻ trong các trường hợp sau:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-1">
            <li>Khi bạn công khai thông tin trong tin đăng</li>
            <li>Với nhà cung cấp dịch vụ hỗ trợ hoạt động website</li>
            <li>Khi có yêu cầu từ cơ quan pháp luật</li>
            <li>Để bảo vệ quyền lợi của VietHawaii và người dùng</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            5. Bảo mật thông tin
          </h2>
          <p className="text-gray-600 mb-4">
            Chúng tôi áp dụng các biện pháp bảo mật tiêu chuẩn để bảo vệ thông tin của bạn:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-1">
            <li>Mã hóa SSL/TLS cho tất cả kết nối</li>
            <li>Mật khẩu được mã hóa (hashed) trong cơ sở dữ liệu</li>
            <li>Giới hạn truy cập thông tin nhạy cảm</li>
            <li>Sao lưu dữ liệu định kỳ</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            6. Quyền của bạn
          </h2>
          <p className="text-gray-600 mb-4">Bạn có quyền:</p>
          <ul className="list-disc pl-6 text-gray-600 space-y-1">
            <li>Truy cập và xem thông tin cá nhân của bạn</li>
            <li>Sửa đổi thông tin không chính xác</li>
            <li>Xóa tài khoản và tin đăng</li>
            <li>Từ chối nhận email marketing</li>
            <li>Yêu cầu xuất dữ liệu cá nhân</li>
          </ul>
          <p className="text-gray-600 mt-4">
            Để thực hiện các quyền này, vui lòng liên hệ: contact@viethawaii.com
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            7. Quảng cáo (Advertising)
          </h2>
          <p className="text-gray-600 mb-4">
            Website sử dụng Google AdSense để hiển thị quảng cáo. Google và các đối tác quảng cáo có thể:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-1">
            <li>Sử dụng cookies để hiển thị quảng cáo dựa trên lịch sử truy cập của bạn</li>
            <li>Thu thập dữ liệu ẩn danh về cách bạn tương tác với quảng cáo</li>
            <li>Hiển thị quảng cáo cá nhân hóa dựa trên sở thích của bạn</li>
          </ul>
          <p className="text-gray-600 mt-4">
            Bạn có thể tắt quảng cáo cá nhân hóa tại:{' '}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
              Google Ads Settings
            </a>
          </p>
          <p className="text-gray-500 text-sm italic mt-2">
            We use Google AdSense to display advertisements. Google and advertising partners may use cookies
            to serve ads based on your browsing history. You can opt out of personalized advertising at Google Ads Settings.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            8. Cookies
          </h2>
          <p className="text-gray-600 mb-4">
            Website sử dụng cookies để:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-1">
            <li>Duy trì phiên đăng nhập</li>
            <li>Lưu tùy chọn ngôn ngữ</li>
            <li>Phân tích lưu lượng truy cập (Google Analytics)</li>
            <li>Hiển thị quảng cáo phù hợp (Google AdSense)</li>
          </ul>
          <p className="text-gray-600 mt-4">
            Bạn có thể tắt cookies trong cài đặt trình duyệt, nhưng một số tính năng có thể không hoạt động.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            9. Thay đổi chính sách
          </h2>
          <p className="text-gray-600">
            Chúng tôi có thể cập nhật chính sách này theo thời gian.
            Các thay đổi quan trọng sẽ được thông báo qua email hoặc trên website.
            Việc tiếp tục sử dụng website sau khi thay đổi đồng nghĩa với việc bạn chấp nhận chính sách mới.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            10. Liên hệ
          </h2>
          <p className="text-gray-600 mb-4">
            Nếu có câu hỏi về chính sách bảo mật, vui lòng liên hệ:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">
              <strong>Email:</strong> contact@viethawaii.com
            </p>
            <p className="text-gray-700">
              <strong>Địa chỉ:</strong> Honolulu, Hawaii
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
