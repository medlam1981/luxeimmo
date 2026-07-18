'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getSettings() {
  try {
    let settings = await prisma.storeSettings.findFirst();
    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: { 
          id: 'default', 
          whatsappNumber: '212600000000',
          adminPassword: 'admin123',
          storeEmail: 'contact@luxestore.com',
          storePhone: '+212 600 000 000',
          storeLocation: 'Casablanca, Morocco'
        }
      });
    }
    return settings;
  } catch (e) {
    console.log('Error fetching settings, using fallback');
    return { 
      whatsappNumber: '212600000000',
      storeEmail: 'contact@luxestore.com',
      storePhone: '+212 600 000 000',
      storeLocation: 'Casablanca, Morocco'
    };
  }
}

export async function updateSettings(formData: FormData) {
  try {
    const whatsappNumber = String(formData.get('whatsappNumber') || '');
    const storeEmail = String(formData.get('storeEmail') || '');
    const storePhone = String(formData.get('storePhone') || '');
    const storeLocation = String(formData.get('storeLocation') || '');
    
    if (!whatsappNumber) {
      return { success: false, error: 'WhatsApp number is required.' };
    }

    await prisma.storeSettings.upsert({
      where: { id: 'default' },
      update: { 
        whatsappNumber,
        storeEmail,
        storePhone,
        storeLocation
      },
      create: { 
        id: 'default', 
        whatsappNumber,
        adminPassword: 'admin123',
        storeEmail,
        storePhone,
        storeLocation
      }
    });

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (e: any) {
    console.log('Error updating settings:', e.message);
    return { success: false, error: `Could not update settings: ${e.message}` };
  }
}

export async function updatePassword(formData: FormData) {
  try {
    const currentPassword = String(formData.get('currentPassword') || '');
    const newPassword = String(formData.get('newPassword') || '');
    
    if (!currentPassword || !newPassword) {
      return { success: false, error: 'Both fields are required.' };
    }

    let settings = await prisma.storeSettings.findFirst();
    if (!settings || settings.adminPassword !== currentPassword) {
      return { success: false, error: 'Incorrect current password.' };
    }

    await prisma.storeSettings.update({
      where: { id: settings.id },
      data: { adminPassword: newPassword }
    });

    return { success: true };
  } catch (e: any) {
    console.log('Error updating password:', e.message);
    return { success: false, error: `Could not update password: ${e.message}` };
  }
}
