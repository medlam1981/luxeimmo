import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { SettingsForm } from './SettingsForm';
import { getSettings } from '@/lib/settings';

async function AdminSettingsPageContent() {

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


export default async function AdminSettingsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>}>
      <AdminSettingsPageContent />
    </Suspense>
  );
}
