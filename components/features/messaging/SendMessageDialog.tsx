'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MessageCircle, Send, Star } from 'lucide-react';

interface SendMessageDialogProps {
  recipientId: string;
  recipientName: string;
  listingId?: number;
  listingTitle?: string;
  currentUserId?: string;
  isPreferred?: boolean;
}

export default function SendMessageDialog({
  recipientId,
  recipientName,
  listingId,
  listingTitle,
  currentUserId,
  isPreferred,
}: SendMessageDialogProps) {
  const { language } = useLanguage();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const isLoggedIn = !!currentUserId;
  const isSelf = currentUserId === recipientId;

  const handleSend = async () => {
    if (!message.trim() || sending) return;
    setError('');
    setSending(true);

    try {
      const res = await fetch('/api/messages/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId,
          listingId,
          message: message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || (language === 'vn' ? 'Không thể gửi tin nhắn' : 'Failed to send message'));
        return;
      }

      setOpen(false);
      setMessage('');
      router.push(`/tai-khoan/tin-nhan?id=${data.data.conversationId}`);
    } catch {
      setError(language === 'vn' ? 'Lỗi kết nối' : 'Connection error');
    } finally {
      setSending(false);
    }
  };

  const handleClick = () => {
    if (!isLoggedIn) {
      router.push(`/dang-nhap?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
  };

  const defaultMessage = listingTitle
    ? language === 'vn'
      ? `Xin chào, tôi quan tâm đến "${listingTitle}". `
      : `Hi, I'm interested in "${listingTitle}". `
    : '';

  return (
    <Dialog open={open} onOpenChange={(o) => {
      setOpen(o);
      if (o && !message) setMessage(defaultMessage);
      if (!o) { setError(''); setMessage(''); }
    }}>
      <DialogTrigger asChild>
        <Button
          variant={isPreferred ? 'default' : 'outline'}
          className={`w-full ${isPreferred ? 'bg-purple-600 hover:bg-purple-700 ring-2 ring-purple-300' : ''}`}
          onClick={handleClick}
          disabled={isSelf}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          {language === 'vn' ? 'Nhắn tin' : 'Message'}
          {isPreferred && <Star className="h-3 w-3 ml-2 fill-current" />}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] sm:max-w-md rounded-2xl">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">
              {language === 'vn' ? 'Gửi tin nhắn cho' : 'Message'} {recipientName}
            </h3>
            {listingTitle && (
              <p className="text-sm text-gray-500 mt-0.5">
                {language === 'vn' ? 'Về:' : 'Re:'} {listingTitle}
              </p>
            )}
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={language === 'vn' ? 'Nhập tin nhắn của bạn...' : 'Type your message...'}
            className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent min-h-[100px]"
            rows={4}
            maxLength={2000}
            autoFocus
          />

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {message.length}/2000
            </span>
            <Button
              onClick={handleSend}
              disabled={!message.trim() || sending}
              className="bg-teal-600 hover:bg-teal-700"
            >
              <Send className="h-4 w-4 mr-2" />
              {sending
                ? (language === 'vn' ? 'Đang gửi...' : 'Sending...')
                : (language === 'vn' ? 'Gửi tin nhắn' : 'Send Message')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
