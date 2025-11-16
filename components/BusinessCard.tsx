import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, DollarSign, CheckCircle, Phone, Navigation, Clock } from 'lucide-react';
import type { Business } from '@/types';

interface BusinessCardProps {
  business: Business;
  userLocation?: { lat: number; lng: number } | null;
}

export default function BusinessCard({ business, userLocation }: BusinessCardProps) {
  // Calculate distance using Haversine formula
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const distance = userLocation && business.lat && business.lng
    ? calculateDistance(userLocation.lat, userLocation.lng, business.lat, business.lng)
    : null;

  // Get directions URL
  const getDirectionsUrl = () => {
    const address = business.address
      ? `${business.address}, ${business.city}, ${business.island}, HI`
      : `${business.city}, ${business.island}, HI`;
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  };

  // Format hours for display
  const getCurrentStatus = () => {
    if (!business.hours) return null;

    const now = new Date();
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
    const currentTime = now.getHours() * 100 + now.getMinutes();

    const todayHours = (business.hours as any)[dayOfWeek];
    if (!todayHours) return 'Closed';

    if (todayHours.closed) return 'Closed';

    // Check if open and close times are defined
    if (!todayHours.open || !todayHours.close) return 'Closed';

    const [openHour, openMin] = todayHours.open.split(':').map(Number);
    const [closeHour, closeMin] = todayHours.close.split(':').map(Number);
    const openTime = openHour * 100 + openMin;
    const closeTime = closeHour * 100 + closeMin;

    if (currentTime >= openTime && currentTime < closeTime) {
      return 'Open';
    }
    return 'Closed';
  };

  const status = getCurrentStatus();

  // Map categories to stock images
  const getImageUrl = () => {
    switch(business.category) {
      case 'Restaurant':
      case 'Food & Dining':
        return 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop';
      case 'Market':
      case 'Retail & Shopping':
        return 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&h=600&fit=crop';
      case 'Beauty':
      case 'Beauty & Wellness':
        return 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop';
      case 'Healthcare':
      case 'Health & Medical':
        return 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&h=600&fit=crop';
      case 'Professional':
      case 'Professional Services':
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
        <Image
          src={getImageUrl()}
          alt={business.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          priority={business.featured}
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
          {distance && (
            <span className="text-xs text-rose-600 font-semibold">
              • {distance.toFixed(1)} mi
            </span>
          )}
        </div>

        {/* Operating Hours Status */}
        {status && (
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className={`text-xs font-semibold ${
              status === 'Open' ? 'text-green-600' : 'text-gray-500'
            }`}>
              {status}
            </span>
          </div>
        )}

        <p className="text-sm text-gray-700 line-clamp-2 mb-3">
          {business.description}
        </p>

        <div className="flex items-center justify-between mb-3">
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

        {/* Quick Action Buttons */}
        <div className="flex gap-2 mb-3">
          {business.phone && (
            <a
              href={`tel:${business.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs font-semibold"
            >
              <Phone className="w-3 h-3" />
              Call
            </a>
          )}
          <a
            href={getDirectionsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs font-semibold"
          >
            <Navigation className="w-3 h-3" />
            Directions
          </a>
        </div>

        <div className="flex flex-wrap gap-1">
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