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
import { MoreHorizontal, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';

interface Coupon {
  id: number;
  title: string;
  isActive: boolean;
}

interface CouponActionsProps {
  coupon: Coupon;
}

export default function CouponActions({ coupon }: CouponActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleActive = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !coupon.isActive }),
      });

      if (!res.ok) throw new Error('Failed to update coupon');

      router.refresh();
    } catch (error) {
      alert('Có lỗi xảy ra');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Xác nhận XÓA khuyến mãi "${coupon.title}"? Hành động này không thể hoàn tác!`)) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete coupon');

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
        <DropdownMenuItem onClick={handleToggleActive}>
          {coupon.isActive ? (
            <>
              <ToggleLeft className="h-4 w-4 mr-2 text-amber-600" />
              <span className="text-amber-600">Tắt khuyến mãi</span>
            </>
          ) : (
            <>
              <ToggleRight className="h-4 w-4 mr-2 text-green-600" />
              <span className="text-green-600">Bật khuyến mãi</span>
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Xóa khuyến mãi
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
