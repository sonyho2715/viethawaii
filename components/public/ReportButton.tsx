'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Flag, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

interface ReportButtonProps {
  itemType: 'LISTING' | 'ARTICLE' | 'USER';
  itemId: number;
  itemTitle?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

const REPORT_REASONS = {
  vn: [
    { value: 'spam', label: 'Spam hoặc quảng cáo' },
    { value: 'scam', label: 'Lừa đảo' },
    { value: 'inappropriate', label: 'Nội dung không phù hợp' },
    { value: 'wrong_category', label: 'Sai danh mục' },
    { value: 'duplicate', label: 'Tin trùng lặp' },
    { value: 'fake', label: 'Thông tin giả mạo' },
    { value: 'offensive', label: 'Ngôn ngữ xúc phạm' },
    { value: 'other', label: 'Lý do khác' },
  ],
  en: [
    { value: 'spam', label: 'Spam or advertising' },
    { value: 'scam', label: 'Scam or fraud' },
    { value: 'inappropriate', label: 'Inappropriate content' },
    { value: 'wrong_category', label: 'Wrong category' },
    { value: 'duplicate', label: 'Duplicate listing' },
    { value: 'fake', label: 'Fake information' },
    { value: 'offensive', label: 'Offensive language' },
    { value: 'other', label: 'Other reason' },
  ],
};

export default function ReportButton({
  itemType,
  itemId,
  itemTitle,
  variant = 'outline',
  size = 'sm',
  className = '',
}: ReportButtonProps) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [details, setDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const reasons = REPORT_REASONS[language] || REPORT_REASONS.vn;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedReason) {
      setError(language === 'vn' ? 'Vui lòng chọn lý do báo cáo' : 'Please select a reason');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemType,
          itemId,
          reason: selectedReason,
          details: details.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setError(language === 'vn'
            ? 'Vui lòng đăng nhập để báo cáo'
            : 'Please login to report');
        } else if (response.status === 409) {
          setError(language === 'vn'
            ? 'Bạn đã báo cáo tin này rồi'
            : 'You have already reported this');
        } else {
          setError(data.error || (language === 'vn' ? 'Đã xảy ra lỗi' : 'An error occurred'));
        }
      } else {
        setIsSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
          // Reset state after close
          setTimeout(() => {
            setIsSuccess(false);
            setSelectedReason('');
            setDetails('');
          }, 300);
        }, 2000);
      }
    } catch {
      setError(language === 'vn'
        ? 'Không thể kết nối. Vui lòng thử lại.'
        : 'Connection failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset state when closing
      setError('');
      if (!isSuccess) {
        setSelectedReason('');
        setDetails('');
      }
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={`text-gray-500 hover:text-red-600 hover:border-red-200 ${className}`}
        onClick={() => setIsOpen(true)}
      >
        <Flag className="h-4 w-4 mr-2" />
        {language === 'vn' ? 'Báo cáo' : 'Report'}
      </Button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5 text-red-600" />
              {language === 'vn' ? 'Báo cáo vi phạm' : 'Report Violation'}
            </DialogTitle>
            <DialogDescription>
              {itemTitle ? (
                language === 'vn'
                  ? `Báo cáo tin đăng: "${itemTitle.slice(0, 50)}${itemTitle.length > 50 ? '...' : ''}"`
                  : `Report listing: "${itemTitle.slice(0, 50)}${itemTitle.length > 50 ? '...' : ''}"`
              ) : (
                language === 'vn'
                  ? 'Cho chúng tôi biết vấn đề với nội dung này'
                  : 'Let us know what\'s wrong with this content'
              )}
            </DialogDescription>
          </DialogHeader>

          {isSuccess ? (
            <div className="py-8 text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {language === 'vn' ? 'Cảm ơn bạn!' : 'Thank you!'}
              </h3>
              <p className="text-gray-600">
                {language === 'vn'
                  ? 'Báo cáo của bạn đã được gửi. Chúng tôi sẽ xem xét sớm nhất.'
                  : 'Your report has been submitted. We will review it soon.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  {language === 'vn' ? 'Lý do báo cáo *' : 'Reason for report *'}
                </Label>
                <div className="grid gap-2">
                  {reasons.map((reason) => (
                    <label
                      key={reason.value}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedReason === reason.value
                          ? 'border-red-600 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="reason"
                        value={reason.value}
                        checked={selectedReason === reason.value}
                        onChange={(e) => setSelectedReason(e.target.value)}
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          selectedReason === reason.value
                            ? 'border-red-600'
                            : 'border-gray-300'
                        }`}
                      >
                        {selectedReason === reason.value && (
                          <div className="w-2 h-2 rounded-full bg-red-600" />
                        )}
                      </div>
                      <span className="text-sm">{reason.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="details" className="text-sm font-medium">
                  {language === 'vn' ? 'Chi tiết thêm (tùy chọn)' : 'Additional details (optional)'}
                </Label>
                <textarea
                  id="details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder={language === 'vn'
                    ? 'Mô tả thêm về vấn đề...'
                    : 'Describe the issue...'}
                  rows={3}
                  maxLength={500}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-400 text-right">
                  {details.length}/500
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                >
                  {language === 'vn' ? 'Hủy' : 'Cancel'}
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  disabled={isLoading || !selectedReason}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {language === 'vn' ? 'Đang gửi...' : 'Sending...'}
                    </>
                  ) : (
                    language === 'vn' ? 'Gửi báo cáo' : 'Submit Report'
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
