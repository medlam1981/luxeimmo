import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { getTranslations, getLocale } from 'next-intl/server';
import { DeleteButton } from './DeleteButton';
import { Link } from '@/i18n/routing';
import { formatCurrency } from '@/lib/currency';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const revalidate = 0;

const parseLocalized = (str: string, locale: string) => {
  try {
    const parsed = JSON.parse(str);
    return parsed[locale] || parsed.en || str;
  } catch {
    return str;
  }
};

export default async function AdminPropertiesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || !(session.user as any).id) return null;

  const t = await getTranslations('Admin');
  const tp = await getTranslations('Property');
  const te = await getTranslations('enums');
  const locale = await getLocale();
  
  const properties = await prisma.property.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-sans">{t('manageProperties')}</h1>
        <Link 
          href="/admin/properties/new" 
          className="inline-flex items-center px-4 py-2 bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 text-sm font-medium rounded-xl transition-colors"
        >
          {t('addNewProperty')}
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">{t('propertyTitle')}</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">{t('category')}</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">{t('propertyType')}</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">{t('price')}</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">{t('status')}</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">{t('addedDate')}</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {properties.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    {t('noProperties')}
                  </td>
                </tr>
              ) : (
                properties.map((property: Prisma.PropertyGetPayload<Record<string, never>>) => {
                  const displayTitle = parseLocalized(property.title, locale);
                  const badgeType = te(`propertyType.${property.propertyType}` as any);
                  const badgeCategory = te(`category.${property.category}` as any);

                  let priceDisplay = formatCurrency(Number(property.price));
                  if (property.propertyType === 'RENT') {
                    if (property.rentalPeriod === 'DAILY') {
                      priceDisplay += tp('perDay');
                    } else if (property.rentalPeriod === 'MONTHLY') {
                      priceDisplay += tp('perMonth');
                    }
                  }

                  return (
                    <tr key={property.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 dark:text-white line-clamp-2">
                          {displayTitle}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{property.city}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-full font-medium uppercase tracking-wider">
                          {badgeCategory}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full font-medium uppercase tracking-wider">
                          {badgeType}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                        {priceDisplay}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${property.status === 'APPROVED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : property.status === 'REJECTED' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                          {te(`status.${property.status}` as any)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(property.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link 
                            href={`/admin/properties/${property.id}/edit`}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            aria-label="Edit Property"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                          </Link>
                          <DeleteButton id={property.id} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
