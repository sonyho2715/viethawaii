'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import {
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ChevronUp,
  Heart,
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
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative">
      {/* SVG Wave Divider */}
      <div className="relative -mb-1">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 40C240 10 480 70 720 40C960 10 1200 70 1440 40V80H0V40Z"
            fill="url(#footer-gradient)"
          />
          <defs>
            <linearGradient id="footer-gradient" x1="0" y1="0" x2="1440" y2="0">
              <stop offset="0%" stopColor="#134e4a" />
              <stop offset="50%" stopColor="#1a3a4a" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Main Footer */}
      <div className="bg-gradient-to-br from-teal-950 via-slate-900 to-slate-900 text-gray-300">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand & Contact */}
            <div className="space-y-4">
              <Link href="/" className="inline-block">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-400">
                  VietHawaii
                </h2>
              </Link>
              <p className="text-sm text-gray-400 leading-relaxed">
                {t.tagline}
              </p>
              <div className="space-y-2.5 text-sm">
                <a
                  href="mailto:contact@viethawaii.com"
                  className="flex items-center gap-2.5 text-gray-400 hover:text-teal-400 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-teal-500/10 transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                  contact@viethawaii.com
                </a>
                <a
                  href="tel:+18081234567"
                  className="flex items-center gap-2.5 text-gray-400 hover:text-teal-400 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-teal-500/10 transition-colors">
                    <Phone className="h-4 w-4" />
                  </div>
                  (808) 123-4567
                </a>
                <div className="flex items-center gap-2.5 text-gray-400">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <MapPin className="h-4 w-4" />
                  </div>
                  Honolulu, Hawaii
                </div>
              </div>
              {/* Social Links */}
              <div className="flex gap-3 pt-3">
                <a
                  href="https://facebook.com/viethawaii"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-500/20 transition-all hover:scale-110"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://instagram.com/viethawaii"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-gradient-to-br hover:from-pink-500 hover:to-purple-600 hover:text-white hover:shadow-lg hover:shadow-pink-500/20 transition-all hover:scale-110"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://youtube.com/@viethawaii"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-gradient-to-br hover:from-red-500 hover:to-red-600 hover:text-white hover:shadow-lg hover:shadow-red-500/20 transition-all hover:scale-110"
                  aria-label="YouTube"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t.listings}</h3>
              <ul className="space-y-2.5 text-sm">
                {categoryLinks.map((link) => (
                  <li key={link.key}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-teal-400 transition-colors hover:translate-x-1 inline-block"
                    >
                      {t[link.key as keyof typeof t]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tools */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t.tools}</h3>
              <ul className="space-y-2.5 text-sm">
                {toolLinks.map((link) => (
                  <li key={link.key}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-teal-400 transition-colors hover:translate-x-1 inline-block"
                    >
                      {t[link.key as keyof typeof t]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                {language === 'vn' ? 'Thông tin' : 'Information'}
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/gioi-thieu" className="text-gray-400 hover:text-teal-400 transition-colors hover:translate-x-1 inline-block">
                    {t.about}
                  </Link>
                </li>
                <li>
                  <Link href="/lien-he" className="text-gray-400 hover:text-teal-400 transition-colors hover:translate-x-1 inline-block">
                    {t.contact_us}
                  </Link>
                </li>
                <li>
                  <Link href="/hoi-dap" className="text-gray-400 hover:text-teal-400 transition-colors hover:translate-x-1 inline-block">
                    {language === 'vn' ? 'Hỏi đáp (FAQ)' : 'FAQ'}
                  </Link>
                </li>
                <li>
                  <Link href="/quang-cao" className="text-gray-400 hover:text-teal-400 transition-colors hover:translate-x-1 inline-block">
                    {t.advertise}
                  </Link>
                </li>
                <li>
                  <Link href="/chinh-sach-bao-mat" className="text-gray-400 hover:text-teal-400 transition-colors hover:translate-x-1 inline-block">
                    {t.privacy_policy}
                  </Link>
                </li>
                <li>
                  <Link href="/dieu-khoan" className="text-gray-400 hover:text-teal-400 transition-colors hover:translate-x-1 inline-block">
                    {t.terms}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* "Made with Aloha" + Bottom Bar */}
        <div className="border-t border-white/5">
          <div className="container mx-auto px-4 py-5">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-500">{t.copyright}</p>
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <span>Made with</span>
                <Heart size={14} className="text-red-400 fill-red-400" />
                <span>Aloha in Hawai&apos;i</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-40 w-11 h-11 bg-teal-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-teal-700 transition-all ${
          showBackToTop
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Back to top"
      >
        <ChevronUp size={20} />
      </button>
    </footer>
  );
}
