import { FileText } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Điều Khoản Sử Dụng | VietHawaii',
  description: 'Điều khoản sử dụng dịch vụ VietHawaii.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 mb-4">
          <FileText className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Điều Khoản Sử Dụng
        </h1>
        <p className="text-gray-600">Terms of Service</p>
        <p className="text-sm text-gray-500 mt-2">
          Cập nhật lần cuối: Tháng 1, 2025
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-8 prose prose-gray max-w-none">
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            1. Chấp nhận điều khoản
          </h2>
          <p className="text-gray-600 mb-4">
            Bằng việc truy cập và sử dụng website VietHawaii (viethawaii.com), bạn đồng ý
            tuân thủ và bị ràng buộc bởi các điều khoản và điều kiện này.
            Nếu bạn không đồng ý với bất kỳ phần nào của điều khoản, vui lòng không sử dụng website.
          </p>
          <p className="text-gray-500 text-sm italic">
            By accessing and using VietHawaii, you agree to be bound by these terms.
            If you disagree with any part, please do not use the website.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            2. Mô tả dịch vụ
          </h2>
          <p className="text-gray-600 mb-4">
            VietHawaii cung cấp nền tảng trực tuyến cho phép người dùng:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-1">
            <li>Đăng và tìm kiếm tin rao vặt (nhà ở, việc làm, mua bán, dịch vụ)</li>
            <li>Sử dụng các công cụ tiện ích (đổi tiền, tính lương, múi giờ)</li>
            <li>Đọc tin tức và hướng dẫn cho cộng đồng</li>
            <li>Kết nối với các thành viên khác trong cộng đồng</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            3. Tài khoản người dùng
          </h2>
          <h3 className="text-lg font-medium text-gray-800 mb-2">3.1 Đăng ký</h3>
          <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-1">
            <li>Bạn phải cung cấp thông tin chính xác khi đăng ký</li>
            <li>Bạn phải từ 18 tuổi trở lên để tạo tài khoản</li>
            <li>Mỗi người chỉ được tạo một tài khoản</li>
          </ul>

          <h3 className="text-lg font-medium text-gray-800 mb-2">3.2 Bảo mật</h3>
          <ul className="list-disc pl-6 text-gray-600 space-y-1">
            <li>Bạn chịu trách nhiệm bảo mật mật khẩu</li>
            <li>Thông báo ngay nếu phát hiện truy cập trái phép</li>
            <li>Không chia sẻ tài khoản với người khác</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            4. Quy định đăng tin
          </h2>
          <p className="text-gray-600 mb-4">Khi đăng tin trên VietHawaii, bạn cam kết:</p>

          <h3 className="text-lg font-medium text-gray-800 mb-2">4.1 Nội dung được phép</h3>
          <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-1">
            <li>Thông tin trung thực, chính xác</li>
            <li>Hình ảnh rõ ràng, đúng với mô tả</li>
            <li>Liên hệ hợp lệ và có thể xác minh</li>
          </ul>

          <h3 className="text-lg font-medium text-gray-800 mb-2">4.2 Nội dung bị cấm</h3>
          <ul className="list-disc pl-6 text-gray-600 space-y-1">
            <li>Tin giả, lừa đảo, gian lận</li>
            <li>Sản phẩm/dịch vụ bất hợp pháp</li>
            <li>Nội dung khiêu dâm, bạo lực</li>
            <li>Phân biệt đối xử, thù hận</li>
            <li>Spam, quảng cáo trái phép</li>
            <li>Vi phạm quyền sở hữu trí tuệ</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            5. Quyền của VietHawaii
          </h2>
          <p className="text-gray-600 mb-4">Chúng tôi có quyền:</p>
          <ul className="list-disc pl-6 text-gray-600 space-y-1">
            <li>Xóa hoặc từ chối tin đăng vi phạm quy định</li>
            <li>Tạm khóa hoặc xóa tài khoản vi phạm</li>
            <li>Chỉnh sửa nội dung để phù hợp với quy định</li>
            <li>Thay đổi, tạm ngừng hoặc chấm dứt dịch vụ</li>
            <li>Cập nhật điều khoản sử dụng</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            6. Giới hạn trách nhiệm
          </h2>
          <p className="text-gray-600 mb-4">
            VietHawaii là nền tảng kết nối. Chúng tôi <strong>không chịu trách nhiệm</strong> về:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-1">
            <li>Độ chính xác của thông tin trong tin đăng</li>
            <li>Chất lượng sản phẩm/dịch vụ được rao bán</li>
            <li>Giao dịch giữa người dùng với nhau</li>
            <li>Tranh chấp phát sinh từ giao dịch</li>
            <li>Thiệt hại do sử dụng hoặc không thể sử dụng dịch vụ</li>
          </ul>
          <p className="text-gray-600 mt-4 bg-amber-50 p-4 rounded-lg border border-amber-200">
            <strong>Lưu ý:</strong> Hãy cẩn thận khi giao dịch. Kiểm tra kỹ thông tin và gặp mặt
            trực tiếp tại nơi công cộng khi có thể.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            7. Quyền sở hữu trí tuệ
          </h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-1">
            <li>Nội dung website (thiết kế, logo, văn bản) thuộc sở hữu của VietHawaii</li>
            <li>Bạn giữ quyền sở hữu nội dung bạn đăng tải</li>
            <li>Bạn cấp cho VietHawaii quyền sử dụng nội dung để vận hành dịch vụ</li>
            <li>Không sao chép, phân phối nội dung website mà không có phép</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            8. Luật áp dụng
          </h2>
          <p className="text-gray-600">
            Các điều khoản này được điều chỉnh bởi luật pháp của Tiểu bang Hawaii, Hoa Kỳ.
            Mọi tranh chấp sẽ được giải quyết tại tòa án có thẩm quyền tại Hawaii.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            9. Thay đổi điều khoản
          </h2>
          <p className="text-gray-600">
            Chúng tôi có quyền cập nhật điều khoản này bất cứ lúc nào.
            Các thay đổi có hiệu lực ngay khi đăng trên website.
            Việc tiếp tục sử dụng dịch vụ đồng nghĩa với việc bạn chấp nhận điều khoản mới.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            10. Liên hệ
          </h2>
          <p className="text-gray-600 mb-4">
            Nếu có câu hỏi về điều khoản sử dụng, vui lòng liên hệ:
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
