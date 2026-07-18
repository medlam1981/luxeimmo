'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteCategory(categoryId: string) {
  try {
    // PropertyCategory is an enum, not a separate model — this action is a no-op
    console.log('deleteCategory called with', categoryId);
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (e) {
    console.log('Error deleting category');
    return { success: false, error: 'Could not delete category.' };
  }
}
