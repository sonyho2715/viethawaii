export interface SafeTradePoint {
  id: string;
  nameVn: string;
  nameEn: string;
  address: string;
  lat: number;
  lng: number;
  type: 'POLICE' | 'MALL' | 'PUBLIC';
}

export const SAFE_TRADE_POINTS: SafeTradePoint[] = [
  {
    id: 'hpd-hq',
    nameVn: 'Trụ sở Cảnh sát Honolulu',
    nameEn: 'HPD Headquarters',
    address: '801 S Beretania St, Honolulu, HI 96813',
    lat: 21.3045,
    lng: -157.8507,
    type: 'POLICE',
  },
  {
    id: 'ala-moana',
    nameVn: 'Trung tâm Ala Moana',
    nameEn: 'Ala Moana Center',
    address: '1450 Ala Moana Blvd, Honolulu, HI 96814',
    lat: 21.2913,
    lng: -157.8433,
    type: 'MALL',
  },
  {
    id: 'ward-village',
    nameVn: 'Ward Village',
    nameEn: 'Ward Village',
    address: '1240 Ala Moana Blvd, Honolulu, HI 96814',
    lat: 21.2945,
    lng: -157.8533,
    type: 'MALL',
  },
  {
    id: 'pearlridge',
    nameVn: 'Pearlridge Center',
    nameEn: 'Pearlridge Center',
    address: '98-1005 Moanalua Rd, Aiea, HI 96701',
    lat: 21.3842,
    lng: -157.9425,
    type: 'MALL',
  },
  {
    id: 'windward-mall',
    nameVn: 'Windward Mall',
    nameEn: 'Windward Mall',
    address: '46-056 Kamehameha Hwy, Kaneohe, HI 96744',
    lat: 21.4192,
    lng: -157.8033,
    type: 'MALL',
  },
];
