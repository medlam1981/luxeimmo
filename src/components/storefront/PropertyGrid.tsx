'use client';

import { Property } from '@/types';
import { PropertyCard } from './PropertyCard';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

interface PropertyGridProps {
  properties: Property[];
}

export function PropertyGrid({ properties }: PropertyGridProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const t = useTranslations('PropertyGrid');
  
  if (!isMounted) {
    return (
      <section className="bg-gray-50 dark:bg-gray-900 py-16 transition-colors duration-300">
        <div style={{ minHeight: '400px' }}></div>
      </section>
    );
  }

  if (properties.length === 0) {
    return null;
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-8 md:py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-6 md:mb-10">
          <div>
            <h2 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white font-sans tracking-tight mb-1 md:mb-2">
              {t('title')}
            </h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              {t('subtitle')}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
}
