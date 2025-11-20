'use client';

import { X, MapPin, Phone, Globe, Star, Clock, DollarSign, Navigation, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import FavoriteButton from './FavoriteButton';

interface Business {
  id: string;
  name: string;
  nameVi?: string;
  slug: string;
  description?: string;
  category: string;
  subcategory?: string;
  address?: string;
  city: string;
  island: string;
  phone?: string;
  email?: string;
  website?: string;
  image?: string;
  images?: string[];
  priceRange?: string;
  rating?: number;
  reviewCount?: number;
  features?: string[];
  hours?: any;
  lat?: number;
  lng?: number;
}

interface BusinessModalProps {
  business: Business;
  onClose: () => void;
}

export default function BusinessModal({ business, onClose }: BusinessModalProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  const allImages = business.images && business.images.length > 0
    ? business.images
    : business.image
    ? [business.image]
    : ['/placeholder-business.jpg'];

  const getDirectionsUrl = () => {
    const address = business.address
      ? `${business.address}, ${business.city}, ${business.island}, HI`
      : `${business.city}, ${business.island}, HI`;
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto shadow-2xl animate-slideUp">
        {/* Header with image gallery */}
        <div className="relative h-96 bg-gray-200">
          {allImages[selectedImage] && (
            <Image
              src={allImages[selectedImage]}
              alt={business.name}
              fill
              className="object-cover"
              priority
            />
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2.5 hover:bg-white transition-all shadow-lg z-10"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>

          {/* Favorite button */}
          <div className="absolute top-4 left-4 z-10">
            <FavoriteButton businessId={business.id} variant="card" />
          </div>

          {/* Category badge */}
          <div className="absolute top-4 left-20 z-10">
            <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              {business.category}
            </span>
          </div>

          {/* Image thumbnails */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/40 backdrop-blur-sm p-2 rounded-xl">
              {allImages.slice(0, 5).map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === idx
                      ? 'border-white scale-110'
                      : 'border-white/50 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${business.name} - Image ${idx + 1}`}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
              {allImages.length > 5 && (
                <div className="w-16 h-16 rounded-lg bg-black/60 border-2 border-white/50 flex items-center justify-center text-white text-xs font-bold">
                  +{allImages.length - 5}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Business details */}
        <div className="p-8">
          {/* Title and rating */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div className="flex-1">
              <h2 className="text-4xl font-black text-gray-900 mb-2">{business.name}</h2>
              {business.nameVi && (
                <p className="text-xl text-gray-600 font-medium mb-3">{business.nameVi}</p>
              )}
              {business.subcategory && (
                <span className="inline-block bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {business.subcategory}
                </span>
              )}
            </div>

            {/* Rating card */}
            {business.rating !== undefined && (
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-4 text-center min-w-[140px]">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  <span className="text-3xl font-black text-gray-900">
                    {business.rating.toFixed(1)}
                  </span>
                </div>
                {business.reviewCount !== undefined && (
                  <p className="text-sm text-gray-600 font-medium">
                    {business.reviewCount} {business.reviewCount === 1 ? 'review' : 'reviews'}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Quick info grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-gray-50 rounded-xl p-6">
            {business.priceRange && (
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Price Range</p>
                  <p className="text-base font-bold text-gray-900">{business.priceRange}</p>
                </div>
              </div>
            )}

            {business.address && (
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 font-medium">Address</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {business.address}, {business.city}
                  </p>
                </div>
              </div>
            )}

            {business.phone && (
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Phone className="w-5 h-5 text-purple-700" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Phone</p>
                  <a
                    href={`tel:${business.phone}`}
                    className="text-base font-bold text-purple-700 hover:text-purple-900"
                  >
                    {formatPhoneNumber(business.phone)}
                  </a>
                </div>
              </div>
            )}

            {business.website && (
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Globe className="w-5 h-5 text-orange-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 font-medium">Website</p>
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-orange-700 hover:text-orange-900 truncate block"
                  >
                    Visit Website
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {business.description && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">About</h3>
              <p className="text-gray-700 leading-relaxed">{business.description}</p>
            </div>
          )}

          {/* Features */}
          {business.features && business.features.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Features</h3>
              <div className="flex flex-wrap gap-2">
                {business.features.map((feature, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
            <Link
              href={`/business/${business.slug}`}
              className="flex-1 bg-gradient-to-r from-rose-500 to-orange-500 text-white py-4 px-6 rounded-xl font-bold text-center hover:from-rose-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              View Full Details
            </Link>

            {business.phone && (
              <a
                href={`tel:${business.phone}`}
                className="flex-1 bg-green-500 text-white py-4 px-6 rounded-xl font-bold text-center hover:bg-green-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Call Now
              </a>
            )}

            <a
              href={getDirectionsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-blue-500 text-white py-4 px-6 rounded-xl font-bold text-center hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Navigation className="w-5 h-5" />
              Directions
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
