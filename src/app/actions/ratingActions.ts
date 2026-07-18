'use server';

import prisma from '@/lib/prisma';

export async function submitRating(propertyId: string, ratingValue: number) {
  try {
    await prisma.rating.create({
      data: {
        propertyId,
        ratingValue,
      },
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to submit rating:', error);
    return { success: false };
  }
}
