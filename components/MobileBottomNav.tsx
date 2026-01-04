'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Newspaper, ShoppingBag, Wrench, User, PlusCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { name: 'Trang Chủ', href: '/', icon: Home },
    { name: 'Tin Tức', href: '/news', icon: Newspaper },
    { name: 'Đăng Tin', href: '/rao-vat/dang-tin', icon: PlusCircle, isPost: true },
    { name: 'Rao Vặt', href: '/rao-vat', icon: ShoppingBag },
    { name: session ? 'Tài Khoản' : 'Đăng Nhập', href: session ? '/dashboard' : '/auth/signin', icon: User },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-pb">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          if (item.isPost) {
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-5"
              >
                <div className="w-14 h-14 bg-gradient-to-r from-warm-500 to-warm-600 rounded-full flex items-center justify-center shadow-lg">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium text-warm-600 mt-1">{item.name}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 py-2"
            >
              <Icon className={`w-6 h-6 ${active ? 'text-primary-600' : 'text-gray-500'}`} />
              <span className={`text-xs mt-1 ${active ? 'font-bold text-primary-600' : 'font-medium text-gray-500'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
