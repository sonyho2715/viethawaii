'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { sendInquiry } from '@/app/rao-vat/actions';
import { MessageCircle, Loader2, Check } from 'lucide-react';

interface InquiryFormProps {
  listingId: string;
}

export default function InquiryForm({ listingId }: InquiryFormProps) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await sendInquiry({
        listingId,
        senderName: name,
        senderEmail: email,
        senderPhone: phone || undefined,
        message,
      });

      if (result.success) {
        setSuccess(true);
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      } else {
        setError(result.error || 'Không thể gửi tin nhắn');
      }
    } catch {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Check className="w-6 h-6 text-green-600" />
        </div>
        <p className="font-semibold text-green-700">
          {language === 'vi' ? 'Đã gửi tin nhắn!' : 'Message sent!'}
        </p>
        <button
          onClick={() => {
            setSuccess(false);
            setIsOpen(false);
          }}
          className="text-sm text-gray-500 mt-2 hover:underline"
        >
          {language === 'vi' ? 'Đóng' : 'Close'}
        </button>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 w-full px-4 py-3 bg-rose-500 text-white rounded-lg font-semibold hover:bg-rose-600 transition"
      >
        <MessageCircle className="w-5 h-5" />
        {language === 'vi' ? 'Gửi Tin Nhắn' : 'Send Message'}
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h4 className="font-semibold text-gray-900">
        {language === 'vi' ? 'Gửi tin nhắn' : 'Send a message'}
      </h4>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={language === 'vi' ? 'Tên của bạn *' : 'Your name *'}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
        />
      </div>

      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={language === 'vi' ? 'Email *' : 'Email *'}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
        />
      </div>

      <div>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={language === 'vi' ? 'Số điện thoại (tùy chọn)' : 'Phone (optional)'}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
        />
      </div>

      <div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={language === 'vi' ? 'Tin nhắn của bạn *' : 'Your message *'}
          required
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          {language === 'vi' ? 'Hủy' : 'Cancel'}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-rose-500 text-white rounded-lg font-semibold hover:bg-rose-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {language === 'vi' ? 'Đang gửi...' : 'Sending...'}
            </>
          ) : (
            language === 'vi' ? 'Gửi' : 'Send'
          )}
        </button>
      </div>
    </form>
  );
}
