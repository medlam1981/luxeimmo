import type { Metadata } from "next";
import { Cairo } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL('https://luxeimmo.com'),
  title: {
    template: '%s | LuxeImmo',
    default: 'LuxeImmo | Premium Real Estate & Luxury Villas in Morocco',
  },
  description: 'Discover the finest luxury real estate in Morocco. Browse our exclusive collection of premium villas in Marrakech, authentic riads, and oceanfront apartments in Casablanca.',
  keywords: ['Luxury Real Estate Morocco', 'Buy Villa Marrakech', 'Morocco Properties', 'Casablanca Apartments', 'Riad for sale', 'LuxeImmo', 'Premium Real Estate'],
  openGraph: {
    title: 'LuxeImmo | Premium Real Estate & Luxury Villas in Morocco',
    description: 'Discover the finest luxury real estate in Morocco. Browse our exclusive collection of premium villas in Marrakech, authentic riads, and oceanfront apartments in Casablanca.',
    url: 'https://luxeimmo.com',
    siteName: 'LuxeImmo',
    images: [
      {
        url: 'https://luxeimmo.com/images/hero/slide-1.jpg',
        width: 1200,
        height: 630,
        alt: 'LuxeImmo Premium Moroccan Real Estate',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LuxeImmo | Premium Real Estate & Luxury Villas in Morocco',
    description: 'Discover the finest luxury real estate in Morocco. Browse our exclusive collection of premium villas in Marrakech, authentic riads, and oceanfront apartments in Casablanca.',
    images: ['https://luxeimmo.com/images/hero/slide-1.jpg'],
  },
};

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
      </body>
    </html>
  );
}
