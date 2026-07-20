'use server';

import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath, revalidateTag } from 'next/cache';

export async function getPropertiesByIds(ids: string[]) {
  if (!ids || ids.length === 0) return [];
  try {
    const properties = await prisma.property.findMany({
      where: {
        id: { in: ids },
        status: 'APPROVED'
      }
    });

    return properties.map((prop: any) => ({
      ...prop,
      price: prop.price ? Number(prop.price) : 0,
      latitude: prop.latitude ? Number(prop.latitude) : null,
      longitude: prop.longitude ? Number(prop.longitude) : null,
      createdAt: prop.createdAt ? prop.createdAt.toISOString() : null,
      updatedAt: prop.updatedAt ? prop.updatedAt.toISOString() : null,
    }));
  } catch (error) {
    console.error("Error fetching favorite properties:", error);
    return [];
  }
}

export async function approveProperty(propertyId: string) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== 'ADMIN') throw new Error("Unauthorized");

  await prisma.property.update({
    where: { id: propertyId },
    data: { status: 'APPROVED' },
  });

  revalidateTag('property', {});
  revalidatePath('/', 'layout');
}

export async function rejectProperty(propertyId: string) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== 'ADMIN') throw new Error("Unauthorized");

  await prisma.property.update({
    where: { id: propertyId },
    data: { status: 'REJECTED' },
  });

  revalidateTag('property', {});
  revalidatePath('/', 'layout');
}

export async function togglePremium(propertyId: string, currentValue: boolean) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== 'ADMIN') throw new Error("Unauthorized");

  await prisma.property.update({
    where: { id: propertyId },
    data: { isPremium: !currentValue },
  });

  revalidateTag('property', {});
  revalidatePath('/', 'layout');
}
