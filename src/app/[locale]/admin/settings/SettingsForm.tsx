'use client';

import { useState } from 'react';
import { updateSettings, updatePassword } from '@/app/actions/settingsActions';
import { useTranslations } from 'next-intl';

export function SettingsForm({ 
  initialWhatsApp,
  initialEmail,
  initialPhone,
  initialLocation
}: { 
  initialWhatsApp: string,
  initialEmail: string,
  initialPhone: string,
  initialLocation: string
}) {
  const t = useTranslations('Admin');
  const [isPendingSettings, setIsPendingSettings] = useState(false);
  const [isPendingPassword, setIsPendingPassword] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  const handleSettingsSubmit = async (formData: FormData) => {
    setIsPendingSettings(true);
    setSettingsMessage('');
    
    const result = await updateSettings(formData);
    
    if (result.success) {
      setSettingsMessage('Settings updated successfully!');
    } else {
      setSettingsMessage(result.error || 'Something went wrong.');
    }
    
    setIsPendingSettings(false);
  };

  const handlePasswordSubmit = async (formData: FormData) => {
    setIsPendingPassword(true);
    setPasswordMessage('');
    
    const result = await updatePassword(formData);
    
    if (result.success) {
      setPasswordMessage('Password updated successfully!');
    } else {
      setPasswordMessage(result.error || 'Something went wrong.');
    }
    
    setIsPendingPassword(false);
  };

  return (
    <div className="space-y-8">
      {/* General & Contact Settings */}
      <form action={handleSettingsSubmit} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 transition-colors duration-300">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t('storeSettings')}</h2>
        
        {settingsMessage && (
          <div className={`mb-6 p-4 rounded-lg ${settingsMessage.includes('success') ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
            {settingsMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('whatsappNumber')}
            </label>
            <input
              type="text"
              id="whatsappNumber"
              name="whatsappNumber"
              defaultValue={initialWhatsApp}
              required
              className="w-full max-w-md rounded-lg border-gray-300 dark:border-gray-700 border p-3 focus:border-black dark:focus:border-white focus:ring-black dark:focus:ring-white sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="212600000000"
            />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {t('whatsappHelper')}
            </p>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 md:col-span-2 pt-6 mt-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('contactInfo')}</h3>
          </div>

          <div>
            <label htmlFor="storeEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('storeEmail')}
            </label>
            <input
              type="email"
              id="storeEmail"
              name="storeEmail"
              defaultValue={initialEmail}
              className="w-full rounded-lg border-gray-300 dark:border-gray-700 border p-3 focus:border-black dark:focus:border-white focus:ring-black dark:focus:ring-white sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="contact@luxestore.com"
            />
          </div>

          <div>
            <label htmlFor="storePhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('storePhone')}
            </label>
            <input
              type="text"
              id="storePhone"
              name="storePhone"
              defaultValue={initialPhone}
              className="w-full rounded-lg border-gray-300 dark:border-gray-700 border p-3 focus:border-black dark:focus:border-white focus:ring-black dark:focus:ring-white sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="+212 600 000 000"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="storeLocation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('storeLocation')}
            </label>
            <input
              type="text"
              id="storeLocation"
              name="storeLocation"
              defaultValue={initialLocation}
              className="w-full rounded-lg border-gray-300 dark:border-gray-700 border p-3 focus:border-black dark:focus:border-white focus:ring-black dark:focus:ring-white sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Casablanca, Morocco"
            />
          </div>
        </div>

        <div className="mt-8 flex">
          <button
            type="submit"
            disabled={isPendingSettings}
            className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-300 flex items-center font-medium disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPendingSettings ? t('saving') : t('saveSettings')}
          </button>
        </div>
      </form>

      {/* Change Password */}
      <form action={handlePasswordSubmit} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 transition-colors duration-300">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t('changePassword')}</h2>
        
        {passwordMessage && (
          <div className={`mb-6 p-4 rounded-lg ${passwordMessage.includes('success') ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
            {passwordMessage}
          </div>
        )}

        <div className="space-y-6 max-w-md">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('currentPassword')}
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              required
              className="w-full rounded-lg border-gray-300 dark:border-gray-700 border p-3 focus:border-black dark:focus:border-white focus:ring-black dark:focus:ring-white sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('newPassword')}
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              required
              className="w-full rounded-lg border-gray-300 dark:border-gray-700 border p-3 focus:border-black dark:focus:border-white focus:ring-black dark:focus:ring-white sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="mt-8 flex">
          <button
            type="submit"
            disabled={isPendingPassword}
            className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-300 flex items-center font-medium disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPendingPassword ? t('updating') : t('updatePassword')}
          </button>
        </div>
      </form>
    </div>
  );
}
