import Link from 'next/link';
import { DiscoverItem } from '@/lib/enhancedData';
import { MapPin, Calendar, Star, Coffee } from 'lucide-react';

interface DiscoverCardProps {
  item: DiscoverItem;
}

export default function DiscoverCard({ item }: DiscoverCardProps) {
  const getIcon = () => {
    switch (item.type) {
      case 'place':
        return <MapPin className="w-8 h-8" />;
      case 'event':
        return <Calendar className="w-8 h-8" />;
      case 'feature':
        return <Star className="w-8 h-8" />;
      case 'tradition':
        return <Coffee className="w-8 h-8" />;
      default:
        return <Star className="w-8 h-8" />;
    }
  };

  const getImageUrl = () => {
    switch (item.type) {
      case 'place':
        return 'https://images.unsplash.com/photo-1578428774411-0f8a5a7e8a00?w=800&h=600&fit=crop';
      case 'event':
        return 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop';
      case 'feature':
        return 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop';
      case 'tradition':
        return 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&h=600&fit=crop';
      default:
        return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop';
    }
  };

  const typeColors = {
    place: 'from-blue-500 to-cyan-500',
    event: 'from-purple-500 to-pink-500',
    feature: 'from-orange-500 to-red-500',
    tradition: 'from-green-500 to-teal-500',
  };

  return (
    <Link href={item.link} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
        <div className="h-40 relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundImage: `url('${getImageUrl()}')` }}
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${typeColors[item.type]} opacity-80`} />
          <div className="absolute inset-0 flex items-center justify-center text-white">
            {getIcon()}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {item.title}
          </h3>
          {item.titleVi && (
            <p className="text-sm text-gray-600 mb-2 italic">
              {item.titleVi}
            </p>
          )}
          <p className="text-sm text-gray-700 line-clamp-2">
            {item.description}
          </p>
          <div className="mt-3">
            <span className="text-primary-600 text-sm font-medium group-hover:underline">
              Explore →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}