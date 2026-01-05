'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full bg-red-600 hover:bg-red-700"
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Đang đăng nhập...
        </>
      ) : (
        'Đăng nhập'
      )}
    </Button>
  );
}
