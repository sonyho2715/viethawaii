import { db } from '@/lib/db';
import MapPageClient from './MapPageClient';
import { SAFE_TRADE_POINTS } from '@/lib/data/safe-trade-points';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bản đồ VietHawaii | Địa điểm kinh doanh & Giao dịch an toàn',
  description: 'Tìm kiếm các doanh nghiệp Việt Nam tại Hawaii và các địa điểm giao dịch an toàn trên bản đồ tương tác.',
};

async function getBusinesses() {
  const businesses = await db.business.findMany({
    where: { isVerified: true },
    include: { neighborhood: true },
  });
  return businesses;
}

export default async function MapPage() {
  const businesses = await getBusinesses();

  // Format data for the map component
  const businessPoints = businesses
    .map(b => {
      // Hardcoded coords for seeded businesses
      const coords: Record<string, {lat: number, lng: number}> = {
        'pho-huynh': { lat: 21.3135, lng: -157.8633 },
        'tiem-vang-kim-nguyen': { lat: 21.3125, lng: -157.8623 },
        'nails-spa-aloha': { lat: 21.2913, lng: -157.8433 },
        'viet-hawaii-travel': { lat: 21.3842, lng: -157.9425 },
      };
      
      const pos = coords[b.slug] || { lat: 21.3069, lng: -157.8583 };

      return {
        lat: pos.lat,
        lng: pos.lng,
        title: b.name,
        description: b.category,
        type: 'BUSINESS',
      };
    });

  const safePoints = SAFE_TRADE_POINTS.map(p => ({
    lat: p.lat,
    lng: p.lng,
    title: p.nameVn,
    description: p.address,
    type: 'SAFE_ZONE',
  }));

  return (
    <MapPageClient 
      initialPoints={[...safePoints, ...businessPoints]} 
    />
  );
}
