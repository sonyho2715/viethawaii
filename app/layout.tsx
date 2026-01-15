import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Providers from '@/components/Providers';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import CookieConsent from '@/components/public/CookieConsent';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'VietHawaii - Cộng đồng Việt Nam tại Hawaii',
    template: '%s | VietHawaii',
  },
  other: {
    'google-adsense-account': 'ca-pub-2908205543829494',
  },
  description:
    'Nền tảng kết nối cộng đồng Việt Nam tại Hawaii. Rao vặt, tin tức, hướng dẫn và công cụ hữu ích.',
  keywords: [
    'Vietnamese Hawaii',
    'VietHawaii',
    'Người Việt Hawaii',
    'Cộng đồng Việt',
    'rao vặt',
    'việc làm',
    'nhà thuê',
    'Honolulu',
    'Oahu',
    'Vietnamese community',
    'Hawaii classifieds',
    'Hawaii jobs',
    'Hawaii housing',
  ],
  authors: [{ name: 'VietHawaii' }],
  creator: 'VietHawaii',
  publisher: 'VietHawaii',
  metadataBase: new URL('https://viethawaii.com'),
  alternates: {
    canonical: '/',
    languages: {
      'vi-VN': '/vi',
      'en-US': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    alternateLocale: 'en_US',
    url: 'https://viethawaii.com',
    siteName: 'VietHawaii',
    title: 'VietHawaii - Cộng đồng Việt Nam tại Hawaii',
    description:
      'Nền tảng kết nối cộng đồng Việt Nam tại Hawaii. Rao vặt, tin tức, hướng dẫn và công cụ hữu ích.',
    images: [
      {
        url: 'https://dm7gzduedxzbt8hs.public.blob.vercel-storage.com/og/viethawaii-og.jpg',
        width: 1200,
        height: 630,
        alt: 'VietHawaii - Cộng đồng Việt Nam tại Hawaii',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VietHawaii - Cộng đồng Việt Nam tại Hawaii',
    description:
      'Nền tảng kết nối cộng đồng Việt Nam tại Hawaii. Rao vặt, tin tức, hướng dẫn và công cụ hữu ích.',
    images: ['https://dm7gzduedxzbt8hs.public.blob.vercel-storage.com/og/viethawaii-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add these when you have them
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2908205543829494"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
