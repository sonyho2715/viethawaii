'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Share2,
  Link2,
  Check,
  Facebook,
  MessageCircle,
  Printer,
} from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  description?: string;
  url?: string;
  showPrint?: boolean;
}

export default function ShareButtons({
  title,
  description,
  url,
  showPrint = true,
}: ShareButtonsProps) {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || '');

  const shareLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-[#1877F2] hover:bg-[#0d65d9]',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: 'Zalo',
      icon: MessageCircle,
      color: 'bg-[#0068FF] hover:bg-[#0052cc]',
      url: `https://zalo.me/share/?url=${encodedUrl}&title=${encodedTitle}`,
    },
    {
      name: 'Messenger',
      icon: MessageCircle,
      color: 'bg-gradient-to-r from-[#00B2FF] to-[#006AFF] hover:opacity-90',
      url: `fb-messenger://share/?link=${encodedUrl}`,
      fallback: `https://www.facebook.com/dialog/send?link=${encodedUrl}&app_id=291494419107518&redirect_uri=${encodedUrl}`,
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = (link: typeof shareLinks[0]) => {
    // Try native share first for mobile
    if (link.name === 'Messenger' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      window.location.href = link.url;
      // Fallback after delay if app not installed
      setTimeout(() => {
        if (link.fallback) {
          window.open(link.fallback, '_blank');
        }
      }, 1500);
    } else {
      window.open(link.fallback || link.url, '_blank', 'width=600,height=400');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          {language === 'vn' ? 'Chia se' : 'Share'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {language === 'vn' ? 'Chia se tin dang' : 'Share Listing'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Social Share Buttons */}
          <div className="grid grid-cols-3 gap-3">
            {shareLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleShare(link)}
                className={`${link.color} text-white p-3 rounded-lg flex flex-col items-center gap-2 transition-all`}
              >
                <link.icon className="h-6 w-6" />
                <span className="text-xs font-medium">{link.name}</span>
              </button>
            ))}
          </div>

          {/* Copy Link */}
          <div className="flex items-center gap-2">
            <div className="flex-1 p-3 bg-gray-100 rounded-lg text-sm text-gray-600 truncate">
              {shareUrl}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="flex-shrink-0"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1 text-green-600" />
                  {language === 'vn' ? 'Da sao chep' : 'Copied'}
                </>
              ) : (
                <>
                  <Link2 className="h-4 w-4 mr-1" />
                  {language === 'vn' ? 'Sao chep' : 'Copy'}
                </>
              )}
            </Button>
          </div>

          {/* Print Button */}
          {showPrint && (
            <Button
              variant="outline"
              className="w-full"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4 mr-2" />
              {language === 'vn' ? 'In tin dang' : 'Print Listing'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
