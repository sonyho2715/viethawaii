'use client';

import { Island, islands } from '@/lib/sampleData';

interface IslandSelectorProps {
  selectedIsland: Island | 'All';
  onSelectIsland: (island: Island | 'All') => void;
}

export default function IslandSelector({ selectedIsland, onSelectIsland }: IslandSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelectIsland('All')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          selectedIsland === 'All'
            ? 'bg-primary-500 text-white'
            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
        }`}
      >
        All Islands
      </button>
      {islands.map((island) => (
        <button
          key={island.name}
          onClick={() => onSelectIsland(island.name)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedIsland === island.name
              ? 'bg-primary-500 text-white'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          {island.name}
          {island.businessCount !== undefined && island.businessCount > 0 && (
            <span className="ml-1 text-sm opacity-80">({island.businessCount})</span>
          )}
        </button>
      ))}
    </div>
  );
}