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
import { MoreHorizontal, Check, X, Trash2, Calendar } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  status: string;
}

interface EventActionsProps {
  event: Event;
}

export default function EventActions({ event }: EventActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
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

  const handleApprove = () => handleStatusChange('APPROVED');
  const handleCancel = () => handleStatusChange('CANCELLED');
  const handleComplete = () => handleStatusChange('COMPLETED');

  const handleDelete = async () => {
    if (!confirm(`Xác nhận XÓA sự kiện "${event.title}"? Hành động này không thể hoàn tác!`)) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete event');

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
        {event.status === 'PENDING' && (
          <>
            <DropdownMenuItem onClick={handleApprove} className="text-green-600">
              <Check className="h-4 w-4 mr-2" />
              Duyệt sự kiện
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCancel} className="text-red-600">
              <X className="h-4 w-4 mr-2" />
              Từ chối
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {event.status === 'APPROVED' && (
          <>
            <DropdownMenuItem onClick={handleComplete}>
              <Calendar className="h-4 w-4 mr-2" />
              Đánh dấu hoàn thành
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCancel} className="text-amber-600">
              <X className="h-4 w-4 mr-2" />
              Hủy sự kiện
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {event.status === 'CANCELLED' && (
          <>
            <DropdownMenuItem onClick={handleApprove} className="text-green-600">
              <Check className="h-4 w-4 mr-2" />
              Khôi phục
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem
          onClick={handleDelete}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Xóa sự kiện
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
