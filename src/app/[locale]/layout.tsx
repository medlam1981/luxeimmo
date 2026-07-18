import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "../globals.css";

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["latin", "arabic"],
  display: 'swap',
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
});

import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('Metadata');

  return {
    metadataBase: new URL('https://luxeimmo.com'),
    title: {
      template: `%s | ${t('siteName')}`,
      default: t('defaultTitle'),
    },
    description: t('description'),
    keywords: [t('keyword1'), t('keyword2'), t('keyword3'), t('keyword4'), t('keyword5')],
    openGraph: {
      title: t('defaultTitle'),
      description: t('description'),
      url: 'https://luxeimmo.com',
      siteName: t('siteName'),
      images: [
        {
          url: 'https://luxeimmo.com/images/hero/slide-1.jpg',
          width: 1200,
          height: 630,
          alt: t('defaultTitle'),
        },
      ],
      locale: locale === 'en' ? 'en_US' : locale === 'ar' ? 'ar_MA' : locale === 'fr' ? 'fr_FR' : 'es_ES',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('defaultTitle'),
      description: t('description'),
      images: ['https://luxeimmo.com/images/hero/slide-1.jpg'],
    },
  };
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      className={`${cairo.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
            </ThemeProvider>
          </AuthProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
