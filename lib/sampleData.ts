export type Island = 'Oahu' | 'Maui' | 'Big Island' | 'Kauai' | 'Molokai' | 'Lanai';
export type Category = 'Restaurant' | 'Market' | 'Services' | 'Healthcare' | 'Beauty' | 'Professional';

export interface Business {
  id: string;
  name: string;
  nameVi?: string;
  slug: string;
  category: Category;
  subcategory: string;
  island: Island;
  city: string;
  address: string;
  phone: string;
  website?: string;
  email?: string;
  description: string;
  descriptionVi?: string;
  hours: {
    [key: string]: string;
  };
  features: string[];
  images: string[];
  rating: number;
  reviewCount: number;
  priceRange?: '$' | '$$' | '$$$' | '$$$$';
  verified: boolean;
  featured: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const sampleBusinesses: Business[] = [
  {
    id: '1',
    name: 'Phở Saigon',
    nameVi: 'Phở Sài Gòn',
    slug: 'pho-saigon-honolulu',
    category: 'Restaurant',
    subcategory: 'Vietnamese Restaurant',
    island: 'Oahu',
    city: 'Honolulu',
    address: '1143 12th Ave, Honolulu, HI 96816',
    phone: '(808) 732-7788',
    website: 'http://phosaigon.com',
    description: 'Authentic Vietnamese phở and traditional dishes served in a casual setting. Family-owned since 1992, known for the best phở in Kaimuki.',
    descriptionVi: 'Phở và các món ăn truyền thống Việt Nam. Nhà hàng gia đình hoạt động từ năm 1992.',
    hours: {
      'Monday': '10:00 AM - 9:00 PM',
      'Tuesday': '10:00 AM - 9:00 PM',
      'Wednesday': '10:00 AM - 9:00 PM',
      'Thursday': '10:00 AM - 9:00 PM',
      'Friday': '10:00 AM - 10:00 PM',
      'Saturday': '10:00 AM - 10:00 PM',
      'Sunday': '10:00 AM - 8:00 PM'
    },
    features: ['Dine-in', 'Takeout', 'Vegetarian Options', 'Parking', 'Family Friendly'],
    images: ['/images/pho-saigon-1.jpg', '/images/pho-saigon-2.jpg'],
    rating: 4.6,
    reviewCount: 342,
    priceRange: '$$',
    verified: true,
    featured: true,
    coordinates: { lat: 21.2829, lng: -157.7939 }
  },
  {
    id: '2',
    name: 'Ba Le Sandwich Shop',
    nameVi: 'Bánh Mì Ba Lê',
    slug: 'ba-le-sandwich-chinatown',
    category: 'Restaurant',
    subcategory: 'Bakery & Sandwich',
    island: 'Oahu',
    city: 'Honolulu',
    address: '1154 Fort St Mall, Honolulu, HI 96813',
    phone: '(808) 521-3973',
    description: 'Famous for Vietnamese sandwiches (bánh mì), French-Vietnamese pastries, and Vietnamese coffee. A Chinatown staple for over 30 years.',
    hours: {
      'Monday': '6:00 AM - 6:00 PM',
      'Tuesday': '6:00 AM - 6:00 PM',
      'Wednesday': '6:00 AM - 6:00 PM',
      'Thursday': '6:00 AM - 6:00 PM',
      'Friday': '6:00 AM - 6:00 PM',
      'Saturday': '6:00 AM - 6:00 PM',
      'Sunday': '6:00 AM - 4:00 PM'
    },
    features: ['Takeout', 'Catering', 'Quick Service', 'Cash Only'],
    images: ['/images/bale-1.jpg'],
    rating: 4.5,
    reviewCount: 567,
    priceRange: '$',
    verified: true,
    featured: false,
    coordinates: { lat: 21.3099, lng: -157.8581 }
  },
  {
    id: '3',
    name: 'Kim Phuong Vietnamese Restaurant',
    slug: 'kim-phuong-restaurant',
    category: 'Restaurant',
    subcategory: 'Vietnamese Restaurant',
    island: 'Oahu',
    city: 'Honolulu',
    address: '1639 Kalakaua Ave, Honolulu, HI 96826',
    phone: '(808) 944-1000',
    description: 'Upscale Vietnamese dining with modern twist. Specializes in regional Vietnamese cuisine with fresh local ingredients.',
    hours: {
      'Monday': '11:00 AM - 10:00 PM',
      'Tuesday': '11:00 AM - 10:00 PM',
      'Wednesday': '11:00 AM - 10:00 PM',
      'Thursday': '11:00 AM - 10:00 PM',
      'Friday': '11:00 AM - 11:00 PM',
      'Saturday': '11:00 AM - 11:00 PM',
      'Sunday': '11:00 AM - 9:00 PM'
    },
    features: ['Dine-in', 'Takeout', 'Delivery', 'Full Bar', 'Reservations', 'Private Events'],
    images: ['/images/kim-phuong-1.jpg'],
    rating: 4.7,
    reviewCount: 234,
    priceRange: '$$$',
    verified: true,
    featured: true,
    coordinates: { lat: 21.2969, lng: -157.8492 }
  },
  {
    id: '4',
    name: 'Saigon Market',
    nameVi: 'Chợ Sài Gòn',
    slug: 'saigon-market-kalihi',
    category: 'Market',
    subcategory: 'Asian Grocery',
    island: 'Oahu',
    city: 'Honolulu',
    address: '1247 N School St, Honolulu, HI 96817',
    phone: '(808) 841-8838',
    description: 'Full-service Vietnamese grocery store offering fresh produce, frozen goods, Vietnamese herbs, spices, and hard-to-find ingredients. Also features a deli counter with prepared foods.',
    hours: {
      'Monday': '8:00 AM - 8:00 PM',
      'Tuesday': '8:00 AM - 8:00 PM',
      'Wednesday': '8:00 AM - 8:00 PM',
      'Thursday': '8:00 AM - 8:00 PM',
      'Friday': '8:00 AM - 8:00 PM',
      'Saturday': '8:00 AM - 8:00 PM',
      'Sunday': '8:00 AM - 7:00 PM'
    },
    features: ['Fresh Produce', 'Deli Counter', 'Parking', 'ATM', 'EBT Accepted'],
    images: ['/images/saigon-market-1.jpg'],
    rating: 4.3,
    reviewCount: 189,
    priceRange: '$$',
    verified: true,
    featured: false,
    coordinates: { lat: 21.3244, lng: -157.8543 }
  },
  {
    id: '5',
    name: 'Lotus Nail Spa',
    nameVi: 'Spa Móng Tay Sen',
    slug: 'lotus-nail-spa-pearl-city',
    category: 'Beauty',
    subcategory: 'Nail Salon',
    island: 'Oahu',
    city: 'Pearl City',
    address: '850 Kamehameha Hwy, Pearl City, HI 96782',
    phone: '(808) 456-7890',
    description: 'Professional nail salon offering manicures, pedicures, gel nails, and waxing services. Clean, modern facility with experienced Vietnamese technicians.',
    hours: {
      'Monday': '9:00 AM - 7:00 PM',
      'Tuesday': '9:00 AM - 7:00 PM',
      'Wednesday': '9:00 AM - 7:00 PM',
      'Thursday': '9:00 AM - 7:00 PM',
      'Friday': '9:00 AM - 7:00 PM',
      'Saturday': '9:00 AM - 6:00 PM',
      'Sunday': '10:00 AM - 5:00 PM'
    },
    features: ['Walk-ins Welcome', 'Appointments', 'Gift Cards', 'Parking', 'Credit Cards'],
    images: ['/images/lotus-nail-1.jpg'],
    rating: 4.4,
    reviewCount: 276,
    priceRange: '$$',
    verified: false,
    featured: false,
    coordinates: { lat: 21.3859, lng: -157.9583 }
  },
  {
    id: '6',
    name: 'Dr. Nguyen Family Dental',
    nameVi: 'Nha Khoa Gia Đình BS Nguyễn',
    slug: 'dr-nguyen-dental-kahala',
    category: 'Healthcare',
    subcategory: 'Dentist',
    island: 'Oahu',
    city: 'Honolulu',
    address: '4211 Waialae Ave #206, Honolulu, HI 96816',
    phone: '(808) 737-9999',
    email: 'info@nguyendental.com',
    website: 'https://nguyendentalhawaii.com',
    description: 'Comprehensive dental care for the whole family. Dr. Nguyen and staff speak Vietnamese, English, and Cantonese. Specializing in general dentistry, cosmetic procedures, and orthodontics.',
    hours: {
      'Monday': '8:00 AM - 5:00 PM',
      'Tuesday': '8:00 AM - 5:00 PM',
      'Wednesday': '8:00 AM - 5:00 PM',
      'Thursday': '8:00 AM - 5:00 PM',
      'Friday': '8:00 AM - 4:00 PM',
      'Saturday': 'By Appointment',
      'Sunday': 'Closed'
    },
    features: ['Insurance Accepted', 'Vietnamese Speaking', 'Parking', 'New Patients Welcome'],
    images: ['/images/nguyen-dental-1.jpg'],
    rating: 4.8,
    reviewCount: 423,
    priceRange: '$$$',
    verified: true,
    featured: false,
    coordinates: { lat: 21.2773, lng: -157.7861 }
  },
  {
    id: '7',
    name: 'Maui Phở Shop',
    slug: 'maui-pho-shop-kahului',
    category: 'Restaurant',
    subcategory: 'Vietnamese Restaurant',
    island: 'Maui',
    city: 'Kahului',
    address: '444 Hana Hwy, Kahului, HI 96732',
    phone: '(808) 871-7888',
    description: 'The first authentic Vietnamese restaurant on Maui. Serving traditional phở, vermicelli bowls, and spring rolls made fresh daily.',
    hours: {
      'Monday': 'Closed',
      'Tuesday': '10:30 AM - 8:30 PM',
      'Wednesday': '10:30 AM - 8:30 PM',
      'Thursday': '10:30 AM - 8:30 PM',
      'Friday': '10:30 AM - 9:00 PM',
      'Saturday': '10:30 AM - 9:00 PM',
      'Sunday': '10:30 AM - 8:00 PM'
    },
    features: ['Dine-in', 'Takeout', 'Vegetarian Options', 'Kid Menu'],
    images: ['/images/maui-pho-1.jpg'],
    rating: 4.5,
    reviewCount: 198,
    priceRange: '$$',
    verified: true,
    featured: true,
    coordinates: { lat: 20.8893, lng: -156.4729 }
  },
  {
    id: '8',
    name: 'Viet House Restaurant',
    slug: 'viet-house-kailua-kona',
    category: 'Restaurant',
    subcategory: 'Vietnamese Restaurant',
    island: 'Big Island',
    city: 'Kailua-Kona',
    address: '75-5729 Alii Dr, Kailua-Kona, HI 96740',
    phone: '(808) 329-7888',
    description: 'Oceanview Vietnamese dining on the Big Island. Fresh seafood specials daily, traditional Vietnamese dishes, and tropical fusion creations.',
    hours: {
      'Monday': '11:00 AM - 9:00 PM',
      'Tuesday': '11:00 AM - 9:00 PM',
      'Wednesday': '11:00 AM - 9:00 PM',
      'Thursday': '11:00 AM - 9:00 PM',
      'Friday': '11:00 AM - 10:00 PM',
      'Saturday': '11:00 AM - 10:00 PM',
      'Sunday': '11:00 AM - 9:00 PM'
    },
    features: ['Ocean View', 'Full Bar', 'Happy Hour', 'Reservations', 'Parking'],
    images: ['/images/viet-house-1.jpg'],
    rating: 4.6,
    reviewCount: 312,
    priceRange: '$$$',
    verified: false,
    featured: false,
    coordinates: { lat: 19.6265, lng: -155.9883 }
  },
  {
    id: '9',
    name: 'Tran Tax Services',
    nameVi: 'Dịch Vụ Thuế Trần',
    slug: 'tran-tax-services',
    category: 'Professional',
    subcategory: 'Tax Services',
    island: 'Oahu',
    city: 'Honolulu',
    address: '1188 Maunakea St, Honolulu, HI 96817',
    phone: '(808) 533-8888',
    email: 'info@trantax.com',
    description: 'Professional tax preparation and bookkeeping services. Specializing in small business taxes, personal taxes, and tax planning. Vietnamese and English speaking staff.',
    hours: {
      'Monday': '9:00 AM - 5:00 PM',
      'Tuesday': '9:00 AM - 5:00 PM',
      'Wednesday': '9:00 AM - 5:00 PM',
      'Thursday': '9:00 AM - 5:00 PM',
      'Friday': '9:00 AM - 5:00 PM',
      'Saturday': '10:00 AM - 2:00 PM',
      'Sunday': 'Closed'
    },
    features: ['Vietnamese Speaking', 'E-filing', 'Year-round Service', 'Free Consultation'],
    images: ['/images/tran-tax-1.jpg'],
    rating: 4.7,
    reviewCount: 89,
    priceRange: '$$',
    verified: true,
    featured: false,
    coordinates: { lat: 21.3147, lng: -157.8625 }
  },
  {
    id: '10',
    name: 'Golden Phoenix Restaurant',
    nameVi: 'Nhà Hàng Phượng Hoàng Vàng',
    slug: 'golden-phoenix-lihue',
    category: 'Restaurant',
    subcategory: 'Vietnamese Restaurant',
    island: 'Kauai',
    city: 'Lihue',
    address: '3-3122 Kuhio Hwy, Lihue, HI 96766',
    phone: '(808) 245-8888',
    description: 'Kauai\'s premier Vietnamese restaurant serving authentic dishes with local ingredients. Popular lunch spot for locals and tourists alike.',
    hours: {
      'Monday': '10:30 AM - 8:30 PM',
      'Tuesday': '10:30 AM - 8:30 PM',
      'Wednesday': '10:30 AM - 8:30 PM',
      'Thursday': '10:30 AM - 8:30 PM',
      'Friday': '10:30 AM - 9:00 PM',
      'Saturday': '10:30 AM - 9:00 PM',
      'Sunday': 'Closed'
    },
    features: ['Dine-in', 'Takeout', 'Large Groups', 'Local Ingredients'],
    images: ['/images/golden-phoenix-1.jpg'],
    rating: 4.4,
    reviewCount: 156,
    priceRange: '$$',
    verified: false,
    featured: false,
    coordinates: { lat: 21.9747, lng: -159.3668 }
  }
];

// Helper functions for data
export const getBusinessesByIsland = (island: Island): Business[] => {
  return sampleBusinesses.filter(business => business.island === island);
};

export const getBusinessesByCategory = (category: Category): Business[] => {
  return sampleBusinesses.filter(business => business.category === category);
};

export const getFeaturedBusinesses = (): Business[] => {
  return sampleBusinesses.filter(business => business.featured);
};

export const searchBusinesses = (query: string): Business[] => {
  const lowercaseQuery = query.toLowerCase();
  return sampleBusinesses.filter(business =>
    business.name.toLowerCase().includes(lowercaseQuery) ||
    business.description.toLowerCase().includes(lowercaseQuery) ||
    business.category.toLowerCase().includes(lowercaseQuery) ||
    business.city.toLowerCase().includes(lowercaseQuery)
  );
};

export const getBusinessBySlug = (slug: string): Business | undefined => {
  return sampleBusinesses.find(business => business.slug === slug);
};

// Category data
export const categories: { name: Category; icon: string; count?: number }[] = [
  { name: 'Restaurant', icon: '🍜', count: 7 },
  { name: 'Market', icon: '🛒', count: 1 },
  { name: 'Beauty', icon: '💅', count: 1 },
  { name: 'Healthcare', icon: '🏥', count: 1 },
  { name: 'Professional', icon: '💼', count: 1 },
  { name: 'Services', icon: '🛠️', count: 0 },
];

// Island data
export const islands: { name: Island; businessCount?: number }[] = [
  { name: 'Oahu', businessCount: 6 },
  { name: 'Maui', businessCount: 1 },
  { name: 'Big Island', businessCount: 1 },
  { name: 'Kauai', businessCount: 1 },
  { name: 'Molokai', businessCount: 0 },
  { name: 'Lanai', businessCount: 0 },
];