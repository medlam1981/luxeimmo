'use client';

import { MessageCircle, Heart, Bed, Bath, Maximize, MapPin } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import { Property } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { FavoriteButton } from '@/components/storefront/FavoriteButton';
import Image from 'next/image';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const locale = useLocale();
  const t = useTranslations('Property');
  const te = useTranslations('enums');

  useEffect(() => {
    if (property.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [property.images.length]);

  const parseLocalized = (str: string) => {
    try {
      const parsed = JSON.parse(str);
      return parsed[locale] || parsed.en || str;
    } catch {
      return str;
    }
  };

  const displayTitle = parseLocalized(property.title);
  
  let priceDisplay = formatCurrency(property.price);
  if (property.propertyType === 'RENT') {
    if (property.rentalPeriod === 'DAILY') {
      priceDisplay += t('perDay');
    } else if (property.rentalPeriod === 'MONTHLY') {
      priceDisplay += t('perMonth');
    }
  }

  const badgeType = te(`propertyType.${property.propertyType}` as any);
  const badgeCategory = te(`category.${property.category}` as any);

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    const sanitizePhone = (phone: string) => phone.replace(/[\s\-()]/g, '');
    const ownerPhone = property.ownerPhone || "+212600000000";
    const cleanPhone = sanitizePhone(ownerPhone);
    const message = `Hello, I'm interested in "${displayTitle}" in ${property.city}. Can you provide more details? Link: ${window.location.origin}/properties/${property.slug}`;
    const whatsappUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative bg-white dark:bg-gray-950 rounded-2xl shadow-sm hover:shadow-xl dark:shadow-none dark:hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col"
    >
      <Link href={`/properties/${property.slug}`} className="block relative aspect-h-3 aspect-w-4 overflow-hidden bg-gray-200 dark:bg-gray-900 h-56 lg:h-64">
        <div className="absolute top-3 left-3 z-20 flex gap-2">
          <span className="px-3 py-1 bg-black text-white text-xs font-bold rounded-full uppercase tracking-wider">
            {badgeType}
          </span>
          <span className="px-3 py-1 bg-white text-black text-xs font-bold rounded-full uppercase tracking-wider">
            {badgeCategory}
          </span>
        </div>
        <div className="absolute top-3 right-3 z-20">
          <FavoriteButton propertyId={property.id} />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={property.images[currentImageIndex] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80"}
              alt={displayTitle}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
              loading="lazy"
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>
      </Link>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 gap-4">
          <Link href={`/properties/${property.slug}`} className="hover:underline flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
              {displayTitle}
            </h3>
          </Link>
          <p className="text-xl font-bold text-black dark:text-white shrink-0">
            {priceDisplay}
          </p>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center">
          <MapPin className="w-4 h-4 mr-1" /> {property.city}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-700 dark:text-gray-300 mb-6 border-t border-gray-100 dark:border-gray-800 pt-4">
          {property.bedrooms != null && (
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4 text-gray-400" />
              <span>{property.bedrooms} Beds</span>
            </div>
          )}
          {property.bathrooms != null && (
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4 text-gray-400" />
              <span>{property.bathrooms} Baths</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Maximize className="w-4 h-4 text-gray-400" />
            <span>{property.areaSqm} m²</span>
          </div>
        </div>

        <div className="mt-auto">
          <button
            onClick={handleWhatsApp}
            className="w-full flex items-center justify-center bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-3 rounded-xl transition-colors duration-300 font-medium"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            {t('contactAgent')}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
