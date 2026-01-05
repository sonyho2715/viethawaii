import { Suspense } from 'react';
import LoginClient from './LoginClient';
import { Loader2 } from 'lucide-react';

function LoginLoading() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
      <Loader2 className="h-8 w-8 animate-spin text-red-600" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginClient />
    </Suspense>
  );
}
