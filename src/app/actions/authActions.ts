'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import prisma from '@/lib/prisma';

export async function loginAdmin(formData: FormData) {
  const password = formData.get('password');
  
  let settings = await prisma.storeSettings.findFirst();
  if (!settings) {
    settings = await prisma.storeSettings.create({
      data: { id: 'default', whatsappNumber: '212600000000', adminPassword: 'admin123' }
    });
  }

  if (password === settings.adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set('admin_token', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    
    return { success: true };
  }
  
  return { success: false, error: 'Invalid password.' };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
  redirect('/login');
}
