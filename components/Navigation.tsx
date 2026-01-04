'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Menu, X, Home, Newspaper, ShoppingBag, Compass, PlusCircle,
  User, LogOut, Heart, Shield, Calculator, Users, Crown,
  ChevronDown, Map, BookOpen, Building2, Calendar, FileText,
  Briefcase, Wrench, DollarSign, Plane
} from 'lucide-react';
import GlobalSearch from '@/components/GlobalSearch';
import LanguageToggle from '@/components/LanguageToggle';

interface NavigationProps {
  businesses?: any[];
}

export default function Navigation({ businesses = [] }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { data: session } = useSession();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { name: 'Trang Chủ', nameEn: 'Home', href: '/', icon: Home },
    {
      name: 'Tin Tức',
      nameEn: 'News',
      href: '/news',
      icon: Newspaper,
      dropdown: [
        { name: 'Tin Cộng Đồng', href: '/news', icon: Users },
        { name: 'Blog', href: '/blog', icon: FileText },
      ]
    },
    {
      name: 'Chợ',
      nameEn: 'Marketplace',
      href: '/rao-vat',
      icon: ShoppingBag,
      dropdown: [
        { name: 'Rao Vặt', href: '/rao-vat', icon: ShoppingBag },
        { name: 'Doanh Nghiệp', href: '/#map', icon: Building2 },
        { name: 'Việc Làm', href: '/rao-vat?category=viec-lam', icon: Briefcase },
      ]
    },
    {
      name: 'Du Lịch',
      nameEn: 'Travel',
      href: '/huong-dan',
      icon: Plane,
      dropdown: [
        { name: 'Hướng Dẫn Định Cư', href: '/huong-dan', icon: BookOpen },
        { name: 'Khám Phá Hawaii', href: '/discover', icon: Compass },
        { name: 'Bản Đồ', href: '/#map', icon: Map },
      ]
    },
    {
      name: 'Công Cụ',
      nameEn: 'Tools',
      href: '/cong-cu',
      icon: Wrench,
      dropdown: [
        { name: 'Máy Tính', href: '/cong-cu', icon: Calculator },
        { name: 'Quy Đổi Tiền', href: '/cong-cu/currency', icon: DollarSign },
      ]
    },
    {
      name: 'Cộng Đồng',
      nameEn: 'Community',
      href: '/cong-dong',
      icon: Users,
      dropdown: [
        { name: 'Tổ Chức', href: '/cong-dong/to-chuc', icon: Building2 },
        { name: 'Sự Kiện', href: '/cong-dong/su-kien', icon: Calendar },
      ]
    },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const handleDropdownToggle = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <span className="text-2xl">🌺</span>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              VietHawaii
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 flex-1 justify-end" ref={dropdownRef}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              const hasDropdown = item.dropdown && item.dropdown.length > 0;

              if (hasDropdown) {
                return (
                  <div key={item.name} className="relative">
                    <button
                      onClick={() => handleDropdownToggle(item.name)}
                      className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-1.5 ${
                        active
                          ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.name}
                      <ChevronDown className={`w-3 h-3 transition-transform ${
                        activeDropdown === item.name ? 'rotate-180' : ''
                      }`} />
                    </button>

                    {activeDropdown === item.name && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-fade-in">
                        {item.dropdown.map((subItem) => {
                          const SubIcon = subItem.icon;
                          return (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              onClick={() => setActiveDropdown(null)}
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-gray-700"
                            >
                              <SubIcon className="w-4 h-4 text-primary-500" />
                              <span className="font-medium">{subItem.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                    active
                      ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
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

            {/* Post Button */}
            <Link
              href="/rao-vat/dang-tin"
              className="ml-2 px-4 py-2 bg-gradient-to-r from-warm-500 to-warm-600 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Đăng Tin
            </Link>

            {/* User Menu */}
            {session ? (
              <div className="relative ml-2">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {session.user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="font-semibold text-sm text-gray-900 hidden xl:block">{session.user?.name}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-gray-700"
                    >
                      <User className="w-4 h-4" />
                      <span className="font-semibold">Trang Cá Nhân</span>
                    </Link>
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-gray-700"
                    >
                      <Heart className="w-4 h-4" />
                      <span className="font-semibold">Yêu Thích</span>
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
                      <span className="font-semibold">Đăng Xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="ml-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Đăng Nhập
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
                  <div key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                        active
                          ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                    {item.dropdown && (
                      <div className="ml-8 mt-1 space-y-1">
                        {item.dropdown.map((subItem) => {
                          const SubIcon = subItem.icon;
                          return (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              onClick={() => setIsOpen(false)}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:text-primary-600"
                            >
                              <SubIcon className="w-4 h-4" />
                              {subItem.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile Post Button */}
            <div className="mt-4 px-4">
              <Link
                href="/rao-vat/dang-tin"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-warm-500 to-warm-600 text-white rounded-lg font-semibold"
              >
                <PlusCircle className="w-5 h-5" />
                Đăng Tin Ngay
              </Link>
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
                  className="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm bg-gradient-to-r from-primary-500 to-accent-500 text-white"
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
