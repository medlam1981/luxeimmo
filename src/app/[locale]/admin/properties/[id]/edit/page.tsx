import { PropertyForm } from '@/components/admin/PropertyForm';
import { updateProperty } from '@/app/[locale]/admin/properties/new/actions';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPropertyPage({ params }: Props) {
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

  return <PropertyForm initialData={serializedProperty} actionFn={updateProperty} isEdit={true} />;
}
