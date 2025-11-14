import Link from 'next/link';
import { Star, MapPin, DollarSign, CheckCircle } from 'lucide-react';

interface Business {
  id: string;
  name: string;
  nameVi?: string | null;
  slug: string;
  description: string;
  category: string;
  subcategory: string | null;
  island: string;
  city: string;
  address: string;
  phone?: string | null;
  image: string | null;
  images: string[];
  rating: number;
  reviewCount: number;
  featured: boolean;
  verified: boolean;
  priceRange?: string | null;
  hours: any;
  features: string[];
}

interface BusinessCardProps {
  business: Business;
}

export default function BusinessCard({ business }: BusinessCardProps) {
  // Map categories to stock images
  const getImageUrl = () => {
    switch(business.category) {
      case 'Restaurant':
        return 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop';
      case 'Market':
        return 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&h=600&fit=crop';
      case 'Beauty':
        return 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop';
      case 'Healthcare':
        return 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&h=600&fit=crop';
      case 'Professional':
        return 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop';
      case 'Services':
        return 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop';
      default:
        return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop';
    }
  };

  return (
    <Link href={`/business/${business.slug}`} className="block">
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer">
      {/* Image with overlay */}
      <div className="h-48 relative overflow-hidden group">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundImage: `url('${getImageUrl()}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        {business.featured && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-red-600 to-yellow-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
            ⭐ Featured
          </div>
        )}
        <div className="absolute bottom-3 left-3">
          <span className="text-4xl drop-shadow-lg">
            {business.category === 'Restaurant' && '🍜'}
            {business.category === 'Market' && '🛒'}
            {business.category === 'Beauty' && '💅'}
            {business.category === 'Healthcare' && '🏥'}
            {business.category === 'Professional' && '💼'}
            {business.category === 'Services' && '🛠️'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {business.name}
          </h3>
          {business.verified && (
            <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
          )}
        </div>

        {business.nameVi && (
          <p className="text-sm text-gray-600 mb-2">{business.nameVi}</p>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <MapPin className="w-4 h-4" />
          <span>{business.city}, {business.island}</span>
        </div>

        <p className="text-sm text-gray-700 line-clamp-2 mb-3">
          {business.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{business.rating}</span>
            <span className="text-sm text-gray-500">({business.reviewCount})</span>
          </div>

          {business.priceRange && (
            <div className="flex items-center text-gray-600">
              {[...Array(4)].map((_, i) => (
                <DollarSign
                  key={i}
                  className={`w-4 h-4 ${
                    i < business.priceRange!.length
                      ? 'text-gray-800'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mt-3">
          {business.features.slice(0, 3).map((feature) => (
            <span
              key={feature}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
      </div>
    </Link>
  );
}