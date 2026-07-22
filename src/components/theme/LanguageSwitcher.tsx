'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function LanguageSwitcher({ dropup = false, align = 'end' }: { dropup?: boolean; align?: 'start' | 'end' | 'left' | 'right' }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' },
  ];

  const switchLanguage = (newLocale: string) => {
    if (!pathname) return;
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    // Use hard navigation to bypass stale Client Router Cache and guarantee fresh Server Action IDs
    window.location.assign(newPath);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignClass = 
    align === 'start' ? 'start-0' : 
    align === 'left' ? 'left-0' : 
    align === 'right' ? 'right-0' : 
    'end-0';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
        aria-label="Change language"
      >
        <Globe className="w-5 h-5" />
        <span className="text-sm font-bold uppercase">{locale}</span>
      </button>

      {isOpen && (
        <div className={`absolute ${dropup ? 'bottom-full mb-2' : 'top-full mt-2'} ${alignClass} w-40 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 py-2 z-50 premium-card`} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLanguage(lang.code)}
              className={`w-full ${locale === 'ar' ? 'text-right' : 'text-left'} px-4 py-2 text-sm transition-colors ${
                locale === lang.code
                  ? 'bg-gray-50 dark:bg-gray-800 text-black dark:text-white font-semibold'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
