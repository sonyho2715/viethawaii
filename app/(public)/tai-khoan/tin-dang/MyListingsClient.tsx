'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import type { Category, Listing, ListingImage } from '@prisma/client';

interface Stats {
  active: number;
  pending: number;
  rejected: number;
  expired: number;
  total: number;
}

interface ListingWithRelations extends Listing {
  category: Category;
  images: ListingImage[];
}

interface MyListingsClientProps {
  listings: ListingWithRelations[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: Stats;
  currentStatus: string;
}

export default function MyListingsClient({
  listings,
  pagination,
  stats,
  currentStatus,
}: MyListingsClientProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const [deleteDialog, setDeleteDialog] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const statusTabs = [
    { value: 'all', labelVn: 'Tất cả', labelEn: 'All', count: stats.total },
    { value: 'active', labelVn: 'Đang hiển thị', labelEn: 'Active', count: stats.active },
    { value: 'pending', labelVn: 'Chờ duyệt', labelEn: 'Pending', count: stats.pending },
    { value: 'rejected', labelVn: 'Bị từ chối', labelEn: 'Rejected', count: stats.rejected },
    { value: 'expired', labelVn: 'Hết hạn', labelEn: 'Expired', count: stats.expired },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; labelVn: string; labelEn: string }> = {
      ACTIVE: { className: 'bg-green-100 text-green-700', labelVn: 'Đang hiển thị', labelEn: 'Active' },
      PENDING: { className: 'bg-yellow-100 text-yellow-700', labelVn: 'Chờ duyệt', labelEn: 'Pending' },
      REJECTED: { className: 'bg-red-100 text-red-700', labelVn: 'Bị từ chối', labelEn: 'Rejected' },
      EXPIRED: { className: 'bg-gray-100 text-gray-700', labelVn: 'Hết hạn', labelEn: 'Expired' },
    };
    const variant = variants[status] || variants.PENDING;
    return (
      <Badge className={variant.className}>
        {language === 'vn' ? variant.labelVn : variant.labelEn}
      </Badge>
    );
  };

  const handleStatusFilter = (status: string) => {
    router.push(`/tai-khoan/tin-dang${status !== 'all' ? `?status=${status}` : ''}`);
  };

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/listings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setIsDeleting(false);
      setDeleteDialog(null);
    }
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams();
    if (currentStatus !== 'all') params.set('status', currentStatus);
    params.set('page', page.toString());
    router.push(`/tai-khoan/tin-dang?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {language === 'vn' ? 'Tin đăng của tôi' : 'My Listings'}
        </h1>
        <Button asChild className="bg-red-600 hover:bg-red-700">
          <Link href="/rao-vat/dang-tin">
            <Plus className="h-4 w-4 mr-2" />
            {language === 'vn' ? 'Đăng tin mới' : 'New Listing'}
          </Link>
        </Button>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleStatusFilter(tab.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currentStatus === tab.value
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {language === 'vn' ? tab.labelVn : tab.labelEn} ({tab.count})
          </button>
        ))}
      </div>

      {/* Listings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {pagination.total} {language === 'vn' ? 'tin đăng' : 'listings'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {listings.length > 0 ? (
            <div className="space-y-4">
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {listing.images[0] ? (
                      <Image
                        src={listing.images[0].imageUrl}
                        alt={listing.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <ShoppingBag className="h-8 w-8" />
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
                        {language === 'vn' ? listing.category.nameVn : listing.category.nameEn || listing.category.nameVn}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {listing.views} {language === 'vn' ? 'lượt xem' : 'views'}
                      </span>
                      <span>
                        {new Date(listing.createdAt).toLocaleDateString(language === 'vn' ? 'vi-VN' : 'en-US')}
                      </span>
                    </div>
                  </div>

                  <div className="text-right mr-4">
                    <p className="font-semibold text-red-600">
                      {listing.price
                        ? `$${Number(listing.price).toLocaleString()}`
                        : listing.priceType === 'FREE'
                        ? (language === 'vn' ? 'Miễn phí' : 'Free')
                        : (language === 'vn' ? 'Liên hệ' : 'Contact')}
                    </p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/rao-vat/chi-tiet/${listing.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          {language === 'vn' ? 'Xem chi tiết' : 'View'}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/tai-khoan/tin-dang/${listing.id}/sua`}>
                          <Edit className="h-4 w-4 mr-2" />
                          {language === 'vn' ? 'Chỉnh sửa' : 'Edit'}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => setDeleteDialog(listing.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {language === 'vn' ? 'Xóa' : 'Delete'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">
                {language === 'vn'
                  ? 'Không có tin đăng nào'
                  : 'No listings found'}
              </p>
              <Button asChild className="bg-red-600 hover:bg-red-700">
                <Link href="/rao-vat/dang-tin">
                  <Plus className="h-4 w-4 mr-2" />
                  {language === 'vn' ? 'Đăng tin mới' : 'Post Listing'}
                </Link>
              </Button>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-500">
                {language === 'vn' ? 'Trang' : 'Page'} {pagination.page} / {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'vn' ? 'Xác nhận xóa' : 'Confirm Delete'}
            </DialogTitle>
            <DialogDescription>
              {language === 'vn'
                ? 'Bạn có chắc chắn muốn xóa tin đăng này? Hành động này không thể hoàn tác.'
                : 'Are you sure you want to delete this listing? This action cannot be undone.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>
              {language === 'vn' ? 'Hủy' : 'Cancel'}
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteDialog && handleDelete(deleteDialog)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {language === 'vn' ? 'Đang xóa...' : 'Deleting...'}
                </>
              ) : (
                language === 'vn' ? 'Xóa' : 'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
