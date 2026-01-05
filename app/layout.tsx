import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'VietHawaii - Cộng đồng Việt Nam tại Hawaii',
    template: '%s | VietHawaii',
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
  ],
  authors: [{ name: 'VietHawaii' }],
  creator: 'VietHawaii',
  metadataBase: new URL('https://viethawaii.com'),
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    alternateLocale: 'en_US',
    url: 'https://viethawaii.com',
    siteName: 'VietHawaii',
    title: 'VietHawaii - Cộng đồng Việt Nam tại Hawaii',
    description:
      'Nền tảng kết nối cộng đồng Việt Nam tại Hawaii. Rao vặt, tin tức, hướng dẫn và công cụ hữu ích.',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
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
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
