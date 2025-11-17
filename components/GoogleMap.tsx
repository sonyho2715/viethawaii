'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface GoogleMapProps {
  address: string;
  businessName: string;
  lat?: number;
  lng?: number;
}

export default function GoogleMap({ address, businessName, lat, lng }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
          version: 'weekly',
        });

        const { Map } = await loader.importLibrary('maps');
        const { AdvancedMarkerElement } = await loader.importLibrary('marker');

        if (!mapRef.current) return;

        let mapCenter: { lat: number; lng: number };

        // Use provided coordinates or geocode address
        if (lat && lng) {
          mapCenter = { lat, lng };
        } else {
          // Geocode the address
          const geocoder = new google.maps.Geocoder();
          const result = await geocoder.geocode({ address });

          if (result.results[0]) {
            mapCenter = {
              lat: result.results[0].geometry.location.lat(),
              lng: result.results[0].geometry.location.lng(),
            };
          } else {
            // Default to Honolulu if geocoding fails
            mapCenter = { lat: 21.3099, lng: -157.8581 };
            setError('Could not find exact location. Showing approximate area.');
          }
        }

        // Create map
        const map = new Map(mapRef.current, {
          center: mapCenter,
          zoom: 15,
          mapId: 'viethawaii_map',
        });

        // Create marker
        const marker = new AdvancedMarkerElement({
          map,
          position: mapCenter,
          title: businessName,
        });

        // Add info window
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px;">
              <h3 style="font-weight: bold; margin-bottom: 4px;">${businessName}</h3>
              <p style="color: #666; font-size: 14px;">${address}</p>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}"
                target="_blank"
                rel="noopener noreferrer"
                style="color: #DC2626; text-decoration: none; font-weight: 500; font-size: 14px;"
              >
                Get Directions ’
              </a>
            </div>
          `,
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        // Open info window by default
        infoWindow.open(map, marker);
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError('Failed to load map. Please try again later.');
      }
    };

    initMap();
  }, [address, businessName, lat, lng]);

  return (
    <div className="relative">
      {error && (
        <div className="mb-2 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
          {error}
        </div>
      )}
      <div
        ref={mapRef}
        className="w-full h-[400px] rounded-lg shadow-lg"
      />
      <div className="mt-3 text-center">
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          Get Directions
        </a>
      </div>
    </div>
  );
}
