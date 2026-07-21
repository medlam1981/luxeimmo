'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { Property } from '@/types';
import { useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export function Hero() {
  const [city, setCity] = useState('');
  const [propertyType, setPropertyType] = useState('SALE');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const t = useTranslations('Hero');

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      
      {/* Static Background Image */}
      <div className="absolute inset-0 z-0 bg-black">
        <Image
          src="/images/hero/marrakech-riad.jpg"
          alt="Luxury Riad in Marrakech"
          fill
          className="object-cover"
          priority={true}
          sizes="100vw"
          quality={60}
        />
      </div>
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* Content Wrapper */}
      <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full drop-shadow-2xl">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 font-sans drop-shadow-lg animate-fade-in-up">
          {t('title')}
        </h1>
        
        <div className="mt-4 text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-10 drop-shadow-md animate-fade-in-up animation-delay-200">
          {t('subtitle')}
        </div>
        
        <div className="bg-white dark:bg-gray-900 p-3 sm:p-4 rounded-2xl shadow-2xl flex flex-col sm:flex-row gap-3 w-full max-w-3xl mx-auto items-stretch border border-gray-200 dark:border-gray-700 animate-fade-in-up animation-delay-400">
          {/* City Search Input */}
          <div className="w-full sm:flex-1 sm:min-w-0">
            <input 
              type="text" 
              placeholder={t('searchPlaceholder')} 
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full h-12 sm:h-14 px-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors text-base"
            />
          </div>

          {/* Property Type Dropdown */}
          <div className="relative w-full sm:w-44 shrink-0">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full h-12 sm:h-14 px-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors flex items-center justify-between text-base"
            >
              <span>{propertyType === 'SALE' ? t('forSale') : t('forRent')}</span>
              <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
                  animate={{ opacity: 1, y: 0, scaleY: 1 }}
                  exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden origin-top"
                >
                  <li>
                    <button
                      type="button"
                      onClick={() => { setPropertyType('SALE'); setIsDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${propertyType === 'SALE' ? 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white font-semibold' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      {t('forSale')}
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => { setPropertyType('RENT'); setIsDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${propertyType === 'RENT' ? 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white font-semibold' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      {t('forRent')}
                    </button>
                  </li>
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* Search Button */}
          <Link 
            href={`/search?city=${city}&type=${propertyType}`}
            className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center h-12 sm:h-14 px-8 font-semibold text-white bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 rounded-xl transition-all duration-300 shadow-md hover:shadow-xl text-base"
          >
            <Search className="w-5 h-5 mr-2" />
            {t('search')}
          </Link>
        </div>
      </div>
    </section>
  );
}
