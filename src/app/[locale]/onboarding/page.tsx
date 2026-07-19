'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useSession } from 'next-auth/react';
import { upgradeToSeller } from '@/app/actions/onboardingActions';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import ar from 'react-phone-number-input/locale/ar';
import { useTranslations } from 'next-intl';

const CustomFlag = ({ country, countryName }: any) => {
  const [error, setError] = useState(false);
  if (error || !country) {
    return <span className="text-xs font-bold text-gray-500 w-6 inline-block text-center">{country}</span>;
  }
  return (
    <img
      src={`https://flagcdn.com/w20/${country.toLowerCase()}.png`}
      srcSet={`https://flagcdn.com/w40/${country.toLowerCase()}.png 2x`}
      alt={countryName}
      className="w-6 h-auto inline-block object-contain"
      onError={() => setError(true)}
    />
  );
};

export default function OnboardingPage() {
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState<string | undefined>('');
  const router = useRouter();
  const { update } = useSession();
  const t = useTranslations('Onboarding');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await upgradeToSeller(formData);
      await update();
      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('Failed to find Server Action')) {
        window.location.reload();
      } else {
        alert(t('error'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {t('title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {t('subtitle')}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="sellerName" className="sr-only">{t('agencyName')}</label>
              <input
                id="sellerName"
                name="sellerName"
                type="text"
                required
                className="appearance-none rounded-xl relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-900 focus:outline-none focus:ring-black focus:border-black dark:focus:ring-white dark:focus:border-white focus:z-10 sm:text-sm"
                placeholder={t('agencyName')}
              />
            </div>
            <div>
              <label htmlFor="phone" className="sr-only">{t('phone')}</label>
              <div dir="ltr" className="appearance-none rounded-xl relative flex w-full px-3 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus-within:ring-1 focus-within:ring-black dark:focus-within:ring-white">
                <PhoneInput
                  international
                  defaultCountry="MA"
                  value={phone}
                  onChange={setPhone}
                  flagComponent={CustomFlag}
                  className="w-full bg-transparent focus:outline-none outline-none ring-0 border-none px-2"
                />
                <input type="hidden" name="phone" value={phone || ''} />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
            >
              {loading ? t('submitting') : t('submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
