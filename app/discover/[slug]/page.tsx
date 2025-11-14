import Link from 'next/link';
import { notFound } from 'next/navigation';
import { discoverItems } from '@/lib/enhancedData';
import { ChevronLeft, MapPin, Calendar, Star, Heart, Users, Utensils, Coffee, ShoppingBag } from 'lucide-react';

export async function generateStaticParams() {
  return discoverItems.map((item) => ({
    slug: item.link.split('/').pop() || '',
  }));
}

function getItemBySlug(slug: string) {
  return discoverItems.find(item => item.link.endsWith(`/${slug}`));
}

export default function DiscoverItemPage({ params }: { params: { slug: string } }) {
  const item = getItemBySlug(params.slug);

  if (!item) {
    notFound();
  }

  // Get icon based on type
  const getIcon = () => {
    switch(item.type) {
      case 'place': return <MapPin className="w-16 h-16" />;
      case 'event': return <Calendar className="w-16 h-16" />;
      case 'feature': return <Star className="w-16 h-16" />;
      case 'tradition': return <Heart className="w-16 h-16" />;
      default: return <Star className="w-16 h-16" />;
    }
  };

  const getColorScheme = () => {
    switch(item.type) {
      case 'place': return {
        gradient: 'from-red-500 via-orange-500 to-amber-500',
        badge: 'bg-red-100 text-red-700',
        button: 'from-red-500 to-orange-500'
      };
      case 'event': return {
        gradient: 'from-purple-500 via-pink-500 to-rose-500',
        badge: 'bg-purple-100 text-purple-700',
        button: 'from-purple-500 to-pink-500'
      };
      case 'feature': return {
        gradient: 'from-green-500 via-teal-500 to-cyan-500',
        badge: 'bg-green-100 text-green-700',
        button: 'from-green-500 to-teal-500'
      };
      case 'tradition': return {
        gradient: 'from-blue-500 via-indigo-500 to-purple-500',
        badge: 'bg-blue-100 text-blue-700',
        button: 'from-blue-500 to-indigo-500'
      };
    }
  };

  const colors = getColorScheme();

  // Related items
  const relatedItems = discoverItems
    .filter(i => i.id !== item.id && i.type === item.type)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/discover" className="flex items-center gap-2 text-gray-600 hover:text-rose-600 transition-colors">
              <ChevronLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Discover</span>
            </Link>
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🌺</span>
              <h1 className="text-3xl font-black bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                VietHawaii
              </h1>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className={`relative bg-gradient-to-r ${colors.gradient} text-white py-24 overflow-hidden`}>
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage: item.image
                ? `url('${item.image}')`
                : "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&h=600&fit=crop')",
            }}
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-95`} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <div className={`inline-flex items-center gap-2 px-5 py-2.5 ${colors.badge} rounded-full mb-8 font-bold text-sm uppercase tracking-wider shadow-lg`}>
              {item.type}
            </div>
            <div className="flex justify-center mb-8">
              <div className="p-6 bg-white/30 rounded-3xl backdrop-blur-md shadow-2xl animate-float">
                {getIcon()}
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 drop-shadow-2xl leading-tight">
              {item.title}
            </h1>
            {item.titleVi && (
              <p className="text-2xl md:text-3xl text-white italic mb-8 drop-shadow-lg font-medium">
                {item.titleVi}
              </p>
            )}
            <p className="text-lg md:text-xl text-white max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
              {item.description}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8">
          <div className="prose prose-xl max-w-none">
            {item.type === 'place' && (
              <>
                <h2 className="text-4xl font-black text-gray-900 mb-8">About This Place</h2>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  {item.description} This is a must-visit location for anyone interested in exploring Vietnamese culture in Hawaii.
                </p>

                <h3 className="text-3xl font-bold text-gray-900 mb-6">What to Expect</h3>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-4">
                    <span className="text-3xl flex-shrink-0">🍜</span>
                    <span className="text-lg text-gray-700 pt-1">Authentic Vietnamese cuisine and specialties</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-3xl flex-shrink-0">🌺</span>
                    <span className="text-lg text-gray-700 pt-1">Friendly Vietnamese-speaking staff</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-3xl flex-shrink-0">📍</span>
                    <span className="text-lg text-gray-700 pt-1">Convenient location with easy access</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-3xl flex-shrink-0">💰</span>
                    <span className="text-lg text-gray-700 pt-1">Affordable prices for everyone</span>
                  </li>
                </ul>
              </>
            )}

            {item.type === 'event' && (
              <>
                <h2 className="text-4xl font-black text-gray-900 mb-8">About This Event</h2>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  {item.description} Join the Vietnamese community in Hawaii for this special celebration.
                </p>

                <h3 className="text-3xl font-bold text-gray-900 mb-6">Event Highlights</h3>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-4">
                    <span className="text-3xl flex-shrink-0">🎉</span>
                    <span className="text-lg text-gray-700 pt-1">Traditional performances and entertainment</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-3xl flex-shrink-0">🍜</span>
                    <span className="text-lg text-gray-700 pt-1">Authentic Vietnamese food and treats</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-3xl flex-shrink-0">👨‍👩‍👧‍👦</span>
                    <span className="text-lg text-gray-700 pt-1">Family-friendly activities for all ages</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-3xl flex-shrink-0">🤝</span>
                    <span className="text-lg text-gray-700 pt-1">Connect with the Vietnamese community</span>
                  </li>
                </ul>
              </>
            )}

            {item.type === 'feature' && (
              <>
                <h2 className="text-4xl font-black text-gray-900 mb-8">Featured Experience</h2>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  {item.description} Discover what makes this experience unique and authentic.
                </p>

                <h3 className="text-3xl font-bold text-gray-900 mb-6">Why Visit</h3>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-4">
                    <span className="text-3xl flex-shrink-0">⭐</span>
                    <span className="text-lg text-gray-700 pt-1">Highly rated by the Vietnamese community</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-3xl flex-shrink-0">🌟</span>
                    <span className="text-lg text-gray-700 pt-1">Authentic cultural experience</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-3xl flex-shrink-0">📸</span>
                    <span className="text-lg text-gray-700 pt-1">Perfect for photos and memories</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-3xl flex-shrink-0">🎯</span>
                    <span className="text-lg text-gray-700 pt-1">Suitable for all experience levels</span>
                  </li>
                </ul>
              </>
            )}

            {item.type === 'tradition' && (
              <>
                <h2 className="text-4xl font-black text-gray-900 mb-8">About This Tradition</h2>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  {item.description} Learn about the rich cultural heritage that connects Vietnam and Hawaii.
                </p>

                <h3 className="text-3xl font-bold text-gray-900 mb-6">Cultural Significance</h3>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-4">
                    <span className="text-3xl flex-shrink-0">📚</span>
                    <span className="text-lg text-gray-700 pt-1">Deep historical and cultural roots</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-3xl flex-shrink-0">👴</span>
                    <span className="text-lg text-gray-700 pt-1">Passed down through generations</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-3xl flex-shrink-0">🌏</span>
                    <span className="text-lg text-gray-700 pt-1">Connects Vietnamese communities worldwide</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-3xl flex-shrink-0">💝</span>
                    <span className="text-lg text-gray-700 pt-1">Important to Vietnamese identity</span>
                  </li>
                </ul>
              </>
            )}

            <div className={`bg-gradient-to-r ${colors.gradient} text-white rounded-2xl p-8 mb-6 shadow-xl`}>
              <h3 className="text-2xl font-bold mb-4 drop-shadow">Planning Your Visit</h3>
              <p className="text-white text-lg leading-relaxed drop-shadow">
                For more information and specific details, check with local Vietnamese businesses or
                contact the community organizations listed in our business directory.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-white rounded-2xl shadow-xl p-10 md:p-12 mb-8">
          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Ready to Explore?</h3>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Browse our directory of Vietnamese businesses and discover more amazing places.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/businesses"
                className={`px-10 py-5 bg-gradient-to-r ${colors.button} text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all`}
              >
                Browse Businesses
              </Link>
              <Link
                href="/discover"
                className="px-10 py-5 border-2 border-gray-300 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
              >
                More Discoveries
              </Link>
            </div>
          </div>
        </div>

        {/* Related Items */}
        {relatedItems.length > 0 && (
          <div>
            <h2 className="text-4xl font-black text-gray-900 mb-8">More Like This</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedItems.map((related) => (
                <Link
                  key={related.id}
                  href={related.link}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`h-48 bg-gradient-to-r ${colors.gradient} relative`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-7xl opacity-50 group-hover:scale-110 transition-transform">
                        {related.type === 'place' && '📍'}
                        {related.type === 'event' && '🎉'}
                        {related.type === 'feature' && '⭐'}
                        {related.type === 'tradition' && '🏮'}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-rose-600 transition-colors">
                      {related.title}
                    </h3>
                    <p className="text-base text-gray-600 line-clamp-2 leading-relaxed">{related.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
