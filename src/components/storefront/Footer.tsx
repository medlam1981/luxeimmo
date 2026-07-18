import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import { Mail, Phone, MapPin } from 'lucide-react';
import { getSettings } from '@/app/actions/settingsActions';

export async function Footer() {
  const t = await getTranslations('Footer');
  const settings = await getSettings();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white font-sans tracking-tight inline-block mb-4">
              {t('brandName')}
            </Link>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
              {t('brandDesc')}
            </p>
          </div>

          <div>
            <h4 className="text-gray-900 dark:text-white font-bold mb-4">{t('aboutUs')}</h4>
            <ul className="space-y-3">
              <li><Link href="/properties" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">{t('shop')}</Link></li>
              <li><Link href="/categories" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">{t('categories')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 dark:text-white font-bold mb-4">{t('contactUs')}</h4>
            <div className="flex flex-col gap-4">
              {settings.storeEmail && (
                <a href={`mailto:${settings.storeEmail}`} className="flex items-center gap-3 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                  <div className="h-10 w-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center shadow-sm">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-sm truncate">{settings.storeEmail}</span>
                </a>
              )}
              {settings.storePhone && (
                <a href={`tel:${settings.storePhone}`} className="flex items-center gap-3 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                  <div className="h-10 w-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center shadow-sm">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-sm">{settings.storePhone}</span>
                </a>
              )}
              {settings.storeLocation && (
                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                  <div className="h-10 w-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center shadow-sm">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-sm">
                    {settings.storeLocation === 'Casablanca, Morocco' ? t('address') : settings.storeLocation}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} {t('brandName')}. {t('rights')}</p>
        </div>
      </div>
    </footer>
  );
}
