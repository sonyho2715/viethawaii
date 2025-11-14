import { Business, Island, Category } from './sampleData';

// Real Vietnamese businesses in Hawaii based on web research
export const realBusinesses: Business[] = [
  {
    id: '101',
    name: 'Pho Que Huong',
    nameVi: 'Phở Quê Hương',
    slug: 'pho-que-huong-chinatown',
    category: 'Restaurant',
    subcategory: 'Vietnamese Restaurant',
    island: 'Oahu',
    city: 'Honolulu',
    address: '1160 Maunakea St, Honolulu, HI 96817',
    phone: '(808) 528-3663',
    description: 'Authentic Vietnamese pho and traditional dishes in the heart of Chinatown. Known for generous portions and flavorful broth. A local favorite for over 15 years.',
    descriptionVi: 'Phở và món ăn truyền thống Việt Nam tại trung tâm Chinatown.',
    hours: {
      'Monday': '8:30 AM - 2:30 PM',
      'Tuesday': '8:30 AM - 2:30 PM',
      'Wednesday': '8:30 AM - 2:30 PM',
      'Thursday': '8:30 AM - 2:30 PM',
      'Friday': '8:30 AM - 2:30 PM',
      'Saturday': '8:30 AM - 2:30 PM',
      'Sunday': '8:30 AM - 2:30 PM'
    },
    features: ['Dine-in', 'Takeout', 'Cash Only', 'Parking Nearby', 'Authentic Broth'],
    images: [],
    rating: 4.5,
    reviewCount: 525,
    priceRange: '$',
    verified: true,
    featured: true,
    coordinates: { lat: 21.3136, lng: -157.8609 }
  },
  {
    id: '102',
    name: 'The Pig and The Lady',
    nameVi: 'Con Heo và Cô Gái',
    slug: 'pig-and-lady-chinatown',
    category: 'Restaurant',
    subcategory: 'Modern Vietnamese',
    island: 'Oahu',
    city: 'Honolulu',
    address: '83 N King St, Honolulu, HI 96817',
    phone: '(808) 585-8255',
    website: 'https://www.thepigandthelady.com',
    description: 'Modern Vietnamese restaurant featuring creative dishes with local ingredients. Famous for their Pho French Dip and innovative cocktails. Featured in Food Network and Bon Appétit.',
    descriptionVi: 'Nhà hàng Việt Nam hiện đại với các món ăn sáng tạo.',
    hours: {
      'Monday': 'Closed',
      'Tuesday': '11:00 AM - 2:00 PM, 5:00 PM - 9:00 PM',
      'Wednesday': '11:00 AM - 2:00 PM, 5:00 PM - 9:00 PM',
      'Thursday': '11:00 AM - 2:00 PM, 5:00 PM - 9:00 PM',
      'Friday': '11:00 AM - 2:00 PM, 5:00 PM - 9:30 PM',
      'Saturday': '10:00 AM - 2:00 PM, 5:00 PM - 9:30 PM',
      'Sunday': '10:00 AM - 2:00 PM'
    },
    features: ['Dine-in', 'Reservations Recommended', 'Full Bar', 'Craft Cocktails', 'Brunch', 'Local Ingredients'],
    images: [],
    rating: 4.7,
    reviewCount: 1250,
    priceRange: '$$$',
    verified: true,
    featured: true,
    coordinates: { lat: 21.3122, lng: -157.8606 }
  },
  {
    id: '103',
    name: 'Pate Vietnamese Cuisine',
    nameVi: 'Pate Món Việt',
    slug: 'pate-vietnamese-keeaumoku',
    category: 'Restaurant',
    subcategory: 'Vietnamese Restaurant',
    island: 'Oahu',
    city: 'Honolulu',
    address: '655 Ke\'eaumoku St, Suite 104, Honolulu, HI 96814',
    phone: '(808) 940-5432',
    website: 'https://www.patehi.com',
    description: 'Specializing in Hủ Tiếu Mì and other unique Vietnamese dishes. Go beyond basic pho and banh mi to discover authentic regional specialties.',
    descriptionVi: 'Chuyên về Hủ Tiếu Mì và các món ăn đặc sản miền Nam.',
    hours: {
      'Monday': '10:00 AM - 9:00 PM',
      'Tuesday': '10:00 AM - 9:00 PM',
      'Wednesday': '10:00 AM - 9:00 PM',
      'Thursday': '10:00 AM - 9:00 PM',
      'Friday': '10:00 AM - 9:00 PM',
      'Saturday': '10:00 AM - 9:00 PM',
      'Sunday': '10:00 AM - 9:00 PM'
    },
    features: ['Dine-in', 'Takeout', 'Delivery', 'Parking', 'Vietnamese Coffee'],
    images: [],
    rating: 4.6,
    reviewCount: 420,
    priceRange: '$$',
    verified: true,
    featured: true,
    coordinates: { lat: 21.2977, lng: -157.8334 }
  },
  {
    id: '104',
    name: 'Pho Vietnam',
    nameVi: 'Phở Việt Nam',
    slug: 'pho-vietnam-chinatown',
    category: 'Restaurant',
    subcategory: 'Vietnamese Restaurant',
    island: 'Oahu',
    city: 'Honolulu',
    address: '52 N Hotel St, Honolulu, HI 96817',
    phone: '(808) 585-6276',
    website: 'https://www.phovietnamhi.com',
    description: 'Traditional Vietnamese pho and comfort food in a casual Chinatown setting. Family recipes passed down through generations.',
    descriptionVi: 'Phở truyền thống và món ăn gia đình.',
    hours: {
      'Monday': '9:00 AM - 3:00 PM',
      'Tuesday': '9:00 AM - 3:00 PM',
      'Wednesday': '9:00 AM - 3:00 PM',
      'Thursday': '9:00 AM - 3:00 PM',
      'Friday': '9:00 AM - 3:00 PM',
      'Saturday': '9:00 AM - 3:00 PM',
      'Sunday': '9:00 AM - 3:00 PM'
    },
    features: ['Dine-in', 'Takeout', 'Family Owned', 'Authentic'],
    images: [],
    rating: 4.4,
    reviewCount: 220,
    priceRange: '$',
    verified: true,
    featured: false,
    coordinates: { lat: 21.3128, lng: -157.8615 }
  },
  {
    id: '105',
    name: 'Pho Viet Hawaii',
    nameVi: 'Phở Việt Hawaii',
    slug: 'pho-viet-kapiolani',
    category: 'Restaurant',
    subcategory: 'Vietnamese Restaurant',
    island: 'Oahu',
    city: 'Honolulu',
    address: '1341 Kapiolani Blvd, Honolulu, HI 96814',
    phone: '(808) 591-9888',
    website: 'https://phoviethawaii.com',
    description: 'Serving authentic Vietnamese cuisine daily. Specializing in pho, vermicelli bowls, and fresh spring rolls. Two locations across Oahu.',
    descriptionVi: 'Phở, bún, và gỏi cuốn tươi mỗi ngày.',
    hours: {
      'Monday': '10:00 AM - 9:00 PM',
      'Tuesday': '10:00 AM - 9:00 PM',
      'Wednesday': '10:00 AM - 9:00 PM',
      'Thursday': '10:00 AM - 9:00 PM',
      'Friday': '10:00 AM - 9:00 PM',
      'Saturday': '10:00 AM - 9:00 PM',
      'Sunday': '10:00 AM - 9:00 PM'
    },
    features: ['Dine-in', 'Takeout', 'Delivery', 'Vegetarian Options', 'Large Portions'],
    images: [],
    rating: 4.5,
    reviewCount: 380,
    priceRange: '$$',
    verified: true,
    featured: false,
    coordinates: { lat: 21.2939, lng: -157.8428 }
  },
  {
    id: '106',
    name: 'Pho K&A Local Vietnamese Cuisine',
    nameVi: 'Phở K&A',
    slug: 'pho-ka-kapahulu',
    category: 'Restaurant',
    subcategory: 'Vietnamese Restaurant',
    island: 'Oahu',
    city: 'Honolulu',
    address: '760 Kapahulu Ave, Honolulu, HI 96816',
    phone: '(808) 737-8888',
    description: 'Local favorite Vietnamese restaurant near Waikiki. Known for generous portions and friendly service. Great pho and banh mi.',
    descriptionVi: 'Nhà hàng Việt được người địa phương yêu thích.',
    hours: {
      'Monday': '10:00 AM - 9:00 PM',
      'Tuesday': '10:00 AM - 9:00 PM',
      'Wednesday': '10:00 AM - 9:00 PM',
      'Thursday': '10:00 AM - 9:00 PM',
      'Friday': '10:00 AM - 9:00 PM',
      'Saturday': '10:00 AM - 9:00 PM',
      'Sunday': '10:00 AM - 9:00 PM'
    },
    features: ['Dine-in', 'Takeout', 'Near Waikiki', 'Parking', 'Local Favorite'],
    images: [],
    rating: 4.6,
    reviewCount: 295,
    priceRange: '$$',
    verified: true,
    featured: false,
    coordinates: { lat: 21.2772, lng: -157.8153 }
  },
  {
    id: '107',
    name: 'Mama Pho',
    nameVi: 'Mẹ Phở',
    slug: 'mama-pho-honolulu',
    category: 'Restaurant',
    subcategory: 'Vietnamese Restaurant',
    island: 'Oahu',
    city: 'Honolulu',
    address: '738 Kaheka St, Honolulu, HI 96814',
    phone: '(808) 373-8887',
    website: 'https://www.mamapho.biz',
    description: 'Cozy Vietnamese restaurant serving homestyle pho and traditional dishes. Made with love, just like mama makes it.',
    descriptionVi: 'Phở và món ăn kiểu gia đình.',
    hours: {
      'Monday': '10:30 AM - 8:30 PM',
      'Tuesday': '10:30 AM - 8:30 PM',
      'Wednesday': '10:30 AM - 8:30 PM',
      'Thursday': '10:30 AM - 8:30 PM',
      'Friday': '10:30 AM - 8:30 PM',
      'Saturday': '10:30 AM - 8:30 PM',
      'Sunday': 'Closed'
    },
    features: ['Dine-in', 'Takeout', 'Family Recipes', 'Homestyle Cooking'],
    images: [],
    rating: 4.5,
    reviewCount: 185,
    priceRange: '$$',
    verified: false,
    featured: false,
    coordinates: { lat: 21.2932, lng: -157.8299 }
  },
  {
    id: '108',
    name: 'Hale Vietnam',
    nameVi: 'Hale Việt Nam',
    slug: 'hale-vietnam-kaimuki',
    category: 'Restaurant',
    subcategory: 'Vietnamese Restaurant',
    island: 'Oahu',
    city: 'Honolulu',
    address: '1140 12th Ave, Honolulu, HI 96816',
    phone: '(808) 735-7581',
    website: 'https://halevietnam86.com',
    description: 'Kaimuki Vietnamese restaurant offering authentic dishes in a welcoming atmosphere. Popular lunch spot for locals.',
    descriptionVi: 'Nhà hàng Việt Nam tại Kaimuki.',
    hours: {
      'Monday': '11:00 AM - 8:30 PM',
      'Tuesday': '11:00 AM - 8:30 PM',
      'Wednesday': '11:00 AM - 8:30 PM',
      'Thursday': '11:00 AM - 8:30 PM',
      'Friday': '11:00 AM - 8:30 PM',
      'Saturday': '11:00 AM - 8:30 PM',
      'Sunday': '11:00 AM - 8:30 PM'
    },
    features: ['Dine-in', 'Takeout', 'Parking', 'Local Favorite'],
    images: [],
    rating: 4.4,
    reviewCount: 156,
    priceRange: '$$',
    verified: false,
    featured: false,
    coordinates: { lat: 21.2829, lng: -157.7939 }
  }
];

// News Articles
export interface NewsArticle {
  id: string;
  title: string;
  titleVi?: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedDate: string;
  category: 'Community' | 'Event' | 'Business' | 'Culture' | 'Food';
  image?: string;
  featured: boolean;
}

export const newsArticles: NewsArticle[] = [
  {
    id: 'n1',
    title: 'Vietnamese Professionals of Hawaii Celebrates 10th Anniversary',
    titleVi: 'Hiệp Hội Chuyên Gia Việt Nam tại Hawaii Kỷ Niệm 10 Năm',
    slug: 'vph-10th-anniversary',
    excerpt: 'Local organization marks decade of supporting Vietnamese professionals and fostering community growth.',
    content: 'The Vietnamese Professionals of Hawaii (VPH) celebrated its 10th anniversary this month, honoring a decade of championing business and community opportunities. The organization has been instrumental in connecting Vietnamese professionals across the islands and creating pathways for economic growth.',
    author: 'VietHawaii Staff',
    publishedDate: '2025-01-10',
    category: 'Community',
    featured: true
  },
  {
    id: 'n2',
    title: 'Tết Festival 2025: Celebrating Lunar New Year in Hawaii',
    titleVi: 'Lễ Hội Tết 2025 tại Hawaii',
    slug: 'tet-festival-2025',
    excerpt: 'Annual Vietnamese New Year celebration returns to Honolulu with cultural performances, food vendors, and family activities.',
    content: 'Mark your calendars! The annual Tết Festival will take place on February 8-9, 2025 at the Hawaii Convention Center. This year\'s celebration promises traditional lion dances, Vietnamese music performances, authentic food vendors, and cultural exhibitions. Free admission for all ages.',
    author: 'Community Events',
    publishedDate: '2025-01-05',
    category: 'Event',
    featured: true
  },
  {
    id: 'n3',
    title: 'New Vietnamese Bakery Opens in Pearl City',
    titleVi: 'Tiệm Bánh Việt Nam Mới tại Pearl City',
    slug: 'new-bakery-pearl-city',
    excerpt: 'Family-owned bakery brings authentic Vietnamese pastries and French-Vietnamese fusion treats to Central Oahu.',
    content: 'Sweet Saigon Bakery opened its doors last week in Pearl City, offering traditional bánh mì, pâté chaud, and other Vietnamese-French pastries. The family-run business aims to bring authentic flavors from Vietnam to Hawaii\'s Vietnamese community.',
    author: 'Business News',
    publishedDate: '2024-12-28',
    category: 'Business',
    featured: false
  }
];

// Blog Posts
export interface BlogPost {
  id: string;
  title: string;
  titleVi?: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedDate: string;
  category: 'Guide' | 'Culture' | 'Food' | 'Lifestyle' | 'History';
  image?: string;
  readTime: number; // in minutes
}

export const blogPosts: BlogPost[] = [
  {
    id: 'b1',
    title: 'The Ultimate Guide to Vietnamese Phở in Honolulu',
    titleVi: 'Hướng Dẫn Toàn Diện về Phở Việt Nam tại Honolulu',
    slug: 'ultimate-pho-guide-honolulu',
    excerpt: 'Discover the best pho spots across Oahu and learn what makes each one special.',
    content: 'From traditional beef pho to creative modern variations, Honolulu offers an incredible variety of Vietnamese noodle soups. We\'ve visited every pho restaurant on the island to bring you this comprehensive guide...',
    author: 'David Nguyen',
    publishedDate: '2025-01-08',
    category: 'Food',
    readTime: 8
  },
  {
    id: 'b2',
    title: 'Vietnamese Culture in Hawaii: A Rich Heritage',
    titleVi: 'Văn Hóa Việt Nam tại Hawaii',
    slug: 'vietnamese-culture-hawaii',
    excerpt: 'Exploring the history and cultural contributions of the Vietnamese community in the Hawaiian Islands.',
    content: 'The Vietnamese community has been an integral part of Hawaii\'s cultural fabric for decades. From the first immigrants in the 1970s to today\'s thriving community, Vietnamese culture has enriched Hawaii in countless ways...',
    author: 'Lan Tran',
    publishedDate: '2024-12-20',
    category: 'Culture',
    readTime: 12
  },
  {
    id: 'b3',
    title: 'How to Order Like a Local at Vietnamese Restaurants',
    titleVi: 'Cách Gọi Món như Người Địa Phương',
    slug: 'how-to-order-vietnamese-food',
    excerpt: 'Tips and tricks for navigating Vietnamese menus and discovering hidden gems.',
    content: 'Walking into a Vietnamese restaurant can be overwhelming with its extensive menu. Here are insider tips on what to order, how to customize your dishes, and the secret menu items locals love...',
    author: 'Michael Chen',
    publishedDate: '2024-12-15',
    category: 'Guide',
    readTime: 6
  }
];

// Discover/Featured Content
export interface DiscoverItem {
  id: string;
  title: string;
  titleVi?: string;
  description: string;
  image?: string;
  link: string;
  type: 'place' | 'event' | 'feature' | 'tradition';
}

export const discoverItems: DiscoverItem[] = [
  {
    id: 'd1',
    title: 'Chinatown Food Tour',
    titleVi: 'Tour Ẩm Thực Chinatown',
    description: 'Explore the best Vietnamese eateries in Honolulu\'s historic Chinatown district.',
    type: 'feature',
    link: '/discover/chinatown-food-tour'
  },
  {
    id: 'd2',
    title: 'Vietnamese Coffee Culture',
    titleVi: 'Văn Hóa Cà Phê Việt Nam',
    description: 'Discover authentic Vietnamese coffee shops and learn about traditional ca phe sua da.',
    type: 'feature',
    link: '/discover/vietnamese-coffee'
  },
  {
    id: 'd3',
    title: 'Mid-Autumn Festival Celebrations',
    titleVi: 'Tết Trung Thu',
    description: 'Join the Vietnamese community in celebrating the Moon Festival with lanterns and mooncakes.',
    type: 'event',
    link: '/events/mid-autumn-festival'
  },
  {
    id: 'd4',
    title: 'Traditional Vietnamese Markets',
    titleVi: 'Chợ Việt Nam Truyền Thống',
    description: 'Shop for authentic Vietnamese ingredients, herbs, and specialty items.',
    type: 'place',
    link: '/discover/vietnamese-markets'
  }
];