'use client';

import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  return (
    <button
      onClick={() => typeof window !== 'undefined' && window.history.back()}
      className="mt-6 inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      Quay lại trang trước
    </button>
  );
}
