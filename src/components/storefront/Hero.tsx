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
    <div className="w-full pb-2 md:pb-4">
      <div className="bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-lg flex flex-row gap-2 w-full max-w-4xl mx-auto items-stretch border border-gray-200 dark:border-blue-500/40 dark:shadow-[0_0_15px_rgba(59,130,246,0.2)] focus-within:border-blue-400 focus-within:shadow-xl dark:focus-within:border-blue-400 dark:focus-within:shadow-[0_0_25px_rgba(59,130,246,0.4)] transition-all duration-300">
        {/* City Search Input */}
        <div className="flex-1 min-w-0">
          <input 
            type="text" 
            placeholder={t('searchPlaceholder')} 
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full h-10 sm:h-12 px-2 sm:px-4 rounded-xl border-2 border-gray-200 dark:border-indigo-500/30 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-black dark:focus:border-blue-400 transition-colors text-xs sm:text-base"
          />
        </div>

        {/* Property Type Dropdown */}
        <div className="relative w-24 sm:w-44 shrink-0">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full h-10 sm:h-12 px-2 sm:px-4 rounded-xl border-2 border-gray-200 dark:border-indigo-500/30 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-black dark:focus:border-blue-400 transition-colors flex items-center justify-between text-xs sm:text-base"
          >
            <span className="truncate">{propertyType === 'SALE' ? t('forSale') : t('forRent')}</span>
            <ChevronDown className={`w-3 h-3 sm:w-5 sm:h-5 shrink-0 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.ul
                initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-indigo-500/30 rounded-xl z-50 overflow-hidden origin-top premium-card"
              >
                <li>
                  <button
                    type="button"
                    onClick={() => { setPropertyType('SALE'); setIsDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 sm:px-4 sm:py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-xs sm:text-base ${propertyType === 'SALE' ? 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white font-semibold' : 'text-gray-700 dark:text-gray-300'}`}
                  >
                    {t('forSale')}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => { setPropertyType('RENT'); setIsDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 sm:px-4 sm:py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-xs sm:text-base ${propertyType === 'RENT' ? 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white font-semibold' : 'text-gray-700 dark:text-gray-300'}`}
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
          className="w-10 h-10 sm:w-auto sm:h-12 shrink-0 inline-flex items-center justify-center px-0 sm:px-6 font-semibold bg-transparent text-slate-800 dark:text-slate-200 hover:bg-blue-500/10 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 dark:hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] rounded-xl transition-all duration-300 text-base focus:outline-none focus:bg-blue-500/10 dark:focus:bg-blue-900/20 dark:focus:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
        >
          <Search className="w-4 h-4 sm:w-5 sm:h-5 sm:rtl:ml-2 sm:ltr:mr-2" />
          <span className="hidden sm:inline">{t('search')}</span>
        </Link>
      </div>
    </div>
  );
}
