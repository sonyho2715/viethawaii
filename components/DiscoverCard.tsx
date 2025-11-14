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

  const typeColors = {
    place: 'from-blue-500 to-cyan-500',
    event: 'from-purple-500 to-pink-500',
    feature: 'from-orange-500 to-red-500',
    tradition: 'from-green-500 to-teal-500',
  };

  return (
    <Link href={item.link} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
        <div className={`h-40 bg-gradient-to-br ${typeColors[item.type]} flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-300`}>
          {getIcon()}
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