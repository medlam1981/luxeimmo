import { Suspense } from 'react';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from 'next/navigation';
import { ApproveButton, RejectButton, PremiumToggle } from './ApproveButton';
import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';

async function AdminReviewPageContent() {

  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || (session.user as any).role !== 'ADMIN') {
    redirect('/');
  }

  const te = await getTranslations('enums');
  const ta = await getTranslations('Admin');

  const pendingProperties = await prisma.property.findMany({
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'asc' },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          sellerName: true,
          phone: true
        }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-sans">Property Approvals</h1>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Property Title</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Seller Info</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Type & Price</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Premium</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {pendingProperties.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No properties pending review.
                  </td>
                </tr>
              ) : (
                pendingProperties.map((property: any) => {
                  let displayTitle = property.title;
                  try {
                    const parsed = JSON.parse(property.title);
                    displayTitle = parsed.en || parsed.ar || parsed.fr || parsed.es || property.title;
                  } catch {}

                  return (
                    <tr key={property.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 dark:text-white line-clamp-2">
                          {displayTitle}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{property.city} • {te(`category.${property.category}` as any)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{property.user?.sellerName || property.user?.name || 'Unknown'}</div>
                        <div className="text-xs text-gray-500">{property.user?.phone || property.user?.email || property.ownerPhone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900 dark:text-white">{property.price.toString()} MAD</div>
                        <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full font-medium uppercase mt-1 inline-block">
                          {te(`propertyType.${property.propertyType}` as any)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <PremiumToggle id={property.id} isPremium={property.isPremium} labelPremium={ta('premium')} labelUpgrade={ta('upgradePremium')} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            href={`/properties/${property.slug}`}
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
                            target="_blank"
                          >
                            {ta('reviewDetails')}
                          </Link>
                          <ApproveButton id={property.id} label={ta('approve')} />
                          <RejectButton id={property.id} label={ta('reject')} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


export default async function AdminReviewPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>}>
      <AdminReviewPageContent />
    </Suspense>
  );
}
