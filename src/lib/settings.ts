import prisma from '@/lib/prisma';

export async function getSettings() {
  try {
    let settings = await prisma.storeSettings.findFirst();
    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: { 
          id: 'default', 
          whatsappNumber: '212667023870',
          adminPassword: 'admin123',
          storeEmail: 'medlam1981@gmail.com',
          storePhone: '+212 667 023 870',
          storeLocation: 'Casablanca, Morocco'
        }
      });
    } else if (settings.storeEmail === 'contact@luxestore.com') {
      settings = await prisma.storeSettings.update({
        where: { id: settings.id },
        data: {
          whatsappNumber: '212667023870',
          storeEmail: 'medlam1981@gmail.com',
          storePhone: '+212 667 023 870'
        }
      });
    }
    return settings;
  } catch (e) {
    console.log('Error fetching settings, using fallback');
    return { 
      whatsappNumber: '212667023870',
      storeEmail: 'medlam1981@gmail.com',
      storePhone: '+212 667 023 870',
      storeLocation: 'Casablanca, Morocco'
    };
  }
}
