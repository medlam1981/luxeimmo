import { Suspense } from 'react';
import { Building, PlusCircle, PenTool, Clock, FileText, Package, Tags, ChevronRight } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';

async function AdminDashboardContent() {
  const t = await getTranslations('Admin');
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user && (session.user as any).role === 'ADMIN';

  const navItems = [
    { label: t('manageProperties'), href: '/admin/properties', icon: Package }
  ];

  if (isAdmin) {
    navItems.push({ label: 'Review Properties', href: '/admin/review', icon: Tags });
    navItems.push({ label: 'Blog Posts', href: '/admin/posts', icon: FileText });
  }

  const [totalActiveProperties, totalPublishedPosts, pendingReviews] = await Promise.all([
    prisma.property.count({ where: { status: 'APPROVED' } }),
    prisma.post.count({ where: { published: true } }),
    prisma.property.count({ where: { status: 'PENDING' } })
  ]);

  const metrics = [
    { title: t('total_active_properties'), value: totalActiveProperties, icon: Building, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { title: t('total_published_posts'), value: totalPublishedPosts, icon: FileText, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
    { title: t('pending_reviews'), value: pendingReviews, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  ];

  return (
    <div className="flex flex-col gap-8 w-full p-4 lg:p-8">
      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('quick_actions')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/admin/properties/new" className="flex flex-col items-center justify-center p-3 md:p-6 bg-blue-600 text-white rounded-2xl shadow-sm hover:bg-blue-700 transition-colors">
            <PlusCircle className="w-5 h-5 md:w-8 md:h-8 mb-2 md:mb-3" />
            <span className="font-semibold text-center text-sm md:text-base">{t('add_property')}</span>
          </Link>
          <Link href="/admin/posts/new" className="flex flex-col items-center justify-center p-3 md:p-6 bg-gray-900 dark:bg-gray-800 text-white rounded-2xl shadow-sm hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors">
            <PenTool className="w-5 h-5 md:w-8 md:h-8 mb-2 md:mb-3" />
            <span className="font-semibold text-center text-sm md:text-base">{t('add_post')}</span>
          </Link>
        </div>
      </section>

      {/* Content Summary */}
      <section className="mt-2">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('content_summary')}</h2>
        <div className="flex flex-col md:grid md:grid-cols-3 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 flex items-center transition-colors duration-300">
                <div className={`p-4 rounded-xl ${metric.bg} me-4`}>
                  <Icon className={`w-8 h-8 ${metric.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{metric.title}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {/* Platform Management */}
      <section className="mt-2">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('platform_management')}</h2>
        <div className="flex flex-col gap-3">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link key={index} href={item.href as any} className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                    <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white text-lg">{item.label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 rtl:rotate-180 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default async function AdminDashboard() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}
