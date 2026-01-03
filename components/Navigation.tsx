'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, Home, Newspaper, BookOpen, Compass, PlusCircle, Mail, Map, User, LogOut, Heart, Settings, Shield, Briefcase, Calculator, Users, Crown } from 'lucide-react';
import GlobalSearch from '@/components/GlobalSearch';
import LanguageToggle from '@/components/LanguageToggle';

interface NavigationProps {
  businesses?: any[];
}

export default function Navigation({ businesses = [] }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { name: 'Trang Chủ', nameEn: 'Home', href: '/', icon: Home },
    { name: 'Doanh Nghiệp', nameEn: 'Businesses', href: '/#map', icon: Map },
    { name: 'Hướng Dẫn', nameEn: 'Guide', href: '/huong-dan', icon: BookOpen },
    { name: 'Rao Vặt', nameEn: 'Classifieds', href: '/rao-vat', icon: Briefcase },
    { name: 'Công Cụ', nameEn: 'Tools', href: '/cong-cu', icon: Calculator },
    { name: 'Cộng Đồng', nameEn: 'Community', href: '/cong-dong', icon: Users },
    { name: 'Tin Tức', nameEn: 'News', href: '/news', icon: Newspaper },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <span className="text-2xl">🌺</span>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
              VietHawaii
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 flex-1 justify-end">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                    active
                      ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
            <div className="ml-2">
              <GlobalSearch businesses={businesses} />
            </div>

            {/* Language Toggle */}
            <div className="ml-2">
              <LanguageToggle variant="compact" />
            </div>

            {/* User Menu */}
            {session ? (
              <div className="relative ml-2">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {session.user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="font-semibold text-sm text-gray-900">{session.user?.name}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-gray-700"
                    >
                      <User className="w-4 h-4" />
                      <span className="font-semibold">My Dashboard</span>
                    </Link>
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-gray-700"
                    >
                      <Heart className="w-4 h-4" />
                      <span className="font-semibold">My Favorites</span>
                    </Link>
                    {(session.user as any)?.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-purple-700"
                      >
                        <Shield className="w-4 h-4" />
                        <span className="font-semibold">Admin Panel</span>
                      </Link>
                    )}
                    <Link
                      href="/thanh-toan"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-yellow-50 transition text-yellow-700"
                    >
                      <Crown className="w-4 h-4" />
                      <span className="font-semibold">Nâng Cấp</span>
                    </Link>
                    <div className="border-t border-gray-200 my-2" />
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        signOut({ callbackUrl: '/' });
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="font-semibold">Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="ml-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                      active
                        ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Mobile User Actions */}
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-1">
              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="w-5 h-5" />
                    Trang Cá Nhân
                  </Link>
                  <Link
                    href="/thanh-toan"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm text-yellow-700 bg-yellow-50 hover:bg-yellow-100"
                  >
                    <Crown className="w-5 h-5" />
                    Nâng Cấp
                  </Link>
                  {(session.user as any)?.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm text-purple-700 hover:bg-purple-50"
                    >
                      <Shield className="w-5 h-5" />
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-5 h-5" />
                    Đăng Xuất
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/signin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm bg-gradient-to-r from-rose-500 to-orange-500 text-white"
                >
                  <User className="w-5 h-5" />
                  Đăng Nhập
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
