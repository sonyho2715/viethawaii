'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, CheckCircle, XCircle, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface Report {
  id: number;
  itemType: string;
  itemId: number;
  reason: string;
  details: string | null;
  status: string;
}

interface ReportActionsProps {
  report: Report;
}

export default function ReportActions({ report }: ReportActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  const updateStatus = async (status: string, notes?: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/reports/${report.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, actionTaken: notes }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update report');
      }
    } catch {
      alert('Failed to update report');
    } finally {
      setIsLoading(false);
      setShowDetails(false);
    }
  };

  const handleAction = async (status: string) => {
    if (status === 'ACTIONED') {
      setShowDetails(true);
    } else {
      await updateStatus(status);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" disabled={isLoading}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleAction('REVIEWED')}>
            <Eye className="h-4 w-4 mr-2" />
            Đánh dấu đã xem
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction('ACTIONED')}>
            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
            Xử lý vi phạm
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction('DISMISSED')}>
            <XCircle className="h-4 w-4 mr-2 text-gray-600" />
            Bỏ qua báo cáo
          </DropdownMenuItem>
          {report.status !== 'PENDING' && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleAction('PENDING')}>
                <Trash2 className="h-4 w-4 mr-2" />
                Đặt lại chờ xử lý
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Action Dialog for taking action */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xử lý báo cáo vi phạm</DialogTitle>
            <DialogDescription>
              Thêm ghi chú về hành động đã thực hiện (tùy chọn)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg text-sm">
              <p><strong>Loại:</strong> {report.itemType}</p>
              <p><strong>ID:</strong> {report.itemId}</p>
              <p><strong>Lý do:</strong> {report.reason}</p>
              {report.details && <p><strong>Chi tiết:</strong> {report.details}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ghi chú của admin
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Mô tả hành động đã thực hiện..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowDetails(false)}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => updateStatus('ACTIONED', adminNotes)}
                disabled={isLoading}
              >
                {isLoading ? 'Đang xử lý...' : 'Xác nhận đã xử lý'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
