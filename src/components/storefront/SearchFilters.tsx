'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, FormEvent } from 'react';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { CustomSelect } from '@/components/ui/CustomSelect';

interface FiltersProps {
  initialFilters: {
    city: string;
    type: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
  };
}

export function SearchFilters({ initialFilters }: FiltersProps) {
  const router = useRouter();
  const t = useTranslations('Search');
  const tAdmin = useTranslations('Admin');
  
  const [city, setCity] = useState(initialFilters.city || '');
  const [type, setType] = useState(initialFilters.type || 'SALE');
  const [category, setCategory] = useState(initialFilters.category || '');
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice?.toString() || '');
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice?.toString() || '');
  const [bedrooms, setBedrooms] = useState(initialFilters.bedrooms?.toString() || '');
  const [bathrooms, setBathrooms] = useState(initialFilters.bathrooms?.toString() || '');

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (type) params.set('type', type);
    if (category) params.set('category', category);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (bedrooms) params.set('bedrooms', bedrooms);
    if (bathrooms) params.set('bathrooms', bathrooms);
    
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-6 sticky top-24">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('location')}</label>
        <input 
          type="text" 
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder={t('locationPlaceholder')}
          className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('propertyType')}</label>
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          <button type="button" onClick={() => setType('SALE')} className={`flex-1 py-2 text-sm rounded-lg font-medium transition-colors ${type === 'SALE' ? 'bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>{t('buy')}</button>
          <button type="button" onClick={() => setType('RENT')} className={`flex-1 py-2 text-sm rounded-lg font-medium transition-colors ${type === 'RENT' ? 'bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>{t('rent')}</button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('category')}</label>
        <CustomSelect
          value={category}
          onChange={setCategory}
          options={[
            { value: '', label: t('allCategories') },
            { value: 'APARTMENT', label: tAdmin('apartment_name') },
            { value: 'VILLA', label: tAdmin('villa_name') },
            { value: 'COMMERCIAL', label: tAdmin('commercial_name') },
            { value: 'LAND', label: tAdmin('land_name') }
          ]}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('minPrice')}</label>
          <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('maxPrice')}</label>
          <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('bedrooms')}</label>
          <input type="number" min="1" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('bathrooms')}</label>
          <input type="number" min="1" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
        </div>
      </div>

      <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black font-semibold py-3 rounded-xl flex justify-center items-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-md">
        <Search className="w-5 h-5" /> {t('applyFilters')}
      </button>
    </form>
  );
}
