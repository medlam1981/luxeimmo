'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Users, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function Features() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const t = useTranslations('Features');
  const features = [
    {
      icon: CheckCircle,
      title: t.has('verified') ? t('verified') : 'Verified Properties',
      description: t.has('verifiedDesc') ? t('verifiedDesc') : 'Every property goes through a rigorous physical inspection to ensure quality and authenticity.',
    },
    {
      icon: Users,
      title: t.has('directContact') ? t('directContact') : 'Direct Owner Contact',
      description: t.has('directContactDesc') ? t('directContactDesc') : 'Connect instantly with property owners via WhatsApp to negotiate without hidden fees.',
    },
    {
      icon: MapPin,
      title: t.has('expertAgents') ? t('expertAgents') : 'Expert Local Agents',
      description: t.has('expertAgentsDesc') ? t('expertAgentsDesc') : 'Our dedicated agents provide localized insights and assist you throughout the buying process.',
    },
  ];

  if (!isMounted) {
    return (
      <section className="bg-white dark:bg-gray-950 py-16 border-t border-gray-100 dark:border-gray-900 transition-colors duration-300">
        <div style={{ minHeight: '300px' }}></div>
      </section>
    );
  }

  return (
    <section className="bg-white dark:bg-gray-950 py-16 border-t border-gray-100 dark:border-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-sans tracking-tight">
            {t.has('title') ? t('title') : 'Why Choose LuxeImmo'}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-sm border border-transparent dark:border-gray-800 transition-colors duration-300 hover:shadow-md">
                <div className="h-14 w-14 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
