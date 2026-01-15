'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
  questionVn: string;
  questionEn: string;
  answerVn: string;
  answerEn: string;
}

const faqCategories = [
  {
    categoryVn: 'Tổng quan',
    categoryEn: 'General',
    faqs: [
      {
        questionVn: 'VietHawaii là gì?',
        questionEn: 'What is VietHawaii?',
        answerVn:
          'VietHawaii là nền tảng trực tuyến kết nối cộng đồng người Việt tại Hawaii. Chúng tôi cung cấp dịch vụ rao vặt (nhà ở, việc làm, mua bán), tin tức cộng đồng, và các công cụ hữu ích như đổi tiền, tính lương, xem giờ Việt Nam.',
        answerEn:
          'VietHawaii is an online platform connecting the Vietnamese community in Hawaii. We provide classified listings (housing, jobs, buy/sell), community news, and useful tools like currency converter, salary calculator, and Vietnam time zone.',
      },
      {
        questionVn: 'VietHawaii có miễn phí không?',
        questionEn: 'Is VietHawaii free to use?',
        answerVn:
          'Có, việc đăng ký tài khoản và đăng tin cơ bản hoàn toàn miễn phí. Chúng tôi có các gói quảng cáo trả phí cho những ai muốn tin đăng được nhiều người xem hơn.',
        answerEn:
          'Yes, registering an account and posting basic listings is completely free. We offer paid advertising packages for those who want their listings to reach more viewers.',
      },
      {
        questionVn: 'Ai có thể sử dụng VietHawaii?',
        questionEn: 'Who can use VietHawaii?',
        answerVn:
          'Bất kỳ ai đều có thể truy cập và xem tin trên VietHawaii. Để đăng tin, bạn cần tạo tài khoản và phải từ 18 tuổi trở lên.',
        answerEn:
          'Anyone can access and view listings on VietHawaii. To post listings, you need to create an account and be at least 18 years old.',
      },
    ],
  },
  {
    categoryVn: 'Tài khoản',
    categoryEn: 'Account',
    faqs: [
      {
        questionVn: 'Làm thế nào để đăng ký tài khoản?',
        questionEn: 'How do I register an account?',
        answerVn:
          'Nhấn nút "Đăng ký" ở góc trên bên phải, nhập email và mật khẩu, sau đó xác nhận email. Bạn cũng có thể đăng ký bằng tài khoản Google.',
        answerEn:
          'Click the "Register" button in the top right corner, enter your email and password, then verify your email. You can also register using your Google account.',
      },
      {
        questionVn: 'Tôi quên mật khẩu, phải làm sao?',
        questionEn: 'I forgot my password, what should I do?',
        answerVn:
          'Truy cập trang Đăng nhập, nhấn "Quên mật khẩu", nhập email của bạn. Chúng tôi sẽ gửi link đặt lại mật khẩu qua email.',
        answerEn:
          'Go to the Login page, click "Forgot password", enter your email. We will send a password reset link to your email.',
      },
      {
        questionVn: 'Làm sao để xóa tài khoản?',
        questionEn: 'How do I delete my account?',
        answerVn:
          'Vào phần Cài đặt tài khoản, cuộn xuống phần "Xóa tài khoản" và làm theo hướng dẫn. Hoặc liên hệ contact@viethawaii.com để được hỗ trợ.',
        answerEn:
          'Go to Account Settings, scroll down to "Delete account" section and follow the instructions. Or contact contact@viethawaii.com for assistance.',
      },
    ],
  },
  {
    categoryVn: 'Đăng tin',
    categoryEn: 'Posting Listings',
    faqs: [
      {
        questionVn: 'Làm thế nào để đăng tin rao vặt?',
        questionEn: 'How do I post a classified listing?',
        answerVn:
          'Đăng nhập vào tài khoản, chọn danh mục phù hợp (Nhà ở, Việc làm, Rao vặt, Dịch vụ), nhấn "Đăng tin", điền thông tin và tải hình ảnh lên. Tin sẽ được kiểm duyệt trước khi hiển thị.',
        answerEn:
          'Log into your account, select the appropriate category (Housing, Jobs, Classifieds, Services), click "Post", fill in the information and upload images. Listings will be reviewed before being published.',
      },
      {
        questionVn: 'Tin của tôi bị từ chối, tại sao?',
        questionEn: 'My listing was rejected, why?',
        answerVn:
          'Tin có thể bị từ chối vì: thông tin không rõ ràng, hình ảnh không phù hợp, vi phạm điều khoản sử dụng, hoặc thuộc danh mục bị cấm. Kiểm tra email để xem lý do cụ thể.',
        answerEn:
          'Listings may be rejected due to: unclear information, inappropriate images, terms of service violations, or prohibited categories. Check your email for the specific reason.',
      },
      {
        questionVn: 'Tin đăng được hiển thị trong bao lâu?',
        questionEn: 'How long are listings displayed?',
        answerVn:
          'Tin đăng miễn phí được hiển thị trong 30 ngày. Sau đó, bạn có thể gia hạn hoặc đăng lại. Tin quảng cáo có thời hạn tùy theo gói dịch vụ.',
        answerEn:
          'Free listings are displayed for 30 days. After that, you can renew or repost. Promoted listings have durations based on the service package.',
      },
      {
        questionVn: 'Tôi có thể chỉnh sửa tin đã đăng không?',
        questionEn: 'Can I edit my posted listing?',
        answerVn:
          'Có, vào phần "Tin đăng của tôi" trong tài khoản, chọn tin muốn sửa và nhấn "Chỉnh sửa". Thay đổi lớn có thể cần được kiểm duyệt lại.',
        answerEn:
          'Yes, go to "My Listings" in your account, select the listing you want to edit and click "Edit". Major changes may require re-moderation.',
      },
    ],
  },
  {
    categoryVn: 'An toàn giao dịch',
    categoryEn: 'Transaction Safety',
    faqs: [
      {
        questionVn: 'Làm sao để tránh bị lừa đảo?',
        questionEn: 'How to avoid scams?',
        answerVn:
          'Luôn gặp mặt trực tiếp tại nơi công cộng khi giao dịch. Không chuyển tiền trước khi xem hàng. Cẩn thận với giá quá rẻ bất thường. Kiểm tra thông tin người bán. Báo cáo tin đáng ngờ cho chúng tôi.',
        answerEn:
          'Always meet in person at public places for transactions. Never send money before seeing the item. Be cautious of unusually low prices. Verify seller information. Report suspicious listings to us.',
      },
      {
        questionVn: 'VietHawaii có bảo đảm giao dịch không?',
        questionEn: 'Does VietHawaii guarantee transactions?',
        answerVn:
          'VietHawaii là nền tảng kết nối, không trực tiếp tham gia giao dịch giữa người dùng. Chúng tôi khuyến khích mọi người cẩn thận và tự chịu trách nhiệm khi giao dịch.',
        answerEn:
          'VietHawaii is a connecting platform and does not directly participate in transactions between users. We encourage everyone to be careful and take responsibility for their own transactions.',
      },
      {
        questionVn: 'Báo cáo tin vi phạm như thế nào?',
        questionEn: 'How do I report a violation?',
        answerVn:
          'Nhấn nút "Báo cáo" trên mỗi tin đăng hoặc gửi email đến contact@viethawaii.com với thông tin chi tiết về tin vi phạm.',
        answerEn:
          'Click the "Report" button on each listing or send an email to contact@viethawaii.com with detailed information about the violation.',
      },
    ],
  },
  {
    categoryVn: 'Quảng cáo & Cookies',
    categoryEn: 'Advertising & Cookies',
    faqs: [
      {
        questionVn: 'VietHawaii có hiển thị quảng cáo không?',
        questionEn: 'Does VietHawaii display ads?',
        answerVn:
          'Có, chúng tôi sử dụng Google AdSense để hiển thị quảng cáo. Doanh thu từ quảng cáo giúp chúng tôi duy trì dịch vụ miễn phí cho cộng đồng.',
        answerEn:
          'Yes, we use Google AdSense to display advertisements. Ad revenue helps us maintain free services for the community.',
      },
      {
        questionVn: 'Cookies là gì và VietHawaii sử dụng như thế nào?',
        questionEn: 'What are cookies and how does VietHawaii use them?',
        answerVn:
          'Cookies là tệp nhỏ lưu trên trình duyệt của bạn. Chúng tôi sử dụng cookies để duy trì phiên đăng nhập, ghi nhớ tùy chọn ngôn ngữ, và hiển thị quảng cáo phù hợp. Xem chi tiết trong Chính sách Bảo mật.',
        answerEn:
          'Cookies are small files stored on your browser. We use cookies to maintain login sessions, remember language preferences, and display relevant ads. See details in our Privacy Policy.',
      },
      {
        questionVn: 'Làm sao để tắt quảng cáo cá nhân hóa?',
        questionEn: 'How to opt out of personalized ads?',
        answerVn:
          'Truy cập Google Ads Settings (https://www.google.com/settings/ads) để tắt quảng cáo cá nhân hóa. Bạn cũng có thể điều chỉnh cài đặt cookies trong trình duyệt.',
        answerEn:
          'Visit Google Ads Settings (https://www.google.com/settings/ads) to opt out of personalized advertising. You can also adjust cookie settings in your browser.',
      },
    ],
  },
];

function FAQAccordion({ faq, isOpen, onToggle }: { faq: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
      >
        <div>
          <span className="font-medium text-gray-900 block">{faq.questionVn}</span>
          <span className="text-sm text-gray-500">{faq.questionEn}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-gray-700 mb-2">{faq.answerVn}</p>
          <p className="text-sm text-gray-500 italic">{faq.answerEn}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 mb-4">
          <HelpCircle className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Câu Hỏi Thường Gặp</h1>
        <p className="text-gray-600">Frequently Asked Questions (FAQ)</p>
        <p className="text-sm text-gray-500 mt-2">
          Tìm câu trả lời cho những thắc mắc phổ biến về VietHawaii
        </p>
      </div>

      {/* FAQ Sections */}
      <div className="space-y-8">
        {faqCategories.map((category, catIndex) => (
          <div key={category.categoryVn} className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">{category.categoryVn}</h2>
            <p className="text-sm text-gray-500 mb-4">{category.categoryEn}</p>
            <div className="space-y-3">
              {category.faqs.map((faq, faqIndex) => {
                const key = `${catIndex}-${faqIndex}`;
                return (
                  <FAQAccordion
                    key={key}
                    faq={faq}
                    isOpen={openItems[key] || false}
                    onToggle={() => toggleItem(key)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Still have questions */}
      <div className="mt-10 text-center p-8 bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Vẫn còn thắc mắc?</h3>
        <p className="text-gray-600 mb-4">
          Nếu bạn không tìm thấy câu trả lời, hãy liên hệ với chúng tôi.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/lien-he"
            className="inline-flex items-center justify-center px-6 py-3 bg-teal-600 text-white font-medium rounded-full hover:bg-teal-700 transition-colors"
          >
            Liên hệ hỗ trợ
          </Link>
          <a
            href="mailto:contact@viethawaii.com"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-teal-600 font-medium rounded-full border border-teal-200 hover:bg-teal-50 transition-colors"
          >
            contact@viethawaii.com
          </a>
        </div>
      </div>
    </div>
  );
}
