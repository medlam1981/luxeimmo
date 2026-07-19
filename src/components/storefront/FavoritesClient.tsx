'use client';

import { useFavoritesStore } from '@/store/useFavoritesStore';
import { useEffect, useState } from 'react';
import { PropertyCard } from '@/components/storefront/PropertyCard';
import { getPropertiesByIds } from '@/app/actions/propertyActions';
import { useTranslations } from 'next-intl';

export function FavoritesClient({ locale }: { locale: string }) {
  const { favoriteIds } = useFavoritesStore();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations('Favorites');

  useEffect(() => {
    async function load() {
      if (favoriteIds.length > 0) {
        try {
          const data = await getPropertiesByIds(favoriteIds);
          setProperties(data);
        } catch (err: any) {
          if (err.message?.includes('Failed to find Server Action')) {
            console.warn('Stale Server Action during favorites load, ignoring to prevent reload loop.');
          }
          setProperties([]);
        }
      } else {
        setProperties([]);
      }
      setLoading(false);
    }
    load();
  }, [favoriteIds]);

  if (loading) return <div className="text-center py-24 text-gray-500">{t('loading')}</div>;

  if (properties.length === 0) {
    return (
      <div className="text-center py-24 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('emptyTitle')}</h2>
        <p className="text-gray-500">{t('emptyDesc')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((p: any) => <PropertyCard key={p.id} property={p} />)}
    </div>
  );
}
