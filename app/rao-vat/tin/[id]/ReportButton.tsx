'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { reportListing } from '@/app/rao-vat/actions';
import { Flag, Loader2, Check, X, AlertTriangle } from 'lucide-react';

interface ReportButtonProps {
  listingId: string;
}

type ReportReason = 'spam' | 'scam' | 'prohibited' | 'offensive' | 'misleading' | 'duplicate' | 'other';

const reportReasons: { value: ReportReason; labelVi: string; labelEn: string }[] = [
  { value: 'spam', labelVi: 'Spam hoặc quảng cáo lặp lại', labelEn: 'Spam or repeated advertising' },
  { value: 'scam', labelVi: 'Lừa đảo hoặc gian lận', labelEn: 'Scam or fraud' },
  { value: 'prohibited', labelVi: 'Hàng cấm hoặc bất hợp pháp', labelEn: 'Prohibited or illegal items' },
  { value: 'offensive', labelVi: 'Nội dung xúc phạm', labelEn: 'Offensive content' },
  { value: 'misleading', labelVi: 'Thông tin sai lệch', labelEn: 'Misleading information' },
  { value: 'duplicate', labelVi: 'Tin đăng trùng lặp', labelEn: 'Duplicate listing' },
  { value: 'other', labelVi: 'Lý do khác', labelEn: 'Other reason' },
];

export default function ReportButton({ listingId }: ReportButtonProps) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [reason, setReason] = useState<ReportReason | ''>('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason) {
      setError(language === 'vi' ? 'Vui lòng chọn lý do' : 'Please select a reason');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await reportListing({
        listingId,
        reason,
        description: description || undefined,
      });

      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || (language === 'vi' ? 'Không thể gửi báo cáo' : 'Could not submit report'));
      }
    } catch {
      setError(language === 'vi' ? 'Có lỗi xảy ra' : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-green-700">
              {language === 'vi' ? 'Đã gửi báo cáo!' : 'Report submitted!'}
            </p>
            <p className="text-sm text-green-600">
              {language === 'vi'
                ? 'Cảm ơn bạn đã giúp giữ an toàn cho cộng đồng.'
                : 'Thank you for helping keep our community safe.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition"
      >
        <Flag className="w-4 h-4" />
        {language === 'vi' ? 'Báo cáo vi phạm' : 'Report'}
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                  {language === 'vi' ? 'Báo Cáo Vi Phạm' : 'Report Listing'}
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'vi' ? 'Lý do báo cáo *' : 'Reason for report *'}
                </label>
                <div className="space-y-2">
                  {reportReasons.map((r) => (
                    <label
                      key={r.value}
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${
                        reason === r.value
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="reason"
                        value={r.value}
                        checked={reason === r.value}
                        onChange={(e) => setReason(e.target.value as ReportReason)}
                        className="w-4 h-4 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-gray-700">
                        {language === 'vi' ? r.labelVi : r.labelEn}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'vi' ? 'Chi tiết (tùy chọn)' : 'Details (optional)'}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  placeholder={
                    language === 'vi'
                      ? 'Mô tả thêm về vấn đề...'
                      : 'Describe the issue in more detail...'
                  }
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  {language === 'vi' ? 'Hủy' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {language === 'vi' ? 'Đang gửi...' : 'Sending...'}
                    </>
                  ) : (
                    <>
                      <Flag className="w-4 h-4" />
                      {language === 'vi' ? 'Gửi Báo Cáo' : 'Submit Report'}
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                {language === 'vi'
                  ? 'Báo cáo sai sự thật có thể dẫn đến việc tài khoản bị khóa.'
                  : 'False reports may result in account suspension.'}
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
