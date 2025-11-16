import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBusinessBySlug, sampleBusinesses } from '@/lib/sampleData';
import {
  MapPin,
  Phone,
  Globe,
  Mail,
  Clock,
  Star,
  DollarSign,
  CheckCircle,
  ChevronLeft,
  ExternalLink
} from 'lucide-react';
import StructuredData from '@/components/StructuredData';
import SocialShare from '@/components/SocialShare';

export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateStaticParams() {
  return sampleBusinesses.map((business) => ({
    slug: business.slug,
  }));
}

export default function BusinessDetailPage({ params }: { params: { slug: string } }) {
  const business = getBusinessBySlug(params.slug);

  if (!business) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StructuredData business={business} type="business" />
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back to Directory</span>
            </Link>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🌺</span>
              <span className="text-xl font-bold text-gray-900">VietHawaii</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <div className="h-64 bg-gradient-to-br from-primary-100 to-secondary-100 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-8xl opacity-30">
            {business.category === 'Restaurant' && '🍜'}
            {business.category === 'Market' && '🛒'}
            {business.category === 'Beauty' && '💅'}
            {business.category === 'Healthcare' && '🏥'}
            {business.category === 'Professional' && '💼'}
            {business.category === 'Services' && '🛠️'}
          </span>
        </div>
        {business.featured && (
          <div className="absolute top-4 right-4 bg-primary-500 text-white px-3 py-1 rounded text-sm font-semibold">
            Featured Business
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Business Title */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {business.name}
                  </h1>
                  {business.nameVi && (
                    <p className="text-xl text-gray-600">{business.nameVi}</p>
                  )}
                </div>
                {business.verified && (
                  <div className="flex items-center space-x-1 text-blue-500">
                    <CheckCircle className="w-6 h-6" />
                    <span className="text-sm font-medium">Verified</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{business.rating}</span>
                  <span className="text-gray-500">({business.reviewCount} reviews)</span>
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
                <span className="text-gray-600">{business.subcategory}</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed">
                {business.description}
              </p>
              {business.descriptionVi && (
                <p className="text-gray-600 mt-4 italic">
                  {business.descriptionVi}
                </p>
              )}

              {/* Social Share */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <SocialShare
                  title={`${business.name} - VietHawaii`}
                  description={business.description}
                />
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Features</h2>
              <div className="flex flex-wrap gap-2">
                {business.features.map((feature: string) => (
                  <span
                    key={feature}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-900">{business.address}</p>
                    <p className="text-gray-600">{business.city}, {business.island}</p>
                  </div>
                </div>

                {business.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <a href={`tel:${business.phone}`} className="text-primary-600 hover:underline">
                      {business.phone}
                    </a>
                  </div>
                )}

                {business.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline flex items-center"
                    >
                      Visit Website
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                )}

                {business.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <a href={`mailto:${business.email}`} className="text-primary-600 hover:underline">
                      {business.email}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Google Maps */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Location
              </h3>
              <div className="aspect-video rounded-lg overflow-hidden border-2 border-gray-200">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(business.address)}&zoom=15`}
                ></iframe>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center text-sm font-semibold text-rose-600 hover:text-rose-700"
              >
                Open in Google Maps
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Business Hours
              </h3>

              <div className="space-y-2">
                {Object.entries(business.hours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{day}</span>
                    <span className="text-gray-600">{String(hours)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}