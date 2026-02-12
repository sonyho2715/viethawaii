import { db } from '@/lib/db';
import MapPageClient from './MapPageClient';
import { SAFE_TRADE_POINTS } from '@/lib/data/safe-trade-points';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bản đồ VietHawaii | Địa điểm kinh doanh & Giao dịch an toàn',
  description: 'Tìm kiếm các doanh nghiệp Việt Nam tại Hawaii và các địa điểm giao dịch an toàn trên bản đồ tương tác.',
};

export default async function MapPage() {
  const businesses = await db.business.findMany({
    where: { isVerified: true },
  });

  const businessPoints = businesses
    .filter((b) => b.lat && b.lng)
    .map((b) => ({
      lat: Number(b.lat),
      lng: Number(b.lng),
      title: b.name,
      description: b.category,
      type: 'BUSINESS',
    }));

  const safePoints = SAFE_TRADE_POINTS.map((p) => ({
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
