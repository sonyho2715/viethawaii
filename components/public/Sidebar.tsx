'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import {
  Filter,
  Home,
  Briefcase,
  ShoppingBag,
  MessageCircle,
  Sun,
} from 'lucide-react';
import type { Category } from '@prisma/client';

interface SidebarProps {
  categories: Category[];
  activeCategory?: string;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'nha-o': Home,
  'viec-lam': Briefcase,
  'mua-ban': ShoppingBag,
  'dich-vu': Briefcase,
  'cong-dong': MessageCircle,
  'xe-co': ShoppingBag,
  'do-dien-tu': ShoppingBag,
};

export default function Sidebar({ categories, activeCategory }: SidebarProps) {
  const { language } = useLanguage();

  // Get parent categories only
  const parentCategories = categories.filter(c => !c.parentId);

  return (
    <div className="space-y-8">
      {/* Categories Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800 flex items-center">
            <Filter size={16} className="mr-2 text-teal-600" />
            {language === 'vn' ? 'Danh Mục' : 'Browse Categories'}
          </h2>
        </div>
        <div className="p-2">
          <Link
            href="/rao-vat"
            className={`w-full flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-colors ${
              !activeCategory
                ? 'bg-teal-50 text-teal-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <ShoppingBag size={18} className={`mr-3 ${!activeCategory ? 'text-teal-600' : 'text-gray-400'}`} />
              {language === 'vn' ? 'Tất cả' : 'All Categories'}
            </div>
          </Link>
          {parentCategories.map((cat) => {
            const IconComponent = CATEGORY_ICONS[cat.slug] || ShoppingBag;
            const isActive = activeCategory === cat.slug;
            return (
              <Link
                key={cat.id}
                href={`/rao-vat/${cat.slug}`}
                className={`w-full flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <IconComponent size={18} className={`mr-3 ${isActive ? 'text-teal-600' : 'text-gray-400'}`} />
                  {language === 'vn' ? cat.nameVn : (cat.nameEn || cat.nameVn)}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Links / Tips */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-md p-5 text-white">
        <h3 className="font-bold text-lg mb-2 flex items-center">
          <Sun size={20} className="mr-2 text-yellow-300" />
          {language === 'vn' ? 'Mới đến Hawaii?' : 'New to Hawaii?'}
        </h3>
        <p className="text-blue-100 text-sm mb-4">
          {language === 'vn'
            ? 'Xem hướng dẫn cần thiết cho người mới. ID, bằng lái xe và mẹo tìm nhà.'
            : 'Check out our essential guide for newcomers. ID, driver license, and housing tips.'}
        </p>
        <Link
          href="/huong-dan"
          className="block w-full py-2 bg-white text-blue-700 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors text-center"
        >
          {language === 'vn' ? 'Xem Hướng Dẫn' : 'Read Guide'}
        </Link>
      </div>
    </div>
  );
}
