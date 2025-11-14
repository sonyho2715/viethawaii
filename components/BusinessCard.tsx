import Link from 'next/link';
import { Business } from '@/lib/sampleData';
import { Star, MapPin, DollarSign, CheckCircle } from 'lucide-react';

interface BusinessCardProps {
  business: Business;
}

export default function BusinessCard({ business }: BusinessCardProps) {
  return (
    <Link href={`/business/${business.slug}`} className="block">
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer">
      {/* Image placeholder */}
      <div className="h-48 bg-gradient-to-br from-primary-100 to-secondary-100 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl opacity-50">
            {business.category === 'Restaurant' && '🍜'}
            {business.category === 'Market' && '🛒'}
            {business.category === 'Beauty' && '💅'}
            {business.category === 'Healthcare' && '🏥'}
            {business.category === 'Professional' && '💼'}
            {business.category === 'Services' && '🛠️'}
          </span>
        </div>
        {business.featured && (
          <div className="absolute top-2 right-2 bg-primary-500 text-white px-2 py-1 rounded text-xs font-semibold">
            Featured
          </div>
        )}
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