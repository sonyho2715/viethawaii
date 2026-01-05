'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import {
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

const categoryLinks = [
  { key: 'housing', href: '/rao-vat/nha-o' },
  { key: 'jobs', href: '/rao-vat/viec-lam' },
  { key: 'marketplace', href: '/rao-vat/cho-troi' },
  { key: 'vehicles', href: '/rao-vat/xe-co' },
  { key: 'services', href: '/rao-vat/dich-vu' },
  { key: 'community', href: '/rao-vat/cong-dong' },
];

const toolLinks = [
  { key: 'currency_converter', href: '/cong-cu/doi-tien' },
  { key: 'rent_calculator', href: '/cong-cu/tinh-tien-thue' },
  { key: 'paycheck_calculator', href: '/cong-cu/tinh-luong' },
  { key: 'timezone_converter', href: '/cong-cu/gio-viet-nam' },
  { key: 'tip_calculator', href: '/cong-cu/tinh-tip' },
];

export default function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Contact */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-400">
                VietHawaii
              </h2>
            </Link>
            <p className="text-sm text-gray-400">
              {t.tagline}
            </p>
            <div className="space-y-2 text-sm">
              <a
                href="mailto:contact@viethawaii.com"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4" />
                contact@viethawaii.com
              </a>
              <a
                href="tel:+18081234567"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4" />
                (808) 123-4567
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Honolulu, Hawaii
              </div>
            </div>
            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              <a
                href="https://facebook.com/viethawaii"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com/viethawaii"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-pink-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com/@viethawaii"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-red-600 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.listings}</h3>
            <ul className="space-y-2 text-sm">
              {categoryLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {t[link.key as keyof typeof t]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.tools}</h3>
            <ul className="space-y-2 text-sm">
              {toolLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {t[link.key as keyof typeof t]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {language === 'vn' ? 'Thông tin' : 'Information'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/gioi-thieu" className="hover:text-white transition-colors">
                  {t.about}
                </Link>
              </li>
              <li>
                <Link href="/lien-he" className="hover:text-white transition-colors">
                  {t.contact_us}
                </Link>
              </li>
              <li>
                <Link href="/quang-cao" className="hover:text-white transition-colors">
                  {t.advertise}
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach-bao-mat" className="hover:text-white transition-colors">
                  {t.privacy_policy}
                </Link>
              </li>
              <li>
                <Link href="/dieu-khoan" className="hover:text-white transition-colors">
                  {t.terms}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>{t.copyright}</p>
            <p>
              {language === 'vn'
                ? 'Kết nối cộng đồng Việt tại Hawaii'
                : 'Connecting the Vietnamese community in Hawaii'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
