'use client';

import { Heart, Menu, X, LogIn } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { LanguageSwitcher } from '@/components/theme/LanguageSwitcher';
import { useTranslations, useLocale } from 'next-intl';
import { useSession, signIn, signOut } from 'next-auth/react';
import { syncFavoritesAction } from '@/app/actions/favoriteActions';
import { useTheme } from 'next-themes';

export function Navbar() {
  const t = useTranslations('Navbar');
  const locale = useLocale();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { favoriteIds, setFavorites } = useFavoritesStore();
  const totalItems = favoriteIds ? favoriteIds.length : 0;
  
  const { data: session, status } = useSession();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (session?.user && mounted) {
      syncFavoritesAction(favoriteIds).then(syncedIds => {
        if (syncedIds) setFavorites(syncedIds);
      });
    }
  }, [session, mounted]);

  return (
    <header className="fixed top-0 w-full z-50 transition-all duration-300 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo — suppressHydrationWarning allows theme attr to differ between SSR and client */}
          <div className="flex-shrink-0 flex items-center" suppressHydrationWarning>
            <Link href="/" aria-label="LuxeImmo Home">
              <img
                src={resolvedTheme === 'dark' ? '/images/logo-dark.png?v=2' : '/images/logo-light.png?v=2'}
                alt="LuxeImmo"
                className="w-24 sm:w-32 md:w-36 h-auto object-contain"
                suppressHydrationWarning
              />
            </Link>
          </div>
          
          <nav className="hidden md:flex gap-8">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium transition-colors">{t('home')}</Link>
            <Link href="/properties" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium transition-colors">{t('properties')}</Link>
            <Link href="/categories" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium transition-colors">{t('categories')}</Link>
          </nav>

          {/* Right-side icons — use fixed gap to avoid SSR/client class mismatch */}
          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <LanguageSwitcher />

            {status === 'authenticated' && session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center focus:outline-none p-1"
                >
                  <img
                    src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}`}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                  />
                </button>
                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      dir={locale === 'ar' ? 'rtl' : 'ltr'}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-lg py-1 z-50"
                    >
                      <div className={`flex flex-col space-y-1 px-4 py-3 border-b border-gray-100 dark:border-gray-800 ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{session.user.name}</span>
                        <span className="text-xs text-gray-500 truncate">{session.user.email}</span>
                      </div>
                      <div className={`flex flex-col p-2 space-y-1 ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
                        {(session.user as any).role === 'SELLER' || (session.user as any).role === 'ADMIN' ? (
                          <Link className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors text-gray-700 dark:text-gray-300 block" href="/admin" onClick={() => setShowProfileMenu(false)}>
                            {t.has('sellerDashboard') ? t('sellerDashboard') : "لوحة تحكم البائع"}
                          </Link>
                        ) : (
                          <Link className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors text-gray-700 dark:text-gray-300 block" href="/onboarding" onClick={() => setShowProfileMenu(false)}>
                            {t.has('upgradeAccount') ? t('upgradeAccount') : "أضف عقارك (ترقية حساب)"}
                          </Link>
                        )}
                        <button
                          onClick={() => signOut({ callbackUrl: '/' })}
                          className={`px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors w-full ${locale === 'ar' ? 'text-right' : 'text-left'}`}
                        >
                          {t.has('signOut') ? t('signOut') : "تسجيل الخروج"}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : status === 'unauthenticated' ? (
              // On mobile: just a small login icon; full button on sm+
              <>
                <button
                  onClick={() => signIn('google', { callbackUrl: '/' })}
                  className="sm:hidden p-1.5 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
                  aria-label="Sign in"
                >
                  <LogIn className="w-5 h-5" />
                </button>
                <button
                  onClick={() => signIn('google', { callbackUrl: '/' })}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-black text-white dark:bg-white dark:text-black font-medium rounded-full hover:opacity-90 transition-opacity text-sm"
                >
                  <LogIn className="w-4 h-4" />
                  {t.has('signInFallback') ? t('signInFallback') : "Sign In"}
                </button>
              </>
            ) : null}

            {/* Favorites */}
            <Link
              href="/favorites"
              className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-red-500 transition-colors"
              aria-label="Saved Properties"
            >
              <Heart className="w-5 h-5" />
              {mounted && totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 end-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white translate-x-1/4 rtl:-translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full"
                >
                  {totalItems}
                </motion.span>
              )}
            </Link>

            {/* Hamburger — mobile only */}
            <button
              className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800"
          >
            <div className="px-4 pt-2 pb-4 space-y-1 shadow-lg dark:shadow-none bg-white dark:bg-gray-950">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 rounded-md">{t('home')}</Link>
              <Link href="/properties" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 rounded-md">{t('properties')}</Link>
              <Link href="/categories" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 rounded-md">{t('categories')}</Link>
              {status === 'unauthenticated' && (
                <button
                  onClick={() => signIn('google', { callbackUrl: '/' })}
                  className="w-full flex items-center justify-center gap-3 px-3 py-3 mt-4 text-base font-medium text-white bg-black dark:bg-white dark:text-black hover:opacity-90 rounded-xl transition-opacity shadow-sm"
                >
                  <svg className="w-5 h-5 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  {t.has('signInFallback') ? t('signInFallback') : "Sign In / Create Account"}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
