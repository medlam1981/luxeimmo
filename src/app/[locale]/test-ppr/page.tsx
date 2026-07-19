import { setRequestLocale } from 'next-intl/server';
import { Navbar } from '@/components/storefront/Navbar';
import { Footer } from '@/components/storefront/Footer';

export default async function TestPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <Navbar />
      <h1>Test PPR</h1>
      <Footer locale={locale} />
    </main>
  );
}
