import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { SecureContactButton } from '@/components/storefront/SecureContactButton';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'PrivacyPolicy' });
  const tMeta = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('title'),
    description: t('intro'),
    alternates: {
      canonical: `https://luxeimmo.com/${locale}/privacy-policy`,
    },
    openGraph: {
      title: `${t('title')} | ${tMeta('siteName')}`,
      description: t('intro'),
      url: `https://luxeimmo.com/${locale}/privacy-policy`,
    }
  };
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'PrivacyPolicy' });
  const tFooter = await getTranslations({ locale, namespace: 'Footer' });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 sm:p-12">
          <div className="max-w-3xl mx-auto space-y-12">
            
            <header className="text-center space-y-4">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight font-sans">
                {t('title')}
              </h1>
              <div className="w-24 h-1 bg-black dark:bg-white mx-auto rounded-full"></div>
            </header>

            <div className="prose prose-lg dark:prose-invert max-w-none prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-500 transition-colors">
              
              <p className="lead text-xl text-gray-700 dark:text-gray-300 font-medium">
                {t('intro')}
              </p>

              <section className="mt-10">
                <h2 className="text-2xl">{t('section1Title')}</h2>
                <p>{t('section1Text')}</p>
              </section>

              <section className="mt-10">
                <h2 className="text-2xl">{t('section2Title')}</h2>
                <p>{t('section2Text')}</p>
              </section>

              <section className="mt-10">
                <h2 className="text-2xl">{t('section3Title')}</h2>
                <p>{t('section3Text')}</p>
              </section>

              <section className="mt-10">
                <h2 className="text-2xl">{t('section4Title')}</h2>
                <p>{t('section4Text')}</p>
                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-4 mt-6 rounded-r-xl">
                  <p className="text-blue-800 dark:text-blue-200 m-0 text-sm font-medium">
                    {t('section4Note')}
                  </p>
                </div>
              </section>

              <section className="mt-10">
                <h2 className="text-2xl">{t('section5Title')}</h2>
                <p>{t('section5Text')}</p>
              </section>

              <section className="mt-10 bg-gray-50 dark:bg-gray-800/50 p-8 rounded-2xl">
                <h2 className="text-2xl mt-0">{t('section6Title')}</h2>
                <p className="mb-6">{t('section6Text')}</p>
                <div className="flex justify-start">
                  <SecureContactButton 
                    type="email" 
                    value="medlam1981@gmail.com" 
                    label={tFooter('emailUs')} 
                  />
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
