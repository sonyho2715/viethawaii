'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Photo {
  id: string;
  url: string;
  caption?: string;
  featured: boolean;
  createdAt: string;
  uploader?: {
    name: string;
  };
}

interface PhotoGalleryProps {
  businessId?: string;
  userId?: string;
}

export default function PhotoGallery({ businessId, userId }: PhotoGalleryProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    fetchPhotos();
  }, [businessId, userId]);

  const fetchPhotos = async () => {
    try {
      const params = new URLSearchParams();
      if (businessId) params.append('businessId', businessId);
      if (userId) params.append('userId', userId);

      const response = await fetch(`/api/photos?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setPhotos(data);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-gray-200 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="mt-2 text-sm text-gray-500">No photos yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <button
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <Image
              src={photo.url}
              alt={photo.caption || 'Photo'}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
            {photo.featured && (
              <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                Featured
              </div>
            )}
            {photo.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <p className="text-white text-sm line-clamp-2">{photo.caption}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <Image
                src={selectedPhoto.url}
                alt={selectedPhoto.caption || 'Photo'}
                fill
                className="object-contain"
              />
            </div>
            {selectedPhoto.caption && (
              <div className="mt-4 text-white">
                <p className="text-lg">{selectedPhoto.caption}</p>
                {selectedPhoto.uploader && (
                  <p className="text-sm text-gray-400 mt-2">
                    Uploaded by {selectedPhoto.uploader.name}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
