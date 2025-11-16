'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import {
  MapPin,
  Navigation,
  Phone,
  ExternalLink,
  Star,
  Filter,
  Locate,
  X,
  ChevronDown,
  Search
} from 'lucide-react';
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

interface InteractiveBusinessMapProps {
  businesses: Business[];
  selectedBusiness?: Business | null;
  onBusinessSelect?: (business: Business) => void;
}

// Default island coordinates
const ISLAND_COORDINATES: Record<string, { lat: number; lng: number; zoom: number }> = {
  'Oahu': { lat: 21.4389, lng: -158.0001, zoom: 11 },
  'Maui': { lat: 20.7984, lng: -156.3319, zoom: 10 },
  'Hawaii Island': { lat: 19.5429, lng: -155.6659, zoom: 9 },
  'Kauai': { lat: 22.0964, lng: -159.5261, zoom: 10 },
  'Molokai': { lat: 21.1444, lng: -157.0226, zoom: 11 },
  'Lanai': { lat: 20.8283, lng: -156.9197, zoom: 11 },
};

export default function InteractiveBusinessMap({
  businesses,
  selectedBusiness,
  onBusinessSelect
}: InteractiveBusinessMapProps) {
  const [activeIsland, setActiveIsland] = useState<string>('Oahu');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'distance'>('name');
  const [showFilters, setShowFilters] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);

  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(businesses.map(b => b.category)))];

  // Filter businesses
  const getFilteredBusinesses = useCallback(() => {
    let filtered = businesses.filter(b => b.island === activeIsland);

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(b => b.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(b =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter(b => (b.rating || 0) >= minRating);
    }

    // Calculate distances if user location available
    if (userLocation && sortBy === 'distance') {
      filtered = filtered.map(b => ({
        ...b,
        distance: b.latitude && b.longitude
          ? calculateDistance(userLocation.lat, userLocation.lng, b.latitude, b.longitude)
          : Infinity
      })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
    } else if (sortBy === 'rating') {
      filtered = filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [businesses, activeIsland, selectedCategory, searchQuery, minRating, sortBy, userLocation]);

  const filteredBusinesses = getFilteredBusinesses();

  // Calculate distance between two coordinates (Haversine formula)
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

  // Get user's location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);

          // Center map on user location
          if (googleMapRef.current) {
            googleMapRef.current.setCenter(location);
            googleMapRef.current.setZoom(13);

            // Add user location marker
            new google.maps.Marker({
              position: location,
              map: googleMapRef.current,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#3B82F6',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 2,
              },
              title: 'Your Location'
            });
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  // Get directions URL
  const getDirectionsUrl = (business: Business) => {
    const address = business.address
      ? `${business.address}, ${business.city}, ${business.island}, HI`
      : `${business.city}, ${business.island}, HI`;
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  };

  // Initialize Google Map
  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current || !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) return;

      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        version: 'weekly',
        libraries: ['places', 'marker']
      });

      try {
        const google = await loader.load();
        const islandCoords = ISLAND_COORDINATES[activeIsland];

        const map = new google.maps.Map(mapRef.current, {
          center: { lat: islandCoords.lat, lng: islandCoords.lng },
          zoom: islandCoords.zoom,
          styles: [
            {
              featureType: 'poi.business',
              stylers: [{ visibility: 'off' }]
            }
          ],
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        });

        googleMapRef.current = map;
        infoWindowRef.current = new google.maps.InfoWindow();

      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initMap();
  }, [activeIsland]);

  // Update markers when businesses change
  useEffect(() => {
    if (!googleMapRef.current) return;

    // Clear existing markers and clusterer
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
    }

    const bounds = new google.maps.LatLngBounds();
    const newMarkers: google.maps.Marker[] = [];

    filteredBusinesses.forEach((business) => {
      // Use latitude/longitude if available, otherwise use island center
      const position = business.latitude && business.longitude
        ? { lat: business.latitude, lng: business.longitude }
        : ISLAND_COORDINATES[business.island];

      // Custom marker icon
      const markerIcon = {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: business.rating && business.rating >= 4 ? '#f43f5e' : '#fb923c',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
      };

      const marker = new google.maps.Marker({
        position,
        map: googleMapRef.current,
        title: business.name,
        icon: markerIcon,
        animation: selectedBusiness?.id === business.id ? google.maps.Animation.BOUNCE : undefined,
      });

      // Info window content
      const infoContent = `
        <div style="padding: 12px; max-width: 250px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 700; color: #111827;">
            ${business.name}
          </h3>
          <div style="margin-bottom: 8px;">
            <span style="background: #fef2f2; color: #dc2626; padding: 4px 8px; border-radius: 9999px; font-size: 12px; font-weight: 600;">
              ${business.category}
            </span>
          </div>
          ${business.rating ? `
            <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 8px;">
              <span style="color: #eab308;">⭐</span>
              <span style="font-weight: 600; color: #111827;">${business.rating}</span>
            </div>
          ` : ''}
          ${business.address ? `
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #6b7280;">
              📍 ${business.address}, ${business.city}
            </p>
          ` : ''}
          <div style="display: flex; gap: 8px; margin-top: 12px;">
            <a
              href="/business/${business.slug}"
              style="background: linear-gradient(to right, #f43f5e, #fb923c); color: white; padding: 6px 12px; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: 600;"
            >
              View Details
            </a>
            <a
              href="${getDirectionsUrl(business)}"
              target="_blank"
              style="background: #3b82f6; color: white; padding: 6px 12px; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: 600;"
            >
              Directions
            </a>
          </div>
        </div>
      `;

      // Click event for marker
      marker.addListener('click', () => {
        infoWindowRef.current?.setContent(infoContent);
        infoWindowRef.current?.open(googleMapRef.current, marker);
        onBusinessSelect?.(business);
      });

      newMarkers.push(marker);
      bounds.extend(position);
    });

    markersRef.current = newMarkers;

    // Create marker clusterer
    if (newMarkers.length > 0) {
      clustererRef.current = new MarkerClusterer({
        map: googleMapRef.current,
        markers: newMarkers,
        algorithmOptions: { maxZoom: 15 }
      });

      // Fit bounds to show all markers
      if (newMarkers.length > 1) {
        googleMapRef.current.fitBounds(bounds);
      }
    }
  }, [filteredBusinesses, selectedBusiness, onBusinessSelect]);

  // Zoom to selected business
  useEffect(() => {
    if (selectedBusiness && googleMapRef.current) {
      const position = selectedBusiness.latitude && selectedBusiness.longitude
        ? { lat: selectedBusiness.latitude, lng: selectedBusiness.longitude }
        : ISLAND_COORDINATES[selectedBusiness.island];

      googleMapRef.current.setCenter(position);
      googleMapRef.current.setZoom(15);
    }
  }, [selectedBusiness]);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-500 to-orange-500 text-white p-6">
        <h2 className="text-3xl font-black mb-2">Business Locations</h2>
        <p className="text-orange-100">Find Vietnamese businesses near you across Hawaii</p>
      </div>

      {/* Controls */}
      <div className="border-b border-gray-200 p-4 bg-gray-50 space-y-4">
        {/* Island Selector */}
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

        {/* Search and Filters Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search businesses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white font-medium"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          {/* Get Location Button */}
          <button
            onClick={getUserLocation}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors whitespace-nowrap"
          >
            <Locate className="w-4 h-4" />
            Near Me
          </button>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Sort By */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="rating">Rating (High to Low)</option>
                  {userLocation && <option value="distance">Distance (Near to Far)</option>}
                </select>
              </div>

              {/* Minimum Rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Minimum Rating: {minRating > 0 ? `${minRating}★` : 'All'}
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            <span className="font-semibold text-gray-900">{filteredBusinesses.length}</span> businesses found
          </span>
          {userLocation && (
            <span className="text-blue-600 font-medium">📍 Location enabled</span>
          )}
        </div>
      </div>

      {/* Map and List */}
      <div className="flex flex-col lg:flex-row">
        {/* Map */}
        <div className="lg:w-2/3 h-96 lg:h-[700px] bg-gray-100">
          <div ref={mapRef} className="w-full h-full" />
        </div>

        {/* Business List */}
        <div className="lg:w-1/3 overflow-y-auto max-h-[700px]">
          {filteredBusinesses.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredBusinesses.map((business: any) => (
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

                      {/* Rating and Distance */}
                      <div className="flex items-center gap-3 mt-2">
                        {business.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-semibold text-gray-900">{business.rating}</span>
                          </div>
                        )}
                        {userLocation && business.distance !== undefined && business.distance !== Infinity && (
                          <span className="text-sm text-gray-600">
                            {business.distance.toFixed(1)} mi away
                          </span>
                        )}
                      </div>

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
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-600">
        <p>
          💡 <strong>Tip:</strong> Click on a marker or business to see details and get directions
        </p>
      </div>
    </div>
  );
}
