'use server';

import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function syncFavoritesAction(localFavoriteIds: string[]) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  const userId = (session.user as any).id as string | undefined;
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    include: { favoriteProperties: true }
  });

  if (!user) return null;

  const dbFavoriteIds = user.favoriteProperties.map((p: any) => p.id);
  const mergedIds = Array.from(new Set([...localFavoriteIds, ...dbFavoriteIds]));

  // Verify which properties actually exist in the DB to avoid connection errors
  const validProperties = await prisma.property.findMany({
    where: { id: { in: mergedIds } },
    select: { id: true }
  });
  const validPropertyIds = validProperties.map((p: any) => p.id);

  // 1. First, check if the user actually exists in the DB
  const existingUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!existingUser) {
    console.error(`User with ID ${user.id} not found in DB. Skipping sync.`);
    return null;
  }

  // 2. Only then, perform the update
  await prisma.user.update({
    where: { id: user.id },
    data: {
      favoriteProperties: {
        set: validPropertyIds.map((id: any) => ({ id }))
      }
    }
  });

  return validPropertyIds;
}
