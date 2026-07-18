'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { FavoriteButton } from './FavoriteButton';

interface ImageGalleryProps {
  images: string[];
  title: string;
  propertyId: string;
}

export function ImageGallery({ images, title, propertyId }: ImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const mainImage = images[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80";
  const displayImages = images.length > 0 ? images : [mainImage];

  return (
    <>
      <div className="space-y-4">
        <div className="relative aspect-video rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-900 group cursor-pointer shadow-sm" onClick={() => { setIndex(0); setIsOpen(true); }}>
          <img src={mainImage} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute top-4 right-4 z-10">
            <FavoriteButton propertyId={propertyId} />
          </div>
        </div>
        
        {displayImages.length > 1 && (
          <div className="grid grid-cols-3 gap-4">
            {displayImages.slice(1, 4).map((img, i) => (
              <div key={i} className="aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-900 cursor-pointer relative group" onClick={() => { setIndex(i + 1); setIsOpen(true); }}>
                <img src={img} alt={`${title} ${i+2}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                {i === 2 && displayImages.length > 4 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-xl backdrop-blur-sm transition-colors group-hover:bg-black/40">
                    +{displayImages.length - 4}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col">
            <div className="flex justify-between items-center p-6 text-white absolute top-0 left-0 w-full z-50">
              <span className="text-sm font-medium tracking-widest">{index + 1} / {displayImages.length}</span>
              <button onClick={() => setIsOpen(false)} className="p-3 hover:bg-white/10 rounded-full transition-colors backdrop-blur-md">
                <X className="w-8 h-8" />
              </button>
            </div>
            
            <div className="flex-1 relative flex items-center justify-center p-4 md:p-12">
              {displayImages.length > 1 && (
                <button 
                  onClick={(e) => { e.stopPropagation(); setIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length); }} 
                  className="absolute left-4 md:left-8 p-4 text-white bg-white/5 hover:bg-white/20 backdrop-blur-md rounded-full transition-colors z-50"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
              )}
              
              <motion.img 
                key={index}
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "tween", duration: 0.3 }}
                src={displayImages[index]} 
                alt={title} 
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" 
              />
              
              {displayImages.length > 1 && (
                <button 
                  onClick={(e) => { e.stopPropagation(); setIndex((prev) => (prev + 1) % displayImages.length); }} 
                  className="absolute right-4 md:right-8 p-4 text-white bg-white/5 hover:bg-white/20 backdrop-blur-md rounded-full transition-colors z-50"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
