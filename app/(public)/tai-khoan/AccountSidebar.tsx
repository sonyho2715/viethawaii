'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useLanguage } from '@/context/LanguageContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  User,
  FileText,
  Heart,
  Settings,
  LogOut,
  Plus,
  Calendar,
  BarChart3,
} from 'lucide-react';
import type { User as NextAuthUser } from 'next-auth';

interface AccountSidebarProps {
  user: NextAuthUser;
}

export default function AccountSidebar({ user }: AccountSidebarProps) {
  const pathname = usePathname();
  const { language } = useLanguage();

  const menuItems = [
    {
      href: '/tai-khoan',
      icon: User,
      labelVn: 'Tổng quan',
      labelEn: 'Overview',
    },
    {
      href: '/tai-khoan/tin-dang',
      icon: FileText,
      labelVn: 'Tin đăng của tôi',
      labelEn: 'My Listings',
    },
    {
      href: '/tai-khoan/su-kien',
      icon: Calendar,
      labelVn: 'Sự kiện của tôi',
      labelEn: 'My Events',
    },
    {
      href: '/tai-khoan/da-luu',
      icon: Heart,
      labelVn: 'Đã lưu',
      labelEn: 'Saved',
    },
    {
      href: '/tai-khoan/analytics',
      icon: BarChart3,
      labelVn: 'Thống kê',
      labelEn: 'Analytics',
    },
    {
      href: '/tai-khoan/cai-dat',
      icon: Settings,
      labelVn: 'Cài đặt',
      labelEn: 'Settings',
    },
  ];

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <Card>
        <CardContent className="p-6">
          {/* User Info */}
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-14 w-14">
              <AvatarImage src={user.image || undefined} />
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-semibold truncate">
                {user.name || (language === 'vn' ? 'Người dùng' : 'User')}
              </p>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
            </div>
          </div>

          {/* Post Button */}
          <Button asChild className="w-full mb-6 bg-red-600 hover:bg-red-700">
            <Link href="/rao-vat/dang-tin">
              <Plus className="h-4 w-4 mr-2" />
              {language === 'vn' ? 'Đăng tin mới' : 'Post Listing'}
            </Link>
          </Button>

          {/* Navigation */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{language === 'vn' ? item.labelVn : item.labelEn}</span>
                </Link>
              );
            })}

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>{language === 'vn' ? 'Đăng xuất' : 'Sign Out'}</span>
            </button>
          </nav>
        </CardContent>
      </Card>
    </aside>
  );
}
