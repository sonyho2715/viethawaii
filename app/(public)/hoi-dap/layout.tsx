import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Câu Hỏi Thường Gặp (FAQ) | VietHawaii',
  description:
    'Tìm câu trả lời cho những thắc mắc phổ biến về VietHawaii - đăng ký, đăng tin, an toàn giao dịch, quảng cáo và cookies.',
  keywords: [
    'FAQ VietHawaii',
    'hỏi đáp',
    'câu hỏi thường gặp',
    'hướng dẫn sử dụng',
    'trợ giúp',
    'Vietnamese Hawaii FAQ',
  ],
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
