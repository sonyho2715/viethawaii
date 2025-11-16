'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Phone, ExternalLink, Star } from 'lucide-react';
import Link from 'next/link';

interface Business {
  id: string;
  name: string;
  address?: string;
  city: string;
  island: string;
  category: string;
  rating?: number;
  phone?: string;
  slug: string;
  latitude?: number;
  longitude?: number;
}

interface BusinessMapProps {
  businesses: Business[];
  selectedBusiness?: Business | null;
  onBusinessSelect?: (business: Business) => void;
}

// Mock coordinates for Hawaiian islands (center points)
const ISLAND_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Oahu': { lat: 21.4389, lng: -158.0001 },
  'Maui': { lat: 20.7984, lng: -156.3319 },
  'Hawaii Island': { lat: 19.5429, lng: -155.6659 },
  'Kauai': { lat: 22.0964, lng: -159.5261 },
  'Molokai': { lat: 21.1444, lng: -157.0226 },
  'Lanai': { lat: 20.8283, lng: -156.9197 },
};

export default function BusinessMap({ businesses, selectedBusiness, onBusinessSelect }: BusinessMapProps) {
  const [activeIsland, setActiveIsland] = useState<string>('Oahu');
  const [mapView, setMapView] = useState<'list' | 'map'>('map');
  const mapRef = useRef<HTMLDivElement>(null);

  // Filter businesses by island
  const filteredBusinesses = businesses.filter(b => b.island === activeIsland);

  // Get directions URL
  const getDirectionsUrl = (business: Business) => {
    const address = business.address
      ? `${business.address}, ${business.city}, ${business.island}, HI`
      : `${business.city}, ${business.island}, HI`;
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  };

  // Get map URL
  const getMapUrl = (business: Business) => {
    const address = business.address
      ? `${business.address}, ${business.city}, ${business.island}, HI`
      : `${business.city}, ${business.island}, HI`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-500 to-orange-500 text-white p-6">
        <h2 className="text-3xl font-black mb-2">Business Locations</h2>
        <p className="text-orange-100">Find Vietnamese businesses near you across Hawaii</p>
      </div>

      {/* Island Selector */}
      <div className="border-b border-gray-200 p-4 bg-gray-50">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {Object.keys(ISLAND_COORDINATES).map((island) => {
            const count = businesses.filter(b => b.island === island).length;
            return (
              <button
                key={island}
                onClick={() => setActiveIsland(island)}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  activeIsland === island
                    ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {island} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* View Toggle */}
      <div className="border-b border-gray-200 p-4 flex items-center justify-between bg-white">
        <div className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{filteredBusinesses.length}</span> businesses in {activeIsland}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setMapView('map')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              mapView === 'map'
                ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <MapPin className="w-4 h-4 inline mr-1" />
            Map View
          </button>
          <button
            onClick={() => setMapView('list')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              mapView === 'list'
                ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            List View
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col lg:flex-row">
        {/* Map Area */}
        {mapView === 'map' && (
          <div className="lg:w-2/3 h-96 lg:h-[600px] bg-gray-100 relative">
            {/* Embedded Google Maps iframe */}
            <div ref={mapRef} className="w-full h-full relative">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/search?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'DEMO_KEY'}&q=Vietnamese+business+in+${encodeURIComponent(activeIsland)}+Hawaii&zoom=11`}
              />
              {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                  <div className="text-center p-8 bg-white rounded-2xl shadow-2xl max-w-md mx-4">
                    <MapPin className="w-20 h-20 text-rose-500 mx-auto mb-6" />
                    <h3 className="text-2xl font-black text-gray-900 mb-3">
                      Map Preview - {activeIsland}
                    </h3>
                    <p className="text-gray-700 mb-6 text-base font-semibold">
                      Full interactive map available with Google Maps API key
                    </p>
                    <a
                      href={`https://www.google.com/maps/search/Vietnamese+business+${activeIsland}+Hawaii`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-xl font-black hover:shadow-2xl transition-all hover:scale-105 text-base"
                    >
                      <ExternalLink className="w-5 h-5" />
                      Open in Google Maps
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Business List */}
        <div className={`${mapView === 'map' ? 'lg:w-1/3' : 'w-full'} overflow-y-auto max-h-[600px]`}>
          {filteredBusinesses.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredBusinesses.map((business) => (
                <div
                  key={business.id}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    selectedBusiness?.id === business.id ? 'bg-rose-50 border-l-4 border-rose-500' : ''
                  }`}
                  onClick={() => onBusinessSelect?.(business)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Business Name */}
                      <Link
                        href={`/business/${business.slug}`}
                        className="font-bold text-gray-900 hover:text-rose-600 transition-colors block truncate"
                      >
                        {business.name}
                      </Link>

                      {/* Category */}
                      <div className="mt-1">
                        <span className="text-xs px-2 py-1 bg-rose-100 text-rose-700 rounded-full">
                          {business.category}
                        </span>
                      </div>

                      {/* Address */}
                      {business.address && (
                        <div className="flex items-start gap-1 mt-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{business.address}, {business.city}</span>
                        </div>
                      )}

                      {/* Rating */}
                      {business.rating && (
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-semibold text-gray-900">{business.rating}</span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-3">
                        <a
                          href={getDirectionsUrl(business)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Navigation className="w-3 h-3" />
                          Directions
                        </a>
                        {business.phone && (
                          <a
                            href={`tel:${business.phone}`}
                            className="text-xs px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Phone className="w-3 h-3" />
                            Call
                          </a>
                        )}
                        <a
                          href={getMapUrl(business)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Map
                        </a>
                      </div>
                    </div>

                    <MapPin className="w-6 h-6 text-rose-500 flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="font-semibold">No businesses found</p>
              <p className="text-sm mt-1">Try selecting a different island</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-600">
        <p>
          💡 <strong>Tip:</strong> Click on a business to see details, get directions, or call directly
        </p>
      </div>
    </div>
  );
}
