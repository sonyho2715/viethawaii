'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ShoppingBag,
  Plus,
} from 'lucide-react';
import type { User } from 'next-auth';
import type { Category, Listing, ListingImage } from '@prisma/client';

interface Stats {
  totalListings: number;
  activeListings: number;
  pendingListings: number;
  totalViews: number;
}

interface ListingWithRelations extends Listing {
  category: Category;
  images: ListingImage[];
}

interface AccountDashboardClientProps {
  user: User;
  stats: Stats;
  recentListings: ListingWithRelations[];
}

export default function AccountDashboardClient({
  user,
  stats,
  recentListings,
}: AccountDashboardClientProps) {
  const { language } = useLanguage();

  const statCards = [
    {
      label: language === 'vn' ? 'Tổng tin đăng' : 'Total Listings',
      value: stats.totalListings,
      icon: FileText,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      label: language === 'vn' ? 'Đang hoạt động' : 'Active',
      value: stats.activeListings,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-100',
    },
    {
      label: language === 'vn' ? 'Chờ duyệt' : 'Pending',
      value: stats.pendingListings,
      icon: Clock,
      color: 'text-yellow-600 bg-yellow-100',
    },
    {
      label: language === 'vn' ? 'Lượt xem' : 'Total Views',
      value: stats.totalViews,
      icon: Eye,
      color: 'text-purple-600 bg-purple-100',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <Badge className="bg-green-100 text-green-700">
            {language === 'vn' ? 'Đang hiển thị' : 'Active'}
          </Badge>
        );
      case 'PENDING':
        return (
          <Badge className="bg-yellow-100 text-yellow-700">
            {language === 'vn' ? 'Chờ duyệt' : 'Pending'}
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge className="bg-red-100 text-red-700">
            {language === 'vn' ? 'Bị từ chối' : 'Rejected'}
          </Badge>
        );
      case 'EXPIRED':
        return (
          <Badge className="bg-gray-100 text-gray-700">
            {language === 'vn' ? 'Đã hết hạn' : 'Expired'}
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">
          {language === 'vn' ? 'Xin chào' : 'Welcome'}, {user.name?.split(' ')[0] || 'User'}!
        </h1>
        <p className="text-gray-500">
          {language === 'vn'
            ? 'Quản lý tin đăng và tài khoản của bạn'
            : 'Manage your listings and account'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{language === 'vn' ? 'Hành động nhanh' : 'Quick Actions'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <Link href="/rao-vat/dang-tin">
                <Plus className="h-4 w-4 mr-2" />
                {language === 'vn' ? 'Đăng tin mới' : 'Post New Listing'}
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/tai-khoan/tin-dang">
                <FileText className="h-4 w-4 mr-2" />
                {language === 'vn' ? 'Quản lý tin đăng' : 'Manage Listings'}
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/tai-khoan/cai-dat">
                {language === 'vn' ? 'Cập nhật thông tin' : 'Update Profile'}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Listings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{language === 'vn' ? 'Tin đăng gần đây' : 'Recent Listings'}</CardTitle>
          <Link
            href="/tai-khoan/tin-dang"
            className="text-sm text-red-600 hover:underline flex items-center gap-1"
          >
            {language === 'vn' ? 'Xem tất cả' : 'View all'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </CardHeader>
        <CardContent>
          {recentListings.length > 0 ? (
            <div className="space-y-4">
              {recentListings.map((listing) => (
                <div
                  key={listing.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {listing.images[0] ? (
                      <Image
                        src={listing.images[0].imageUrl}
                        alt={listing.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <ShoppingBag className="h-6 w-6" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/rao-vat/chi-tiet/${listing.id}`}
                      className="font-medium hover:text-red-600 line-clamp-1"
                    >
                      {listing.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusBadge(listing.status)}
                      <span className="text-sm text-gray-500">
                        {listing.views} {language === 'vn' ? 'lượt xem' : 'views'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-red-600">
                      {listing.price
                        ? `$${Number(listing.price).toLocaleString()}`
                        : listing.priceType === 'FREE'
                        ? (language === 'vn' ? 'Miễn phí' : 'Free')
                        : (language === 'vn' ? 'Liên hệ' : 'Contact')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(listing.createdAt).toLocaleDateString(language === 'vn' ? 'vi-VN' : 'en-US')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">
                {language === 'vn'
                  ? 'Bạn chưa có tin đăng nào'
                  : "You don't have any listings yet"}
              </p>
              <Button asChild className="bg-red-600 hover:bg-red-700">
                <Link href="/rao-vat/dang-tin">
                  <Plus className="h-4 w-4 mr-2" />
                  {language === 'vn' ? 'Đăng tin đầu tiên' : 'Post Your First Listing'}
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
