import { PropertyForm } from '@/components/admin/PropertyForm';
import { updateProperty } from '@/app/[locale]/admin/properties/new/actions';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

import { Suspense } from 'react';

async function EditPropertyContent({ params }: Props) {
  const { id } = await params;
  
  const property = await prisma.property.findUnique({
    where: { id }
  });

  if (!property) {
    notFound();
  }

  const serializedProperty = {
    ...property,
    price: property.price ? Number(property.price) : 0,
    latitude: property.latitude ? Number(property.latitude) : null,
    longitude: property.longitude ? Number(property.longitude) : null,
    createdAt: property.createdAt ? property.createdAt.toISOString() : null,
    updatedAt: property.updatedAt ? property.updatedAt.toISOString() : null,
  };

  return <PropertyForm initialData={serializedProperty as any} actionFn={updateProperty} isEdit={true} />;
}

export default async function EditPropertyPage({ params }: Props) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>}>
      <EditPropertyContent params={params} />
    </Suspense>
  );
}
