'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Check, X, Star, Trash2 } from 'lucide-react';

interface Listing {
  id: number;
  title: string;
  status: string;
  isFeatured: boolean;
}

interface ListingActionsProps {
  listing: Listing;
}

export default function ListingActions({ listing }: ListingActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (newStatus: string, rejectionReason?: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/listings/${listing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, rejectionReason }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      router.refresh();
    } catch (error) {
      alert('Có lỗi xảy ra');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = () => handleStatusChange('ACTIVE');

  const handleReject = async () => {
    const reason = prompt('Lý do từ chối (tùy chọn):');
    if (reason !== null) {
      await handleStatusChange('REJECTED', reason || undefined);
    }
  };

  const handleToggleFeatured = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/listings/${listing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !listing.isFeatured }),
      });

      if (!res.ok) throw new Error('Failed to update featured status');

      router.refresh();
    } catch (error) {
      alert('Có lỗi xảy ra');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Xác nhận XÓA tin "${listing.title}"? Hành động này không thể hoàn tác!`)) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/listings/${listing.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete listing');

      router.refresh();
    } catch (error) {
      alert('Có lỗi xảy ra');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={isLoading}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {listing.status === 'PENDING' && (
          <>
            <DropdownMenuItem onClick={handleApprove} className="text-green-600">
              <Check className="h-4 w-4 mr-2" />
              Duyệt tin
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleReject} className="text-red-600">
              <X className="h-4 w-4 mr-2" />
              Từ chối
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {listing.status === 'ACTIVE' && (
          <>
            <DropdownMenuItem onClick={handleToggleFeatured}>
              <Star className={`h-4 w-4 mr-2 ${listing.isFeatured ? 'fill-amber-400 text-amber-400' : ''}`} />
              {listing.isFeatured ? 'Bỏ nổi bật' : 'Đặt nổi bật'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {listing.status === 'REJECTED' && (
          <>
            <DropdownMenuItem onClick={handleApprove} className="text-green-600">
              <Check className="h-4 w-4 mr-2" />
              Duyệt lại
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem
          onClick={handleDelete}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Xóa tin
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
