import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import StructuredData from "@/components/StructuredData";
import SessionProvider from "@/components/SessionProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://viethawaii.com'),
  title: {
    default: 'VietHawaii | Vietnamese Businesses Across Hawaii',
    template: '%s | VietHawaii'
  },
  description: 'Discover authentic Vietnamese businesses, restaurants, and services across all Hawaiian islands. Connect with the Vietnamese community in Hawaii.',
  keywords: [
    'Vietnamese business Hawaii',
    'Vietnamese restaurants Honolulu',
    'Vietnamese services Oahu',
    'Viet community Hawaii',
    'Vietnamese food Hawaii',
    'Vietnamese culture Hawaii',
    'Pho Hawaii',
    'Banh mi Hawaii',
    'Vietnamese shopping Hawaii'
  ],
  authors: [{ name: 'VietHawaii' }],
  creator: 'VietHawaii',
  publisher: 'VietHawaii',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://viethawaii.com',
    siteName: 'VietHawaii',
    title: 'VietHawaii | Vietnamese Businesses Across Hawaii',
    description: 'Discover authentic Vietnamese businesses, restaurants, and services across all Hawaiian islands.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'VietHawaii - Vietnamese Community Directory',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VietHawaii | Vietnamese Businesses Across Hawaii',
    description: 'Discover authentic Vietnamese businesses across Hawaii',
    images: ['/og-image.jpg'],
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
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <StructuredData type="organization" />
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
