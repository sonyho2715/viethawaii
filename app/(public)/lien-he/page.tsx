'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

export default function ContactPage() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmitted(true);
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <Send className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {language === 'vn' ? 'Đã gửi thành công!' : 'Message Sent!'}
        </h1>
        <p className="text-gray-600 mb-6">
          {language === 'vn'
            ? 'Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong vòng 24-48 giờ.'
            : 'Thank you for reaching out. We will respond within 24-48 hours.'}
        </p>
        <Button onClick={() => setSubmitted(false)} variant="outline">
          {language === 'vn' ? 'Gửi tin nhắn khác' : 'Send Another Message'}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 mb-4">
          <MessageSquare className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {language === 'vn' ? 'Liên Hệ' : 'Contact Us'}
        </h1>
        <p className="text-gray-600">
          {language === 'vn'
            ? 'Chúng tôi luôn sẵn sàng lắng nghe bạn'
            : "We're here to help and answer your questions"}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <Mail className="h-6 w-6 text-teal-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
            <a
              href="mailto:contact@viethawaii.com"
              className="text-teal-600 hover:underline"
            >
              contact@viethawaii.com
            </a>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <Phone className="h-6 w-6 text-teal-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">
              {language === 'vn' ? 'Điện thoại' : 'Phone'}
            </h3>
            <a href="tel:+18081234567" className="text-teal-600 hover:underline">
              (808) 123-4567
            </a>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <MapPin className="h-6 w-6 text-teal-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">
              {language === 'vn' ? 'Địa chỉ' : 'Address'}
            </h3>
            <p className="text-gray-600">Honolulu, Hawaii</p>
          </div>

          <div className="p-5 bg-teal-50 rounded-xl border border-teal-100">
            <p className="text-sm text-teal-800">
              {language === 'vn'
                ? 'Thời gian phản hồi: 24-48 giờ (ngày làm việc)'
                : 'Response time: 24-48 hours (business days)'}
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl border border-gray-200 p-6"
            aria-label={language === 'vn' ? 'Biểu mẫu liên hệ' : 'Contact form'}
          >
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'vn' ? 'Họ tên' : 'Name'} *
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  aria-required="true"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder={language === 'vn' ? 'Nguyễn Văn A' : 'John Doe'}
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  aria-required="true"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'vn' ? 'Chủ đề' : 'Subject'} *
              </label>
              <select
                id="contact-subject"
                required
                aria-required="true"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">
                  {language === 'vn' ? '-- Chọn chủ đề --' : '-- Select subject --'}
                </option>
                <option value="general">
                  {language === 'vn' ? 'Câu hỏi chung' : 'General Inquiry'}
                </option>
                <option value="listing">
                  {language === 'vn' ? 'Hỗ trợ đăng tin' : 'Listing Support'}
                </option>
                <option value="account">
                  {language === 'vn' ? 'Vấn đề tài khoản' : 'Account Issues'}
                </option>
                <option value="advertise">
                  {language === 'vn' ? 'Quảng cáo' : 'Advertising'}
                </option>
                <option value="feedback">
                  {language === 'vn' ? 'Góp ý, phản hồi' : 'Feedback'}
                </option>
                <option value="other">
                  {language === 'vn' ? 'Khác' : 'Other'}
                </option>
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'vn' ? 'Nội dung' : 'Message'} *
              </label>
              <textarea
                id="contact-message"
                required
                aria-required="true"
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                placeholder={
                  language === 'vn'
                    ? 'Nhập nội dung tin nhắn của bạn...'
                    : 'Enter your message...'
                }
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-teal-600 hover:bg-teal-700"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {language === 'vn' ? 'Đang gửi...' : 'Sending...'}
                </span>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  {language === 'vn' ? 'Gửi tin nhắn' : 'Send Message'}
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
