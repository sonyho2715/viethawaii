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
  Car,
  UtensilsCrossed,
  Wrench,
  Compass,
} from 'lucide-react';
import type { SerializedCategory } from './ListingCard';

interface SidebarProps {
  categories: SerializedCategory[];
  activeCategory?: string;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'nha-o': Home,
  'viec-lam': Briefcase,
  'cho-troi': ShoppingBag,
  'dich-vu': Wrench,
  'cong-dong': MessageCircle,
  'xe-co': Car,
  'am-thuc': UtensilsCrossed,
};

const CATEGORY_COLORS: Record<string, string> = {
  'nha-o': 'text-blue-500',
  'viec-lam': 'text-emerald-500',
  'cho-troi': 'text-amber-500',
  'dich-vu': 'text-purple-500',
  'cong-dong': 'text-pink-500',
  'xe-co': 'text-orange-500',
  'am-thuc': 'text-red-500',
};

export default function Sidebar({ categories, activeCategory }: SidebarProps) {
  const { language } = useLanguage();

  const parentCategories = categories.filter(c => !c.parentId);

  return (
    <div className="space-y-6">
      {/* Categories Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
          <h2 className="font-semibold text-gray-800 flex items-center text-sm">
            <Filter size={16} className="mr-2 text-teal-600" />
            {language === 'vn' ? 'Danh Mục' : 'Browse Categories'}
          </h2>
        </div>
        <div className="p-2">
          <Link
            href="/rao-vat"
            className={`w-full flex items-center p-3 rounded-xl text-sm font-medium transition-all relative ${
              !activeCategory
                ? 'bg-teal-50 text-teal-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {!activeCategory && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-teal-400 to-teal-600 rounded-r-full" />
            )}
            <ShoppingBag size={18} className={`mr-3 ${!activeCategory ? 'text-teal-600' : 'text-gray-400'}`} />
            {language === 'vn' ? 'Tất cả' : 'All Categories'}
          </Link>
          {parentCategories.map((cat) => {
            const IconComponent = CATEGORY_ICONS[cat.slug] || ShoppingBag;
            const iconColor = CATEGORY_COLORS[cat.slug] || 'text-gray-400';
            const isActive = activeCategory === cat.slug;
            return (
              <Link
                key={cat.id}
                href={`/rao-vat/${cat.slug}`}
                className={`w-full flex items-center p-3 rounded-xl text-sm font-medium transition-all relative ${
                  isActive
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-teal-400 to-teal-600 rounded-r-full" />
                )}
                <IconComponent size={18} className={`mr-3 ${isActive ? 'text-teal-600' : iconColor}`} />
                {language === 'vn' ? cat.nameVn : (cat.nameEn || cat.nameVn)}
              </Link>
            );
          })}
        </div>
      </div>

      {/* New to Hawaii? Card */}
      <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-2xl shadow-lg p-5 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-4 -translate-x-4" />
        <div className="relative">
          <h3 className="font-bold text-lg mb-2 flex items-center">
            <Compass size={20} className="mr-2" />
            {language === 'vn' ? 'Mới đến Hawaii?' : 'New to Hawaii?'}
          </h3>
          <p className="text-white/85 text-sm mb-4 leading-relaxed">
            {language === 'vn'
              ? 'Xem hướng dẫn cần thiết cho người mới. ID, bằng lái xe và mẹo tìm nhà.'
              : 'Check out our essential guide for newcomers. ID, driver license, and housing tips.'}
          </p>
          <Link
            href="/huong-dan"
            className="block w-full py-2.5 bg-white text-orange-600 rounded-xl text-sm font-bold hover:bg-orange-50 transition-colors text-center shadow-sm"
          >
            {language === 'vn' ? 'Xem Hướng Dẫn' : 'Read Guide'}
          </Link>
        </div>
      </div>
    </div>
  );
}
