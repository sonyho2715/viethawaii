'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Check, X, Trash2, Star, CheckSquare, Square, Loader2 } from 'lucide-react';

interface BulkActionsBarProps {
  selectedIds: number[];
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  allSelected: boolean;
}

export default function BulkActionsBar({
  selectedIds,
  totalCount,
  onSelectAll,
  onDeselectAll,
  allSelected,
}: BulkActionsBarProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionType, setActionType] = useState('');

  const handleBulkAction = async (action: string, data?: Record<string, unknown>) => {
    if (selectedIds.length === 0) return;

    const actionLabels: Record<string, string> = {
      approve: 'duyệt',
      reject: 'từ chối',
      delete: 'XÓA',
      feature: 'nổi bật',
    };

    const confirmMessage = action === 'delete'
      ? `Xác nhận XÓA ${selectedIds.length} tin? Hành động này không thể hoàn tác!`
      : `Xác nhận ${actionLabels[action]} ${selectedIds.length} tin đăng?`;

    if (!confirm(confirmMessage)) return;

    setIsProcessing(true);
    setActionType(action);

    try {
      const res = await fetch('/api/admin/listings/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          listingIds: selectedIds,
          ...data,
        }),
      });

      if (!res.ok) {
        const result = await res.json();
        alert(result.error || 'Có lỗi xảy ra');
        return;
      }

      const result = await res.json();
      alert(`Đã ${actionLabels[action]} ${result.count} tin đăng`);
      onDeselectAll();
      router.refresh();
    } catch (error) {
      console.error('Bulk action error:', error);
      alert('Có lỗi xảy ra');
    } finally {
      setIsProcessing(false);
      setActionType('');
    }
  };

  if (selectedIds.length === 0) {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={onSelectAll}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Square className="h-4 w-4" />
          Chọn tất cả
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-teal-50 border border-teal-200 rounded-xl px-4 py-3 animate-in fade-in slide-in-from-top-2">
      <button
        onClick={allSelected ? onDeselectAll : onSelectAll}
        className="flex items-center gap-2 text-sm font-medium text-teal-700"
      >
        <CheckSquare className="h-4 w-4" />
        {selectedIds.length}/{totalCount}
      </button>

      <div className="h-5 w-px bg-teal-200" />

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          onClick={() => handleBulkAction('approve')}
          disabled={isProcessing}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {isProcessing && actionType === 'approve' ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <Check className="h-4 w-4 mr-1" />
          )}
          Duyệt
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => handleBulkAction('reject')}
          disabled={isProcessing}
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          {isProcessing && actionType === 'reject' ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <X className="h-4 w-4 mr-1" />
          )}
          Từ chối
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => handleBulkAction('feature')}
          disabled={isProcessing}
        >
          {isProcessing && actionType === 'feature' ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <Star className="h-4 w-4 mr-1" />
          )}
          Nổi bật
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => handleBulkAction('delete')}
          disabled={isProcessing}
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          {isProcessing && actionType === 'delete' ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4 mr-1" />
          )}
          Xóa
        </Button>
      </div>

      <div className="ml-auto">
        <Button
          size="sm"
          variant="ghost"
          onClick={onDeselectAll}
          className="text-gray-500"
        >
          Bỏ chọn
        </Button>
      </div>
    </div>
  );
}
