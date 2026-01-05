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
import { MoreHorizontal, Edit, Shield, Trash2 } from 'lucide-react';

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

interface UserActionsProps {
  user: User;
}

export default function UserActions({ user }: UserActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleChange = async (newRole: string) => {
    if (!confirm(`Đổi role của ${user.email} thành ${newRole}?`)) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) throw new Error('Failed to update role');

      router.refresh();
    } catch (error) {
      alert('Có lỗi xảy ra');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Xác nhận XÓA user ${user.email}? Hành động này không thể hoàn tác!`)) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete user');

      router.refresh();
    } catch (error) {
      alert('Có lỗi xảy ra');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const roles = ['USER', 'SELLER', 'EDITOR', 'MODERATOR', 'ADMIN', 'SUPERADMIN'];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={isLoading}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={() => router.push(`/admin/users/${user.id}`)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Chỉnh sửa
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <div className="px-2 py-1.5 text-xs font-semibold text-gray-500">
          Đổi Role
        </div>
        {roles.map((role) => (
          <DropdownMenuItem
            key={role}
            onClick={() => handleRoleChange(role)}
            className={user.role === role ? 'bg-gray-100' : ''}
          >
            <Shield className="h-4 w-4 mr-2" />
            {role}
            {user.role === role && ' ✓'}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleDelete}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Xóa user
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
