'use server';

import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function upgradeToSeller(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error('Unauthorized');

  const sellerName = formData.get('sellerName') as string;
  const phone = formData.get('phone') as string;

  if (!sellerName || !phone) throw new Error('Missing fields');

  await prisma.user.update({
    where: { email: session.user.email },
    data: { role: 'SELLER', sellerName, phone }
  });

  return { success: true };
}
