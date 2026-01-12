'use client';

import { useState } from 'react';
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
} from 'lucide-react';

const MOBILE_CATEGORIES = [
  { id: 'classifieds', labelEn: 'Classifieds', labelVn: 'Rao vặt', icon: ShoppingBag, href: '/rao-vat' },
  { id: 'jobs', labelEn: 'Jobs', labelVn: 'Việc làm', icon: Briefcase, href: '/viec-lam' },
  { id: 'housing', labelEn: 'Housing', labelVn: 'Nhà ở', icon: Home, href: '/nha-o' },
  { id: 'services', labelEn: 'Services', labelVn: 'Dịch vụ', icon: Wrench, href: '/dich-vu' },
  { id: 'events', labelEn: 'Events', labelVn: 'Sự kiện', icon: Calendar, href: '/su-kien' },
  { id: 'deals', labelEn: 'Deals', labelVn: 'Khuyến mãi', icon: Tag, href: '/khuyen-mai' },
];

export default function Header() {
  const { data: session } = useSession();
  const { language, toggleLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/tim-kiem?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPERADMIN';

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo & Mobile Menu Button */}
            <div className="flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 -ml-2 mr-2 md:hidden text-gray-600 hover:text-teal-600 transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Link href="/" className="flex flex-col">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600 tracking-tight">
                  VietHawaii
                </h1>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold hidden sm:block">
                  {language === 'vn' ? 'Kết nối cộng đồng' : 'Connecting the Community'}
                </span>
              </Link>
            </div>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-150 ease-in-out sm:text-sm"
                placeholder={language === 'vn' ? "Tìm kiếm nhà ở, việc làm, tin tức..." : "Search for housing, jobs, news..."}
              />
            </form>

            {/* Right Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={toggleLanguage}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Globe size={16} className="mr-1.5" />
                {language === 'vn' ? 'VN' : 'EN'}
              </button>

              <Button asChild className="hidden sm:flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-teal-600 hover:bg-teal-700 shadow-md hover:shadow-lg transition-all">
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
                    <button className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-teal-400 flex items-center justify-center text-white font-bold text-xs cursor-pointer ring-2 ring-white shadow-sm hover:shadow-md transition-shadow">
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
                  className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-teal-400 flex items-center justify-center text-white font-bold text-xs cursor-pointer ring-2 ring-white shadow-sm hover:shadow-md transition-shadow"
                >
                  VH
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white overflow-y-auto">
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-xl font-bold text-teal-600">Menu</h2>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative mb-6">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder={language === 'vn' ? "Tìm kiếm..." : "Search..."}
              />
            </form>

            {MOBILE_CATEGORIES.map(cat => (
              <Link
                key={cat.id}
                href={cat.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center text-lg font-medium text-gray-700 py-3 hover:text-teal-600 transition-colors"
              >
                <cat.icon size={20} className="mr-3 text-gray-400" />
                {language === 'vn' ? cat.labelVn : cat.labelEn}
              </Link>
            ))}

            <div className="pt-4 border-t">
              <Link
                href="/tin-tuc"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center text-lg font-medium text-gray-700 py-3 hover:text-teal-600"
              >
                {language === 'vn' ? 'Tin tức' : 'News'}
              </Link>
              <Link
                href="/cong-cu"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center text-lg font-medium text-gray-700 py-3 hover:text-teal-600"
              >
                {language === 'vn' ? 'Công cụ' : 'Tools'}
              </Link>
            </div>

            <Button asChild className="w-full mt-8 bg-teal-600 text-white py-3 rounded-lg font-bold hover:bg-teal-700">
              <Link href="/rao-vat/dang-tin" onClick={() => setIsMobileMenuOpen(false)}>
                <PlusCircle size={18} className="mr-2" />
                {language === 'vn' ? 'Đăng Tin' : 'Post Ad'}
              </Link>
            </Button>

            {!session?.user && (
              <div className="flex gap-3 mt-4">
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/dang-nhap" onClick={() => setIsMobileMenuOpen(false)}>
                    {language === 'vn' ? 'Đăng nhập' : 'Sign In'}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/dang-ky" onClick={() => setIsMobileMenuOpen(false)}>
                    {language === 'vn' ? 'Đăng ký' : 'Sign Up'}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
