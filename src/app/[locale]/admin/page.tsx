import { Building, Key, Home } from 'lucide-react';
import prisma from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
export default async function AdminDashboard() {
  const t = await getTranslations('Admin');

  const [totalProperties, propertiesForRent, propertiesForSale] = await Promise.all([
    prisma.property.count(),
    prisma.property.count({ where: { propertyType: 'RENT' } }),
    prisma.property.count({ where: { propertyType: 'SALE' } })
  ]);

  const kpis = [
    { title: t('totalProperties'), value: totalProperties, icon: Building, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: t('propertiesForRent'), value: propertiesForRent, icon: Key, color: 'text-orange-600', bg: 'bg-orange-100' },
    { title: t('propertiesForSale'), value: propertiesForSale, icon: Home, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-sans">{t('overview')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center transition-colors duration-300">
              <div className={`p-4 rounded-xl ${kpi.bg} me-4`}>
                <Icon className={`w-8 h-8 ${kpi.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{kpi.title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{kpi.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
