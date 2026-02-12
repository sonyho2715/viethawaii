'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import NotificationBell from '@/components/public/NotificationBell';
import {
  Search,
  Menu,
  X,
  Globe,
  PlusCircle,
  Home,
  Briefcase,
  ShoppingBag,
  MessageCircle,
  User,
  FileText,
  Heart,
  Settings,
  LogOut,
  LayoutDashboard,
  Wrench,
  Calendar,
  Tag,
  Newspaper,
  Calculator,
} from 'lucide-react';

const MOBILE_CATEGORIES = [
  { id: 'classifieds', labelEn: 'Classifieds', labelVn: 'Rao vặt', icon: ShoppingBag, href: '/rao-vat' },
  { id: 'jobs', labelEn: 'Jobs', labelVn: 'Việc làm', icon: Briefcase, href: '/viec-lam' },
  { id: 'housing', labelEn: 'Housing', labelVn: 'Nhà ở', icon: Home, href: '/nha-o' },
  { id: 'services', labelEn: 'Services', labelVn: 'Dịch vụ', icon: Wrench, href: '/dich-vu' },
  { id: 'events', labelEn: 'Events', labelVn: 'Sự kiện', icon: Calendar, href: '/su-kien' },
  { id: 'deals', labelEn: 'Deals', labelVn: 'Khuyến mãi', icon: Tag, href: '/khuyen-mai' },
];

const DESKTOP_NAV = [
  { labelEn: 'Classifieds', labelVn: 'Rao vặt', href: '/rao-vat', icon: ShoppingBag },
  { labelEn: 'Jobs', labelVn: 'Việc làm', href: '/viec-lam', icon: Briefcase },
  { labelEn: 'Housing', labelVn: 'Nhà ở', href: '/nha-o', icon: Home },
  { labelEn: 'Services', labelVn: 'Dịch vụ', href: '/dich-vu', icon: Wrench },
  { labelEn: 'News', labelVn: 'Tin tức', href: '/tin-tuc', icon: Newspaper },
  { labelEn: 'Events', labelVn: 'Sự kiện', href: '/su-kien', icon: Calendar },
  { labelEn: 'Tools', labelVn: 'Công cụ', href: '/cong-cu', icon: Calculator },
];

export default function Header() {
  const { data: session } = useSession();
  const { language, toggleLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/tim-kiem?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPERADMIN';

  return (
    <>
      {/* Gradient Accent Top Bar */}
      <div className="hidden md:block bg-gradient-to-r from-teal-600 via-teal-500 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 flex justify-between items-center text-xs">
          <span className="font-medium tracking-wide">
            {language === 'vn'
              ? '🌺 Cộng đồng Việt Nam tại Hawaii'
              : '🌺 Vietnamese Community in Hawaii'}
          </span>
          <div className="flex items-center gap-4">
            <Link href="/lien-he" className="hover:text-white/80 transition-colors">
              {language === 'vn' ? 'Liên hệ' : 'Contact'}
            </Link>
            <Link href="/hoi-dap" className="hover:text-white/80 transition-colors">
              FAQ
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-white border-b border-gray-100 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo & Mobile Menu Button */}
            <div className="flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 -ml-2 mr-2 md:hidden text-gray-600 hover:text-teal-600 transition-colors"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Link href="/" className="flex flex-col group">
                <h1 className="text-2xl md:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-teal-500 via-teal-600 to-blue-700 tracking-tighter transition-all group-hover:scale-105">
                  VietHawaii
                </h1>
                <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold hidden sm:block transition-colors group-hover:text-teal-500">
                  {language === 'vn' ? 'Kết nối cộng đồng' : 'Connecting the Community'}
                </span>
              </Link>
            </div>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8 relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400 group-focus-within:text-teal-500 transition-colors" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-2xl leading-5 bg-gray-50/80 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/50 transition-all duration-200 sm:text-sm shadow-inner"
                placeholder={language === 'vn' ? "Tìm nhà ở, việc làm, tin tức..." : "Search housing, jobs, news..."}
              />
              <div className="absolute inset-y-0 right-0 pr-1.5 flex items-center">
                <kbd className="hidden lg:inline-flex items-center px-2 py-0.5 rounded border border-gray-200 bg-white text-[10px] font-medium text-gray-400">
                  ⌘K
                </kbd>
              </div>
            </form>

            {/* Right Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={toggleLanguage}
                className="flex items-center px-3 py-2 text-xs font-bold text-gray-600 bg-gray-50 rounded-xl hover:bg-teal-50 hover:text-teal-600 transition-all border border-gray-100 uppercase tracking-widest"
              >
                <Globe size={14} className="mr-1.5" />
                {language === 'vn' ? 'VN' : 'EN'}
              </button>

              <Button asChild className="hidden sm:flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-bold rounded-2xl text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 hover:-translate-y-0.5 transition-all">
                <Link href="/rao-vat/dang-tin">
                  <PlusCircle size={18} className="mr-2" />
                  {language === 'vn' ? 'Đăng Tin' : 'Post Ad'}
                </Link>
              </Button>

              {session?.user && <NotificationBell />}

              {/* User Menu */}
              {session?.user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="h-9 w-9 rounded-full bg-gradient-to-tr from-teal-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs cursor-pointer ring-2 ring-white shadow-md hover:shadow-lg transition-all hover:scale-105">
                      {session.user.name?.charAt(0).toUpperCase() || 'U'}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/tai-khoan" className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        {t.my_account}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/tai-khoan/tin-dang" className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        {t.my_listings}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/tai-khoan/da-luu" className="flex items-center">
                        <Heart className="h-4 w-4 mr-2" />
                        {t.saved_items}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/tai-khoan/cai-dat" className="flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        {t.settings}
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="flex items-center">
                            <LayoutDashboard className="h-4 w-4 mr-2" />
                            {t.admin_dashboard}
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOut()}
                      className="text-red-600"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {t.logout}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  href="/dang-nhap"
                  className="h-9 w-9 rounded-full bg-gradient-to-tr from-teal-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs cursor-pointer ring-2 ring-white shadow-md hover:shadow-lg transition-all hover:scale-105"
                >
                  VH
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Category Nav */}
        <div className="hidden md:block border-t border-gray-100 bg-gray-50/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-1 py-1.5 overflow-x-auto">
              {DESKTOP_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 font-medium rounded-lg hover:bg-white hover:text-teal-600 hover:shadow-sm transition-all whitespace-nowrap"
                >
                  <item.icon size={14} />
                  {language === 'vn' ? item.labelVn : item.labelEn}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer - Slide in from left */}
      <div className={`md:hidden fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-out overflow-y-auto ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-5 space-y-4">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600">
                VietHawaii
              </h2>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Menu</p>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="relative mb-2">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              placeholder={language === 'vn' ? "Tìm kiếm..." : "Search..."}
            />
          </form>

          {/* Category Links */}
          <div className="space-y-0.5">
            {MOBILE_CATEGORIES.map(cat => (
              <Link
                key={cat.id}
                href={cat.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center text-base font-medium text-gray-700 py-3 px-3 rounded-xl hover:bg-teal-50 hover:text-teal-600 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
                  <cat.icon size={16} className="text-gray-500" />
                </div>
                {language === 'vn' ? cat.labelVn : cat.labelEn}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-gray-100 space-y-0.5">
            <Link
              href="/tin-tuc"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center text-base font-medium text-gray-700 py-3 px-3 rounded-xl hover:bg-teal-50 hover:text-teal-600 transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
                <Newspaper size={16} className="text-gray-500" />
              </div>
              {language === 'vn' ? 'Tin tức' : 'News'}
            </Link>
            <Link
              href="/cong-cu"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center text-base font-medium text-gray-700 py-3 px-3 rounded-xl hover:bg-teal-50 hover:text-teal-600 transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
                <Calculator size={16} className="text-gray-500" />
              </div>
              {language === 'vn' ? 'Công cụ' : 'Tools'}
            </Link>
          </div>

          <div className="pt-4 space-y-3">
            <Button asChild className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3 rounded-xl font-bold hover:from-teal-600 hover:to-teal-700 shadow-md">
              <Link href="/rao-vat/dang-tin" onClick={() => setIsMobileMenuOpen(false)}>
                <PlusCircle size={18} className="mr-2" />
                {language === 'vn' ? 'Đăng Tin' : 'Post Ad'}
              </Link>
            </Button>

            {!session?.user && (
              <div className="flex gap-3">
                <Button asChild variant="outline" className="flex-1 rounded-xl">
                  <Link href="/dang-nhap" onClick={() => setIsMobileMenuOpen(false)}>
                    {language === 'vn' ? 'Đăng nhập' : 'Sign In'}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1 rounded-xl">
                  <Link href="/dang-ky" onClick={() => setIsMobileMenuOpen(false)}>
                    {language === 'vn' ? 'Đăng ký' : 'Sign Up'}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
