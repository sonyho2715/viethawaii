'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useLanguage } from '@/context/LanguageContext';
import { MapPin, ShieldCheck, Store, Navigation } from 'lucide-react';
import { Card } from '@/components/ui/card';

// Dynamically import Map to avoid SSR issues with Leaflet
const Map = dynamic(() => import('@/components/public/Map'), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center rounded-2xl border border-gray-200">
      <div className="text-gray-400 flex flex-col items-center gap-2">
        <Navigation className="animate-bounce" />
        <p className="text-sm font-medium">Đang tải bản đồ...</p>
      </div>
    </div>
  )
});

interface MapPoint {
  lat: number;
  lng: number;
  title: string;
  description?: string;
  type: string;
}

interface MapPageClientProps {
  initialPoints: MapPoint[];
}

export default function MapPageClient({ initialPoints }: MapPageClientProps) {
  const { language } = useLanguage();
  const [filter, setFilter] = useState<'ALL' | 'BUSINESS' | 'SAFE_ZONE'>('ALL');

  const filteredPoints = initialPoints.filter(p => 
    filter === 'ALL' || p.type === filter
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {language === 'vn' ? 'Bản đồ Little Saigon' : 'Little Saigon Map'}
          </h1>
          <p className="text-gray-500">
            {language === 'vn' 
              ? 'Khám phá cộng đồng Việt Nam tại Hawaii và tìm các điểm giao dịch an toàn.' 
              : 'Explore the Vietnamese community in Hawaii and find safe trade locations.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-16rem)]">
          {/* Sidebar Controls */}
          <aside className="lg:col-span-1 space-y-4 overflow-y-auto">
            <Card className="p-4">
              <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4">
                {language === 'vn' ? 'Bộ lọc' : 'Filters'}
              </h3>
              
              <div className="space-y-2">
                <FilterButton 
                  active={filter === 'ALL'} 
                  onClick={() => setFilter('ALL')}
                  icon={<MapPin size={16} />}
                  label={language === 'vn' ? 'Tất cả' : 'All'}
                />
                <FilterButton 
                  active={filter === 'BUSINESS'} 
                  onClick={() => setFilter('BUSINESS')}
                  icon={<Store size={16} />}
                  label={language === 'vn' ? 'Doanh nghiệp' : 'Businesses'}
                  color="text-blue-600 bg-blue-50"
                />
                <FilterButton 
                  active={filter === 'SAFE_ZONE'} 
                  onClick={() => setFilter('SAFE_ZONE')}
                  icon={<ShieldCheck size={16} />}
                  label={language === 'vn' ? 'Điểm giao dịch' : 'Safe Zones'}
                  color="text-emerald-600 bg-emerald-50"
                />
              </div>
            </Card>

            <Card className="p-4 bg-teal-600 text-white">
              <ShieldCheck className="mb-2" />
              <h4 className="font-bold mb-1">{language === 'vn' ? 'Giao dịch an toàn' : 'Safe Trading'}</h4>
              <p className="text-xs text-teal-50 opacity-90 leading-relaxed">
                {language === 'vn'
                  ? 'Chúng tôi khuyến khích bạn gặp mặt tại các địa điểm công cộng hoặc đồn cảnh sát để đảm bảo an toàn.'
                  : 'We recommend meeting at public locations or police stations to ensure your safety.'}
              </p>
            </Card>
          </aside>

          {/* Map View */}
          <div className="lg:col-span-3 h-full min-h-[400px]">
            <Map points={filteredPoints} />
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, icon, label, color = "text-gray-600 bg-gray-50" }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all font-medium text-sm ${
        active 
          ? 'border-teal-500 ring-2 ring-teal-500/10 shadow-sm bg-white' 
          : 'border-transparent hover:bg-white hover:border-gray-200'
      }`}
    >
      <div className={`p-2 rounded-lg ${active ? 'bg-teal-50 text-teal-600' : color}`}>
        {icon}
      </div>
      {label}
    </button>
  );
}
