'use client';

import { useFavoritesStore } from '@/store/useFavoritesStore';
import { PropertyCard } from '@/components/storefront/PropertyCard';
import { getPropertiesByIds } from '@/app/actions/propertyActions';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';

export function FavoritesClient({ locale }: { locale: string }) {
  const { favoriteIds } = useFavoritesStore();
  const t = useTranslations('Favorites');

  // SWR fetcher that bridges to the server action
  const fetcher = async (ids: string[]) => {
    if (!ids || ids.length === 0) return [];
    try {
      return await getPropertiesByIds(ids);
    } catch (err: any) {
      if (err.message?.includes('Failed to find Server Action')) {
        console.warn('Stale Server Action during favorites load, ignoring.');
      }
      return [];
    }
  };

  // We use SWR for robust client-side fetching with deduping and automatic revalidation.
  // The key is stringified so SWR can properly cache based on the exact array of IDs.
  const { data: properties, error, isLoading } = useSWR(
    favoriteIds.length > 0 ? JSON.stringify(favoriteIds) : null,
    () => fetcher(favoriteIds),
    {
      revalidateOnFocus: false, // Don't spam DB when tabbing back
    }
  );

  const displayProperties = properties || [];
  const loading = isLoading;

  if (loading) return <div className="text-center py-24 text-gray-500">{t('loading')}</div>;

  if (displayProperties.length === 0) {
    return (
      <div className="text-center py-24 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('emptyTitle')}</h2>
        <p className="text-gray-500">{t('emptyDesc')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
      {displayProperties.map((property: any) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
