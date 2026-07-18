'use client';

import { Heart } from 'lucide-react';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { useEffect, useState } from 'react';

export function FavoriteButton({ propertyId }: { propertyId: string }) {
  const [mounted, setMounted] = useState(false);
  const { isFavorite, toggleFavorite } = useFavoritesStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="p-2 bg-white/80 rounded-full shadow-sm">
        <Heart className="w-5 h-5 text-gray-400" />
      </button>
    );
  }

  const favorite = isFavorite(propertyId);

  return (
    <button 
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(propertyId);
      }}
      className="p-2 bg-white/95 backdrop-blur-md rounded-full shadow-md hover:scale-110 transition-all duration-300"
    >
      <Heart className={`w-5 h-5 transition-colors duration-300 ${favorite ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'}`} />
    </button>
  );
}
