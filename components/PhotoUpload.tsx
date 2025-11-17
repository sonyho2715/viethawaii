'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface PhotoUploadProps {
  businessId?: string;
  onUploadComplete?: (photoUrl: string) => void;
  maxFiles?: number;
}

export default function PhotoUpload({
  businessId,
  onUploadComplete,
  maxFiles = 5,
}: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadedPhotos, setUploadedPhotos] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (uploadedPhotos.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} photos allowed`);
      return;
    }

    setError('');
    setUploading(true);

    // Create previews
    const newPreviews = await Promise.all(
      files.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      })
    );
    setPreviews((prev) => [...prev, ...newPreviews]);

    // Upload files
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        if (businessId) formData.append('businessId', businessId);

        const response = await fetch('/api/photos', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Upload failed');
        }

        return response.json();
      });

      const results = await Promise.all(uploadPromises);
      const newPhotos = results.map((r) => r.photo);

      setUploadedPhotos((prev) => [...prev, ...newPhotos]);

      // Callback with first uploaded photo URL
      if (onUploadComplete && newPhotos.length > 0) {
        onUploadComplete(newPhotos[0].url);
      }

      setUploading(false);
      setPreviews([]);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload photos');
      setUploading(false);
      setPreviews([]);
    }
  };

  const removePhoto = async (photoId: string) => {
    if (!confirm('Remove this photo?')) return;

    try {
      const response = await fetch(`/api/photos/${photoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUploadedPhotos((prev) => prev.filter((p) => p.id !== photoId));
      }
    } catch (err) {
      setError('Failed to remove photo');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Photos
        </label>
        <div className="flex items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            onChange={handleFileSelect}
            disabled={uploading || uploadedPhotos.length >= maxFiles}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {uploading && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
              Uploading...
            </div>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500">
          JPEG, PNG, or WebP. Max 5MB per file. {uploadedPhotos.length}/{maxFiles}{' '}
          photos
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Preview during upload */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
              <Image
                src={preview}
                alt={`Preview ${index + 1}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Uploaded photos */}
      {uploadedPhotos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {uploadedPhotos.map((photo) => (
            <div
              key={photo.id}
              className="relative aspect-square rounded-lg overflow-hidden border-2 border-green-500 group"
            >
              <Image
                src={photo.url}
                alt={photo.caption || 'Uploaded photo'}
                fill
                className="object-cover"
              />
              <button
                onClick={() => removePhoto(photo.id)}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove photo"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              {photo.featured && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                  Featured
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
