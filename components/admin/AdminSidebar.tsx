'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Users,
  FileText,
  Clock,
  Settings,
  LogOut,
  Home,
  Newspaper,
  FolderTree,
  Shield,
} from 'lucide-react';

interface AdminSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role: string;
  };
}

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Quản lý Users', icon: Users },
  { href: '/admin/listings', label: 'Tất cả Tin đăng', icon: FileText },
  { href: '/admin/listings/pending', label: 'Chờ duyệt', icon: Clock },
  { href: '/admin/articles', label: 'Tin tức / Bài viết', icon: Newspaper },
  { href: '/admin/categories', label: 'Danh mục', icon: FolderTree },
  { href: '/admin/settings', label: 'Cài đặt', icon: Settings },
];

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">VietHawaii</h1>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-teal-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info & Actions */}
      <div className="p-4 border-t border-gray-800 space-y-3">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Home className="h-5 w-5" />
          <span className="text-sm">Về trang chủ</span>
        </Link>

        <div className="px-4 py-3 bg-gray-800 rounded-lg">
          <p className="text-sm font-medium truncate">{user.name || 'Admin'}</p>
          <p className="text-xs text-gray-400 truncate">{user.email}</p>
          <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-teal-600 rounded">
            {user.role}
          </span>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 w-full px-4 py-2 text-red-400 hover:text-red-300 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
