'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Eye,
  Heart,
  FileText,
  TrendingUp,
  BarChart3,
  ExternalLink,
} from 'lucide-react';

interface ListingAnalytics {
  id: number;
  title: string;
  views: number;
  saves: number;
  status: string;
  imageUrl: string | null;
  createdAt: string;
}

interface ChartDataPoint {
  date: string;
  views: number;
}

interface Stats {
  totalViews: number;
  totalSaves: number;
  activeListings: number;
  totalListings: number;
  viewsLast30Days: number;
}

interface AnalyticsClientProps {
  listings: ListingAnalytics[];
  chartData: ChartDataPoint[];
  stats: Stats;
}

export default function AnalyticsClient({
  listings,
  chartData,
  stats,
}: AnalyticsClientProps) {
  const { language } = useLanguage();

  // Find max views for scaling the chart
  const maxViews = Math.max(...chartData.map((d) => d.views), 1);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  const statCards = [
    {
      labelVn: 'Tổng lượt xem',
      labelEn: 'Total Views',
      value: stats.totalViews,
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      labelVn: 'Lượt xem 30 ngày',
      labelEn: 'Views (30 days)',
      value: stats.viewsLast30Days,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      labelVn: 'Lượt lưu',
      labelEn: 'Total Saves',
      value: stats.totalSaves,
      icon: Heart,
      color: 'text-rose-600',
      bgColor: 'bg-rose-100',
    },
    {
      labelVn: 'Tin đang hoạt động',
      labelEn: 'Active Listings',
      value: `${stats.activeListings} / ${stats.totalListings}`,
      icon: FileText,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 className="h-7 w-7 text-blue-600" />
          {language === 'vn' ? 'Thống kê' : 'Analytics'}
        </h1>
        <p className="text-gray-600">
          {language === 'vn'
            ? 'Theo dõi hiệu suất tin đăng của bạn'
            : 'Track your listing performance'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <Card key={idx}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    {language === 'vn' ? stat.labelVn : stat.labelEn}
                  </p>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Views Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            {language === 'vn' ? 'Lượt xem 30 ngày qua' : 'Views Over Last 30 Days'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.viewsLast30Days === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {language === 'vn'
                ? 'Chưa có dữ liệu lượt xem'
                : 'No view data available yet'}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Bar Chart */}
              <div className="flex items-end gap-1 h-48">
                {chartData.map((point, idx) => {
                  const heightPercent = (point.views / maxViews) * 100;
                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center justify-end group"
                    >
                      <div className="relative w-full">
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {formatDate(point.date)}: {point.views}{' '}
                          {language === 'vn' ? 'lượt' : 'views'}
                        </div>
                        {/* Bar */}
                        <div
                          className="w-full bg-blue-500 rounded-t transition-all duration-200 hover:bg-blue-600 min-h-[2px]"
                          style={{ height: `${Math.max(heightPercent, 1)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* X-axis labels (every 5 days) */}
              <div className="flex justify-between text-xs text-gray-500 px-1">
                {chartData
                  .filter((_, idx) => idx % 5 === 0 || idx === chartData.length - 1)
                  .map((point, idx) => (
                    <span key={idx}>{formatDate(point.date)}</span>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Performing Listings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-green-600" />
            {language === 'vn' ? 'Tin đăng nổi bật' : 'Top Performing Listings'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {listings.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {language === 'vn'
                ? 'Bạn chưa có tin đăng nào'
                : "You don't have any listings yet"}
            </div>
          ) : (
            <div className="space-y-4">
              {listings.slice(0, 10).map((listing, idx) => (
                <div
                  key={listing.id}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {/* Rank */}
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                    {idx + 1}
                  </div>

                  {/* Image */}
                  {listing.imageUrl ? (
                    <img
                      src={listing.imageUrl}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{listing.title}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {listing.views} {language === 'vn' ? 'lượt xem' : 'views'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5" />
                        {listing.saves} {language === 'vn' ? 'lượt lưu' : 'saves'}
                      </span>
                    </div>
                  </div>

                  {/* Status */}
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      listing.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : listing.status === 'SOLD'
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {listing.status === 'ACTIVE'
                      ? language === 'vn'
                        ? 'Hoạt động'
                        : 'Active'
                      : listing.status === 'SOLD'
                      ? language === 'vn'
                        ? 'Đã bán'
                        : 'Sold'
                      : language === 'vn'
                      ? 'Chờ duyệt'
                      : 'Pending'}
                  </span>

                  {/* Link */}
                  <Link
                    href={`/rao-vat/chi-tiet/${listing.id}`}
                    target="_blank"
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
