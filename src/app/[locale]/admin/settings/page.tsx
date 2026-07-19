import { getTranslations } from 'next-intl/server';
import { SettingsForm } from './SettingsForm';
import { getSettings } from '@/app/actions/settingsActions';
export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const t = await getTranslations('Admin');
  const settings = await getSettings();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-sans">{t('storeSettings')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t('manageSettings')}</p>
        </div>
      </div>

      <SettingsForm 
        initialWhatsApp={settings.whatsappNumber}
        initialEmail={settings.storeEmail || ''}
        initialPhone={settings.storePhone || ''}
        initialLocation={settings.storeLocation || ''}
      />
    </div>
  );
}
