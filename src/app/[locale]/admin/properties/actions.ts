'use server';

import prisma from '@/lib/prisma';
import { revalidatePath, revalidateTag } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function deletePropertyAction(propertyId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { success: false, error: 'Unauthorized' };

    const userId = (session.user as any).id;
    const role = (session.user as any).role;

    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) return { success: false, error: 'Property not found.' };

    // Only the owner or an admin may delete
    if (property.userId !== userId && role !== 'ADMIN') {
      return { success: false, error: 'Forbidden.' };
    }

    await prisma.property.delete({ where: { id: propertyId } });
    revalidateTag('property', {});
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (e) {
    console.error('Error deleting property', e);
    return { success: false, error: 'Could not delete property.' };
  }
}
